import { ReactNode } from 'react'

export interface SectionProps {
  id?: string
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}

export default function Section({ id, title, subtitle, action, children }: SectionProps) {
  const headingId = title ? `${id ?? 'section'}-title` : undefined

  return (
    <section id={id} className="section" aria-labelledby={headingId}>
      <div className="container-narrow">
        {title && (
          <div className="section-heading">
            <h2 id={headingId}>{title}</h2>
            {action ?? (subtitle && (
              <p>{subtitle}</p>
            ))}
          </div>
        )}
        {action && subtitle && <p className="section-intro">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
