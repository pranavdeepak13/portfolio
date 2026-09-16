import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()

test('authoritative portfolio docs describe the current content and contact architecture', async () => {
  const [agents, context, workflow] = await Promise.all([
    readFile(path.join(root, 'codex/AGENTS.md'), 'utf8'),
    readFile(path.join(root, 'codex/docs/portfolio-context.md'), 'utf8'),
    readFile(path.join(root, 'codex/docs/portfolio-workflow.md'), 'utf8')
  ])

  assert.doesNotMatch(agents, /src\/utils\/seo\.ts/)
  assert.doesNotMatch(context, /https:\/\/yourdomain\.com/)
  assert.doesNotMatch(context, /validation currently happens in the browser/i)
  assert.doesNotMatch(context, /content links intentionally use `#`/i)
  assert.match(context, /browser and server/i)
  assert.match(context, /rate limit/i)
  assert.match(context, /\{year\}/)
  assert.match(context, /\{name\}/)
  assert.match(workflow, /\{year\}/)
  assert.match(workflow, /\{name\}/)
})
