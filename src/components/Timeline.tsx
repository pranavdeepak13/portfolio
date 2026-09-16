import Section from '@/components/Section'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

interface TimelineProps {
  section: PortfolioContent['sections']['experience']
  items: PortfolioContent['experience']
}

export default function Timeline({ section, items }: TimelineProps) {
  return (
    <Section
      id="experience"
      title={section.title}
      subtitle={section.subtitle}
    >
      {items.length === 0 && <p className="text-white/55">{section.empty}</p>}
      <ol className="experience-list">
        {items.map((item) => (
          <li key={item.id}>
            <time>{item.period}</time>
            <article>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <ul aria-label={`${item.title} technologies`} className="tag-list">
                {item.stack.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  )
}
