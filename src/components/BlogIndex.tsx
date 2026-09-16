import type { BlogPostSummary } from '@/lib/content/blog'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`))
}

interface BlogIndexProps {
  posts: BlogPostSummary[]
  writing: PortfolioContent['writing']
  empty: PortfolioContent['sections']['writing']['empty']
}

export default function BlogIndex({ posts, writing, empty }: BlogIndexProps) {
  if (posts.length === 0) {
    return <p className="blog-empty">{empty}</p>
  }

  return (
    <section className="blog-index" aria-labelledby="blog-index-title">
      <h2 id="blog-index-title" className="sr-only">{writing.indexLabel}</h2>
      <ol>
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="blog-index-row">
              <p className="blog-index-meta">
                <span>{post.category}</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>{post.readTime}</span>
              </p>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <a className="blog-index-hit" href={`/blog/${post.slug}`} aria-label={`${writing.readLabel} ${post.title}`} />
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
