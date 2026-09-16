import Image from 'next/image'
import Section from '@/components/Section'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

interface HobbiesProps {
  section: PortfolioContent['sections']['hobbies']
  items: PortfolioContent['hobbies']
}

export default function Hobbies({ section, items }: HobbiesProps) {
  return (
    <Section
      id="hobbies"
      title={section.title}
      subtitle={section.subtitle}
    >
      {items.length === 0 && <p className="text-white/55">{section.empty}</p>}
      <ul className="hobbies-grid">
        {items.map((hobby) => (
          <li key={hobby.id}>
            <article>
              <div className="hobby-image">
                <Image
                  src={hobby.src}
                  alt={hobby.alt}
                  fill
                  sizes="(min-width: 1100px) 280px, (min-width: 640px) 45vw, calc(100vw - 56px)"
                  className="hobby-image-media"
                  style={{ objectPosition: hobby.objectPosition }}
                />
              </div>
              <h3 className="mt-4 text-xl font-medium tracking-tight">{hobby.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{hobby.blurb}</p>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  )
}
