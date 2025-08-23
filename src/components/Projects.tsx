'use client'
import Section from './Section'
import { projects } from '@/utils/data'
import Tilt from './Tilt'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const chipClasses = [
  'bg-accent/30 text-neutral-900 dark:text-neutral-100',
  'bg-cyan/20 text-neutral-900 dark:text-neutral-100',
  'bg-rose/20 text-neutral-900 dark:text-neutral-100',
  'bg-moss/20 text-neutral-900 dark:text-neutral-100',
  'bg-amber/20 text-neutral-900 dark:text-neutral-100',
  'bg-purple/20 text-neutral-900 dark:text-neutral-100'
]

export default function Projects() {
  const [active, setActive] = useState<string | null>(null)
  const current = projects.find(p => p.slug === active)

  return (
    <Section id="projects" title="Things I've Built (That Actually Work)" subtitle="Trial by error, heavy on the trial">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <Tilt key={p.slug} className="cursor-pointer" onClick={() => setActive(p.slug)} max={12}>
            <motion.article
              className="card p-6 h-full"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <header className="mb-2">
                <h3 className="font-display text-xl">{p.title}</h3>
                <p className="text-sm opacity-75">{p.subtitle}</p>
              </header>
              <p className="opacity-90 text-sm">{p.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.tech.map((t, j) => (
                  <span
                    key={t}
                    className={`text-xs rounded-full px-2 py-1 ring-1 ring-inset ring-black/5 dark:ring-white/10 ${chipClasses[j % chipClasses.length]}`}
                  >
                    {t}
                  </span>
                ))}
              </ul>
            </motion.article>
          </Tilt>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="card max-w-3xl w-full p-6"
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.96 }}
            >
              <header className="mb-3">
                <h3 className="font-display text-2xl">{current.title}</h3>
                <p className="text-sm opacity-75">{current.subtitle}</p>
              </header>
              <p className="mb-4">{current.details ?? current.description}</p>
              {current.metrics?.length ? (
                <ul className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {current.metrics.map(m => (
                    <li key={m} className="rounded bg-white/60 dark:bg-white/10 px-3 py-2">
                      {m}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex items-center gap-3">
                {/* <a href={current.links.demo} target="_blank" rel="noreferrer" className="no-underline">
                  Live
                </a> */}
                <span aria-hidden>·</span>
                <a href={current.links.repo} target="_blank" rel="noreferrer" className="no-underline">
                  Code
                </a>
              </div>
              <button
                onClick={() => setActive(null)}
                className="mt-6 px-3 py-2 rounded border border-concrete-200 dark:border-white/20"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
