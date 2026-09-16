import 'server-only'
import { z } from 'zod'

const emailListSchema = z
  .string()
  .transform((value) => value.split(',').map((email) => email.trim()).filter(Boolean))
  .pipe(z.array(z.string().email()).min(1))

const contactEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.string().min(3),
  CONTACT_TO: emailListSchema,
  REPLY_TO: z.string().email().optional()
})

export function getContactServerConfig() {
  const result = contactEnvSchema.safeParse({
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    CONTACT_TO: process.env.CONTACT_TO,
    REPLY_TO: process.env.REPLY_TO || undefined
  })

  if (!result.success) return null

  return {
    resendApiKey: result.data.RESEND_API_KEY,
    from: result.data.RESEND_FROM,
    to: result.data.CONTACT_TO,
    replyTo: result.data.REPLY_TO
  }
}
