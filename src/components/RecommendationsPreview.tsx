import Section from '@/components/Section'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

interface RecommendationsPreviewProps {
  section: PortfolioContent['sections']['recommendations']
  content: PortfolioContent['recommendations']
}

export default function RecommendationsPreview({ section, content }: RecommendationsPreviewProps) {
  return (
    <Section
      id="recommendations"
      title={section.title}
      action={<a className="text-link interactive-target" href="/recommendations">{section.viewAllLabel}</a>}
    >
      {content.items.length === 0 && <p className="text-white/55">{section.empty}</p>}
      <ul className="home-writing-grid">
        {content.items.slice(0, content.previewLimit).map((item) => (
          <li key={item.id}>
            <a className="home-writing-card" href="/recommendations" aria-label={`Explore recommendations, including ${item.title}`}>
              <p className="home-editorial-meta">
                <span>{content.labels[item.kind]}</span>
              </p>
              <h3>{item.title}</h3>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
