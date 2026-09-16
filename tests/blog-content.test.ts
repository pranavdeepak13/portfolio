import assert from 'node:assert/strict'
import test from 'node:test'
import {
  calculateReadingTime,
  parseBlogDocument,
  selectPublishedPosts
} from '../src/lib/content/blog-parser.ts'

test('reading time has a one minute minimum', () => {
  assert.equal(calculateReadingTime('A short article.'), '1 min read')
})

test('frontmatter rejects unknown cover fields and invalid dates', () => {
  assert.throws(() => parseBlogDocument('bad.md', [
    '---',
    'title: Bad',
    'description: Bad article.',
    'date: tomorrow',
    'category: Notes',
    'published: true',
    'cover: /bad.jpg',
    '---',
    'Body'
  ].join('\n')))
})

test('frontmatter produces a safe slug and calculated summary', () => {
  const post = parseBlogDocument('hello-world.md', [
    '---',
    'title: Hello world',
    'description: A sample article.',
    'date: 2026-09-13',
    'category: Notes',
    'published: true',
    '---',
    'Hello world.'
  ].join('\n'))

  assert.equal(post.slug, 'hello-world')
  assert.equal(post.readTime, '1 min read')
  assert.equal(post.body.trim(), 'Hello world.')
})

test('unsafe filenames cannot become public slugs', () => {
  const source = [
    '---',
    'title: Unsafe',
    'description: Unsafe filename.',
    'date: 2026-09-13',
    'category: Notes',
    'published: true',
    '---',
    'Body'
  ].join('\n')

  assert.throws(() => parseBlogDocument('../unsafe.md', source))
})

test('published posts are filtered and sorted newest first', () => {
  const document = (title: string, date: string, published: boolean) => [
    '---',
    `title: ${title}`,
    `description: ${title} article.`,
    `date: ${date}`,
    'category: Notes',
    `published: ${published}`,
    '---',
    `${title}.`
  ].join('\n')

  const oldPost = parseBlogDocument('old.md', document('Old', '2026-01-01', true))
  const draft = parseBlogDocument('draft.md', document('Draft', '2026-12-01', false))
  const newPost = parseBlogDocument('new.md', document('New', '2026-09-13', true))

  assert.deepEqual(
    selectPublishedPosts([oldPost, draft, newPost]).map((post) => post.slug),
    ['new', 'old']
  )
})
