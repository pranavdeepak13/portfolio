import matter from 'gray-matter'
import { z } from 'zod'

const frontmatterSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(240),
  date: z.preprocess(
    (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value,
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  ),
  category: z.string().trim().min(1).max(40),
  published: z.boolean()
}).strict()

export interface BlogPostSummary {
  slug: string
  title: string
  description: string
  date: string
  category: string
  readTime: string
}

export interface BlogPost extends BlogPostSummary {
  published: boolean
  body: string
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function calculateReadingTime(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/[#[\]()*_>~|-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return `${Math.max(1, Math.ceil(words / 220))} min read`
}

export function parseBlogDocument(filename: string, source: string): BlogPost {
  if (!filename.endsWith('.md') || filename !== filename.split('/').at(-1)) {
    throw new Error(`Invalid blog filename: ${filename}`)
  }

  const slug = filename.slice(0, -3)
  if (!slugPattern.test(slug)) {
    throw new Error(`Invalid blog slug: ${slug}`)
  }

  const parsed = matter(source)
  const metadata = frontmatterSchema.safeParse(parsed.data)
  if (!metadata.success) {
    throw new Error(`Invalid blog frontmatter in ${filename}: ${metadata.error.message}`)
  }

  const body = parsed.content.trim()
  if (!body) {
    throw new Error(`Blog article has no body: ${filename}`)
  }

  return {
    slug,
    ...metadata.data,
    body,
    readTime: calculateReadingTime(body)
  }
}

export function selectPublishedPosts(posts: BlogPost[]) {
  return posts
    .filter((post) => post.published)
    .sort((left, right) => right.date.localeCompare(left.date))
}

export function toBlogPostSummary(post: BlogPost): BlogPostSummary {
  const { body: _body, published: _published, ...summary } = post
  return summary
}

export function isSafeBlogSlug(slug: string) {
  return slugPattern.test(slug)
}
