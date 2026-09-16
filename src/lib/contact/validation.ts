export interface ContactValidationCopy {
  nameRequired: string
  nameTooShort: string
  nameTooLong: string
  nameUnsafe: string
  emailRequired: string
  emailTooLong: string
  emailInvalid: string
  messageRequired: string
  messageTooShort: string
  messageTooLong: string
  messageUnsafe: string
}

export interface ContactMessage {
  name: string
  email: string
  message: string
  website?: string
}

export type ContactInput = ContactMessage

type ContactField = keyof ContactMessage

interface ContactIssue {
  path: ContactField[]
  message: string
}

const allowedFields = new Set<ContactField>(['name', 'email', 'message', 'website'])
const emailPattern = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i
const unsafeSingleLineControls = /[\u0000\r\n]/
const unsafeMessageControls = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export class ContactValidationError extends Error {
  readonly issues: ContactIssue[]

  constructor(issues: ContactIssue[]) {
    super('Contact validation failed')
    this.name = 'ContactValidationError'
    this.issues = issues
  }

  flatten() {
    const fieldErrors: Partial<Record<ContactField, string[]>> = {}
    const formErrors: string[] = []

    for (const issue of this.issues) {
      const field = issue.path[0]
      if (!field) {
        formErrors.push(issue.message)
        continue
      }
      const messages = fieldErrors[field] ?? []
      messages.push(issue.message)
      fieldErrors[field] = messages
    }

    return { formErrors, fieldErrors }
  }
}

function addStringIssue(
  issues: ContactIssue[],
  field: ContactField,
  value: unknown,
  invalidTypeMessage: string
): value is string {
  if (typeof value === 'string') return true
  issues.push({ path: [field], message: invalidTypeMessage })
  return false
}

export function createContactValidator(copy: ContactValidationCopy) {
  function safeParse(input: unknown):
    | { success: true; data: ContactMessage }
    | { success: false; error: ContactValidationError } {
    if (!isRecord(input)) {
      return {
        success: false,
        error: new ContactValidationError([{ path: [], message: 'Expected a contact form object.' }])
      }
    }

    const issues: ContactIssue[] = []
    const unknownFields = Object.keys(input).filter((field) => !allowedFields.has(field as ContactField))
    if (unknownFields.length > 0) {
      issues.push({ path: [], message: `Unexpected field${unknownFields.length === 1 ? '' : 's'}: ${unknownFields.join(', ')}` })
    }

    let name: string | undefined
    if (addStringIssue(issues, 'name', input.name, copy.nameRequired)) {
      name = input.name.trim()
      if (name.length < 2) issues.push({ path: ['name'], message: copy.nameTooShort })
      if (name.length > 80) issues.push({ path: ['name'], message: copy.nameTooLong })
      if (unsafeSingleLineControls.test(name)) issues.push({ path: ['name'], message: copy.nameUnsafe })
    }

    let email: string | undefined
    if (addStringIssue(issues, 'email', input.email, copy.emailRequired)) {
      email = input.email.trim()
      if (email.length > 254) issues.push({ path: ['email'], message: copy.emailTooLong })
      if (!emailPattern.test(email)) issues.push({ path: ['email'], message: copy.emailInvalid })
    }

    let message: string | undefined
    if (addStringIssue(issues, 'message', input.message, copy.messageRequired)) {
      message = input.message.trim()
      if (message.length < 5) issues.push({ path: ['message'], message: copy.messageTooShort })
      if (message.length > 4000) issues.push({ path: ['message'], message: copy.messageTooLong })
      if (unsafeMessageControls.test(message)) issues.push({ path: ['message'], message: copy.messageUnsafe })
    }

    let website: string | undefined
    if (input.website !== undefined) {
      if (typeof input.website !== 'string') {
        issues.push({ path: ['website'], message: 'Expected website to be a string.' })
      } else {
        website = input.website
        if (website.length > 0) issues.push({ path: ['website'], message: 'Website must be empty.' })
      }
    }

    if (issues.length > 0 || name === undefined || email === undefined || message === undefined) {
      return { success: false, error: new ContactValidationError(issues) }
    }

    return {
      success: true,
      data: website === undefined ? { name, email, message } : { name, email, message, website }
    }
  }

  return {
    safeParse,
    parse(input: unknown) {
      const result = safeParse(input)
      if (!result.success) throw result.error
      return result.data
    }
  }
}
