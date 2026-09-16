'use client'

import { useMemo, useRef, useState } from 'react'
import { createContactValidator } from '@/lib/contact/validation'
import type { ContactCopy } from '@/lib/content/portfolio-schema'

type FieldName = 'name' | 'email' | 'message'
type FieldErrors = Partial<Record<FieldName, string>>
type Status = { tone: 'idle' | 'success' | 'error'; message: string }

const idleStatus: Status = { tone: 'idle', message: '' }

export default function ContactSticky({ content }: { content: ContactCopy }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<Status>(idleStatus)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const contactValidator = useMemo(() => createContactValidator(content.validation), [content.validation])

  const openDialog = () => {
    setOpen(true)
    setStatus(idleStatus)
    dialogRef.current?.showModal()
    requestAnimationFrame(() => nameRef.current?.focus())
  }

  const closeDialog = () => dialogRef.current?.close()

  const handleClosed = () => {
    setOpen(false)
    setErrors({})
    triggerRef.current?.focus()
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      message: String(formData.get('message') ?? ''),
      website: String(formData.get('website') ?? '')
    }
    const parsed = contactValidator.safeParse(payload)

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      const nextErrors: FieldErrors = {
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        message: fieldErrors.message?.[0]
      }
      setErrors(nextErrors)
      setStatus({ tone: 'error', message: content.messages.invalid })
      const firstInvalid = (['name', 'email', 'message'] as const).find((field) => nextErrors[field])
      if (firstInvalid) (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus()
      return
    }

    setErrors({})
    setStatus({ tone: 'idle', message: content.messages.sending })
    setLoading(true)

    try {
      const result = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data)
      })
      const body = await result.json().catch(() => null) as { delivery?: string; error?: string } | null

      if (result.ok && body?.delivery === 'sent') {
        form.reset()
        setStatus({ tone: 'success', message: content.messages.success })
      } else if (result.status === 429) {
        setStatus({ tone: 'error', message: content.messages.rateLimited })
      } else {
        setStatus({ tone: 'error', message: content.messages.failure })
      }
    } catch {
      setStatus({ tone: 'error', message: content.messages.network })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="contact-trigger interactive-target"
        aria-expanded={open}
        aria-controls="contact-dialog"
        onClick={openDialog}
      >
        {content.triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        id="contact-dialog"
        className="contact-dialog"
        aria-labelledby="contact-title"
        aria-describedby="contact-intro"
        onClose={handleClosed}
      >
        <div className="project-dialog-header">
          <div>
            <p className="editorial-kicker">{content.eyebrow}</p>
            <h2 id="contact-title">{content.title}</h2>
          </div>
          <button type="button" className="dialog-close interactive-target" aria-label={content.closeLabel} onClick={closeDialog}>
            <span aria-hidden>×</span>
          </button>
        </div>
        <p id="contact-intro" className="mt-4 max-w-[50ch] text-sm leading-relaxed text-white/60">
          {content.intro}
        </p>

        <form className="contact-form" onSubmit={onSubmit} noValidate>
          <div className="contact-field">
            <label htmlFor="contact-name">{content.fields.name.label}</label>
            <input
              ref={nameRef}
              id="contact-name"
              name="name"
              autoComplete={content.fields.name.autoComplete}
              required
              maxLength={80}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'contact-name-error' : undefined}
            />
            {errors.name && <p id="contact-name-error" className="field-error">{errors.name}</p>}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email">{content.fields.email.label}</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete={content.fields.email.autoComplete}
              required
              maxLength={254}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
            />
            {errors.email && <p id="contact-email-error" className="field-error">{errors.email}</p>}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">{content.fields.message.label}</label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              maxLength={4000}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'contact-message-error' : undefined}
            />
            {errors.message && <p id="contact-message-error" className="field-error">{errors.message}</p>}
          </div>

          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">{content.fields.website.label}</label>
            <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <button type="submit" className="button-primary interactive-target mt-1" disabled={loading}>
            {loading ? content.submittingLabel : content.submitLabel}
          </button>
          <p className={`contact-status contact-status-${status.tone}`} role="status" aria-live="polite">
            {status.message}
          </p>
        </form>
      </dialog>
    </>
  )
}
