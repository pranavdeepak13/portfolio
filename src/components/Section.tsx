import { ReactNode } from 'react'

export interface SectionProps {
  id?: string
  title?: string
  subtitle?: string
  children: ReactNode
}

export default function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="container-narrow">
        {title && (
          <div className="mb-6">
            <h2 className="font-display text-3xl tracking-tight">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm md:text-base font-display font-normal tracking-tight text-neutral-700 dark:text-neutral-300 leading-snug">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
