'use client'

import { useEffect, useRef, useState } from 'react'
import Section from '@/components/Section'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

interface ProjectsProps {
  section: PortfolioContent['sections']['projects']
  items: PortfolioContent['projects']
}

export default function Projects({ section, items }: ProjectsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const current = items.find((project) => project.slug === activeSlug)

  useEffect(() => {
    if (!current || !dialogRef.current) return
    dialogRef.current.showModal()
    closeButtonRef.current?.focus()
  }, [current])

  const openProject = (slug: string, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setActiveSlug(slug)
  }

  const closeProject = () => {
    dialogRef.current?.close()
  }

  const handleClosed = () => {
    setActiveSlug(null)
    triggerRef.current?.focus()
  }

  return (
    <Section
      id="projects"
      title={section.title}
      subtitle={section.subtitle}
    >
      {items.length === 0 && <p className="text-white/55">{section.empty}</p>}
      <ul className="projects-grid">
        {items.map((project) => (
          <li key={project.slug}>
            <article className="project-card">
              <button
                type="button"
                className="project-card-trigger"
                aria-haspopup="dialog"
                aria-label={`View details for ${project.title}`}
                onClick={(event) => openProject(project.slug, event.currentTarget)}
              />
              <div className="project-card-copy">
                <p className="editorial-kicker">{project.subtitle}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ul className="tag-list mt-5" aria-label={`${project.title} technologies`}>
                  {project.tech.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {current && (
        <dialog
          ref={dialogRef}
          className="project-dialog"
          aria-labelledby={`project-${current.slug}-title`}
          aria-describedby={`project-${current.slug}-description`}
          onClose={handleClosed}
        >
          <div className="project-dialog-header">
            <div>
              <p className="editorial-kicker">{current.subtitle}</p>
              <h2 id={`project-${current.slug}-title`}>{current.title}</h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className="dialog-close interactive-target"
              aria-label={`Close ${current.title} details`}
              onClick={closeProject}
            >
              <span aria-hidden>×</span>
            </button>
          </div>

          <p id={`project-${current.slug}-description`} className="mt-6 leading-relaxed text-white/70">
            {current.details ?? current.description}
          </p>

          {current.metrics?.length ? (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {current.metrics.map((metric) => (
                <li key={metric} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                  {metric}
                </li>
              ))}
            </ul>
          ) : null}

          <ul className="mt-7 flex flex-wrap gap-3">
            {current.links.repo && (
              <li>
                <a className="button-primary interactive-target" href={current.links.repo} target="_blank" rel="noopener noreferrer">
                  {section.codeLabel} <span aria-hidden>↗</span>
                </a>
              </li>
            )}
            {current.links.demo && (
              <li>
                <a className="button-secondary interactive-target" href={current.links.demo} target="_blank" rel="noopener noreferrer">
                  {section.demoLabel} <span aria-hidden>↗</span>
                </a>
              </li>
            )}
          </ul>
        </dialog>
      )}
    </Section>
  )
}
