import Section from '@/components/Section'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

interface MiscProps {
  section: PortfolioContent['sections']['sideQuests']
  items: PortfolioContent['sideQuests']
}

export default function Misc({ section, items }: MiscProps) {
  return (
    <Section
      id="misc"
      title={section.title}
      subtitle={section.subtitle}
    >
      {items.length === 0 && <p className="text-white/55">{section.empty}</p>}
      <ul className="misc-grid">
        {items.map((item) => (
            <li key={item.slug}>
              <article className="misc-card">
                <p className="editorial-kicker">{item.title}</p>
                <h3>{item.subtitle}</h3>
                <p>{item.details}</p>
                {item.links?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-4">
                    {item.links.map((link) => (
                      <li key={link.label}>
                        <a className="text-link" href={link.href} target="_blank" rel="noopener noreferrer">
                          {link.label} <span aria-hidden>↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </li>
        ))}
      </ul>
    </Section>
  )
}
