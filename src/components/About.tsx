import Image from 'next/image'
import Section from '@/components/Section'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

interface AboutProps {
  content: PortfolioContent['about']
  socials: PortfolioContent['site']['socials']
  socialsLabel: PortfolioContent['site']['socialsLabel']
}

export default function About({ content, socials, socialsLabel }: AboutProps) {
  return (
    <Section id="about">
      <div className="about-grid">
        <div className="about-portrait">
          <Image
            src={content.portrait.src}
            alt={content.portrait.alt}
            fill
            sizes="(min-width: 768px) 360px, calc(100vw - 56px)"
            className="about-portrait-image"
          />
        </div>

        <div className="about-copy">
          <p className="editorial-kicker">{content.eyebrow}</p>
          <h3>{content.headline}</h3>
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="mt-8 flex flex-wrap gap-3">
            {content.actions.map((action) => (
              <a key={action.href} href={action.href} className="button-secondary interactive-target">
                {action.label}
              </a>
            ))}
          </div>

          <ul aria-label={socialsLabel} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
            {socials.map((social) => (
              <li key={social.label}>
                <a className="text-link" href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
