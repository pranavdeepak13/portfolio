export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createContactValidator } from '@/lib/contact/validation'
import { portfolioContent } from '@/lib/content/portfolio'
import { escapeHtml, messageToHtml } from '@/lib/contact/format'
import { contactRateLimiter } from '@/lib/contact/rate-limit'
import { getContactServerConfig } from '@/lib/server-env'
import { appendContactRow } from '@/lib/sheets'

const MAX_REQUEST_BYTES = 8192
const contactValidator = createContactValidator(portfolioContent.contact.validation)

function response(status: number, data: Record<string, unknown>, headers?: HeadersInit) {
  return NextResponse.json(data, { status, headers })
}

function getVisitorKey(request: Request) {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) {
    return response(415, { ok: false, error: 'unsupported_media_type' })
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return response(413, { ok: false, error: 'payload_too_large' })
  }

  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return response(403, { ok: false, error: 'forbidden_origin' })
  }

  const rateLimit = contactRateLimiter.check(getVisitorKey(request))
  if (!rateLimit.allowed) {
    return response(
      429,
      { ok: false, error: 'rate_limited' },
      { 'Retry-After': String(rateLimit.retryAfterSeconds) }
    )
  }

  let rawBody: string
  try {
    rawBody = await request.text()
  } catch {
    return response(400, { ok: false, error: 'invalid_request' })
  }

  if (Buffer.byteLength(rawBody, 'utf8') > MAX_REQUEST_BYTES) {
    return response(413, { ok: false, error: 'payload_too_large' })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return response(400, { ok: false, error: 'invalid_json' })
  }

  const parsed = contactValidator.safeParse(payload)
  if (!parsed.success) {
    return response(422, {
      ok: false,
      error: 'validation_failed',
      fields: parsed.error.flatten().fieldErrors
    })
  }

  const config = getContactServerConfig()
  if (!config) {
    return response(503, { ok: false, error: 'service_unavailable' })
  }

  const requestId = crypto.randomUUID()
  const resend = new Resend(config.resendApiKey)
  let emailSent = false

  try {
    const result = await Promise.race([
      resend.emails.send({
        from: config.from,
        to: config.to,
        subject: `New portfolio message from ${parsed.data.name}`,
        text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
        html: [
          `<p><strong>From:</strong> ${escapeHtml(parsed.data.name)} &lt;${escapeHtml(parsed.data.email)}&gt;</p>`,
          `<p>${messageToHtml(parsed.data.message)}</p>`
        ].join(''),
        reply_to: config.replyTo ?? parsed.data.email
      }),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('email_timeout')), 8000)
      })
    ])

    emailSent = Boolean(result.data?.id)
  } catch {
    emailSent = false
  }

  const sheetResult = await appendContactRow({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    status: emailSent ? 'email_sent' : 'email_failed'
  })

  if (!emailSent) {
    return response(502, {
      ok: false,
      error: 'delivery_failed',
      requestId,
      logged: sheetResult.ok
    })
  }

  return response(200, {
    ok: true,
    delivery: 'sent',
    requestId,
    logged: sheetResult.ok
  })
}
