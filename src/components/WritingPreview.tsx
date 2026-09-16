import Section from '@/components/Section'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'
import { getPublishedPosts } from '@/lib/content/blog'

interface WritingPreviewProps {
  section: PortfolioContent['sections']['writing']
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`))
}

export default async function WritingPreview({ section }: WritingPreviewProps) {
  const posts = (await getPublishedPosts()).slice(0, section.previewLimit)

  return (
    <Section
      id="writing"
      title={section.title}
      action={<a className="text-link interactive-target" href="/blog">{section.viewAllLabel}</a>}
    >
      {posts.length === 0 && <p className="text-white/55">{section.empty}</p>}
      <ol className="home-writing-grid">
        {posts.map((post) => (
          <li key={post.slug}>
            <a className="home-writing-card" href={`/blog/${post.slug}`}>
              <p className="home-editorial-meta">
                <span>{post.category}</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>{post.readTime}</span>
              </p>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </a>
          </li>
        ))}
      </ol>
    </Section>
  )
}
