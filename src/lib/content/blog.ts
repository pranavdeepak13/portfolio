import 'server-only'

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  isSafeBlogSlug,
  parseBlogDocument,
  selectPublishedPosts,
  toBlogPostSummary,
  type BlogPost,
  type BlogPostSummary
} from '@/lib/content/blog-parser'

const blogDirectory = path.join(process.cwd(), 'content', 'blog')

async function readPost(filename: string): Promise<BlogPost> {
  const source = await readFile(path.join(blogDirectory, filename), 'utf8')
  return parseBlogDocument(filename, source)
}

export async function getPublishedPosts(): Promise<BlogPostSummary[]> {
  const filenames = (await readdir(blogDirectory)).filter((filename) => filename.endsWith('.md'))
  const posts = await Promise.all(filenames.map(readPost))
  return selectPublishedPosts(posts).map(toBlogPostSummary)
}

export async function getPublishedSlugs() {
  const posts = await getPublishedPosts()
  return posts.map((post) => post.slug)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSafeBlogSlug(slug)) return null

  try {
    const post = await readPost(`${slug}.md`)
    return post.published ? post : null
  } catch (error) {
    const code = error instanceof Error && 'code' in error
      ? (error as NodeJS.ErrnoException).code
      : undefined

    if (code === 'ENOENT') return null
    throw error
  }
}

export type { BlogPost, BlogPostSummary } from '@/lib/content/blog-parser'
