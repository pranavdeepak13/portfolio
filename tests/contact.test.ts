import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createContactValidator } from '../src/lib/contact/validation.ts'
import type { ContactValidationCopy } from '../src/lib/contact/validation.ts'
import { escapeHtml, neutralizeSpreadsheetCell } from '../src/lib/contact/format.ts'
import { createRateLimiter } from '../src/lib/contact/rate-limit.ts'

const rawPortfolio = JSON.parse(readFileSync(path.join(process.cwd(), 'src/content/portfolio.json'), 'utf8'))
const validation = rawPortfolio.contact.validation as ContactValidationCopy
const contactSchema = createContactValidator(validation)

async function localRuntimeImports(entry: string) {
  const visited = new Set<string>()

  async function visit(file: string) {
    if (visited.has(file)) return
    visited.add(file)
    const source = await readFile(file, 'utf8')
    const imports = source.matchAll(/^import(?!\s+type\b)[^'"\n]*['"](@\/[^'"]+)['"]/gm)

    for (const match of imports) {
      const relative = match[1].slice(2)
      const base = path.join(process.cwd(), 'src', relative)
      const candidates = [`${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
      const resolved = candidates.find((candidate) => {
        try {
          readFileSync(candidate)
          return true
        } catch {
          return false
        }
      })
      if (resolved) await visit(resolved)
    }
  }

  await visit(path.join(process.cwd(), entry))
  return visited
}

test('contact client runtime dependency graph excludes Zod and the portfolio schema', async () => {
  const files = await localRuntimeImports('src/components/ContactSticky.tsx')
  const sources = await Promise.all([...files].map((file) => readFile(file, 'utf8')))

  assert.equal([...files].some((file) => file.endsWith('portfolio-schema.ts')), false)
  assert.equal(sources.some((source) => /from ['"]zod['"]/.test(source)), false)
})

test('contact schema uses injected messages for every configured validation rule', () => {
  const copy = Object.fromEntries(Object.keys(validation).map((key) => [key, `custom ${key}`])) as typeof validation
  const schema = createContactValidator(copy)
  const valid = { name: 'Valid name', email: 'person@example.com', message: 'A useful message.' }
  const cases: Array<[keyof typeof valid, unknown, keyof typeof copy]> = [
    ['name', [], 'nameRequired'], ['name', 'x', 'nameTooShort'], ['name', 'x'.repeat(81), 'nameTooLong'], ['name', 'A\nB', 'nameUnsafe'],
    ['email', {}, 'emailRequired'], ['email', `${'x'.repeat(250)}@example.com`, 'emailTooLong'], ['email', 'invalid', 'emailInvalid'],
    ['message', true, 'messageRequired'], ['message', 'no', 'messageTooShort'], ['message', 'x'.repeat(4001), 'messageTooLong'], ['message', 'bad\u0000message', 'messageUnsafe']
  ]
  for (const [field, value, message] of cases) {
    const result = schema.safeParse({ ...valid, [field]: value })
    assert.equal(result.success, false, message)
    if (!result.success) assert.ok(result.error.issues.some((issue) => issue.message === copy[message]), message)
  }
})

test('contact validation preserves bounds, controls, honeypot and strict field rules', () => {
  const valid = { name: 'A'.repeat(80), email: 'person@example.com', message: 'x'.repeat(4000) }
  assert.equal(contactSchema.safeParse(valid).success, true)
  assert.equal(contactSchema.safeParse({ ...valid, name: 'Ab', message: '12345' }).success, true)
  for (const control of ['\u0000', '\r', '\n']) assert.equal(contactSchema.safeParse({ ...valid, name: `A${control}B` }).success, false)
  for (const control of ['\u0000', '\u0008', '\u000b', '\u000c', '\u000e', '\u001f', '\u007f']) {
    assert.equal(contactSchema.safeParse({ ...valid, message: `Hello${control}world` }).success, false)
  }
  assert.equal(contactSchema.safeParse({ ...valid, message: 'Hello\n\r\tworld' }).success, true)
  assert.equal(contactSchema.safeParse({ ...valid, website: '' }).success, true)
  assert.equal(contactSchema.safeParse({ ...valid, website: 'bot' }).success, false)
  assert.equal(contactSchema.safeParse({ ...valid, unexpected: true }).success, false)
})

test('contact schema trims valid input', () => {
  const result = contactSchema.parse({
    name: '  Pranav  ',
    email: '  person@example.com  ',
    message: '  A useful message.  '
  })

  assert.deepEqual(result, {
    name: 'Pranav',
    email: 'person@example.com',
    message: 'A useful message.'
  })
})

test('contact schema rejects invalid types and oversized values', () => {
  assert.equal(contactSchema.safeParse({ name: [], email: {}, message: true }).success, false)
  assert.equal(
    contactSchema.safeParse({
      name: 'Valid name',
      email: 'person@example.com',
      message: 'x'.repeat(4001)
    }).success,
    false
  )
})

test('contact schema preserves the established email checks', () => {
  const valid = { name: 'Valid name', message: 'A useful message.' }

  for (const email of ["first.last+tag@example.co.uk", "name_o'hare@example.com"]) {
    assert.equal(contactSchema.safeParse({ ...valid, email }).success, true, email)
  }

  for (const email of ['person@example', '.person@example.com', 'person..name@example.com', 'person@-example.com']) {
    assert.equal(contactSchema.safeParse({ ...valid, email }).success, false, email)
  }
})

test('HTML escaping encodes all special characters', () => {
  assert.equal(
    escapeHtml(`&<>"'`),
    '&amp;&lt;&gt;&quot;&#39;'
  )
})

test('spreadsheet values neutralize formulas after whitespace and control characters', () => {
  for (const value of ['=SUM(1,2)', ' +cmd', '\t-2+3', '\n@IMPORTXML("x")']) {
    assert.equal(neutralizeSpreadsheetCell(value).startsWith("'"), true)
  }

  assert.equal(neutralizeSpreadsheetCell('ordinary text'), 'ordinary text')
})

test('rate limiter rejects requests over the window budget and then resets', () => {
  const limiter = createRateLimiter({ limit: 2, windowMs: 1000 })

  assert.equal(limiter.check('visitor', 0).allowed, true)
  assert.equal(limiter.check('visitor', 100).allowed, true)
  assert.equal(limiter.check('visitor', 200).allowed, false)
  assert.equal(limiter.check('visitor', 1001).allowed, true)
})
