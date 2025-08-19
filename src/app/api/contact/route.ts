export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { appendContactRow } from '@/lib/sheets'

function ok(data: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...data })
}
function err(status = 500, data: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: false, ...data }, { status })
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    if (!name || !email || !message) return err(400, { error: 'Invalid payload' })

    const resendKey = process.env.RESEND_API_KEY
    const from = process.env.RESEND_FROM
    const toEnv = process.env.CONTACT_TO
    const replyTo = process.env.REPLY_TO || email
    if (!resendKey || !from || !toEnv) return err(500, { error: 'Email not configured' })

    const to = toEnv.split(',').map(s => s.trim()).filter(Boolean)
    const resend = new Resend(resendKey)

    const result = await resend.emails.send({
      from,
      to,
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${String(message).replace(/</g, '&lt;')}</p>`,
      reply_to: replyTo
    })

    const emailSent = !!result?.data?.id

    const ip = request.headers.get('x-forwarded-for') || ''
    const ua = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const sheetRes = await appendContactRow({
      name,
      email,
      message,
      status: emailSent ? 'email_sent' : 'email_failed',
      ip, ua, referer
    })

    if (emailSent || sheetRes.ok) return ok({ email: emailSent, sheet: sheetRes.ok })
    return err(502, { email: emailSent, sheet: sheetRes.ok })
  } catch {
    return err(500, { error: 'unexpected' })
  }
}
