import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()

test('blog routes include static article generation and a legacy redirect', async () => {
  const [articleRoute, writingRoute] = await Promise.all([
    readFile(path.join(root, 'src/app/blog/[slug]/page.tsx'), 'utf8'),
    readFile(path.join(root, 'src/app/writing/page.tsx'), 'utf8')
  ])

  assert.match(articleRoute, /generateStaticParams/)
  assert.match(articleRoute, /getPostBySlug/)
  assert.match(writingRoute, /permanentRedirect\(['"]\/blog['"]\)/)
})

test('blog markdown rendering enables GFM without raw HTML', async () => {
  const renderer = await readFile(path.join(root, 'src/components/BlogArticle.tsx'), 'utf8')

  assert.match(renderer, /remarkGfm/)
  assert.doesNotMatch(renderer, /rehypeRaw|rehype-raw/)
})
