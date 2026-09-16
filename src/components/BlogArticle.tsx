import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { BlogPost } from '@/lib/content/blog'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`))
}

export default function BlogArticle({ post, writing }: { post: BlogPost; writing: PortfolioContent['writing'] }) {
  return (
    <article className="blog-article">
      <header className="blog-article-header">
        <a className="text-link interactive-target" href="/blog">{writing.backLabel}</a>
        <p className="blog-article-category">{post.category}</p>
        <h1>{post.title}</h1>
        <p className="blog-article-description">{post.description}</p>
        <p className="blog-article-meta">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readTime}</span>
        </p>
      </header>

      <div className="blog-prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children, node: _node, ...props }) => {
              const external = href?.startsWith('https://')
              return (
                <a
                  {...props}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
                  {children}
                </a>
              )
            }
          }}
        >
          {post.body}
        </ReactMarkdown>
      </div>
    </article>
  )
}
