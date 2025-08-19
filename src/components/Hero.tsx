'use client'
import { motion } from 'framer-motion'
import Section from './Section'
import { useParallax } from '@/hooks/useParallax'

const socials = [
  { href: 'https://github.com/pranavdeepak13', label: 'GitHub', icon: 'github' },
  { href: 'https://www.linkedin.com/in/pranav-deepak13/', label: 'LinkedIn', icon: 'linkedin' },
  { href: 'https://medium.com/@pranavdeepak13', label: 'Medium', icon: 'medium' },
  { href: 'https://letterboxd.com/pranavdeepak13/', label: 'Letterboxd', icon: 'letterboxd' }
]

function Icon({ name }: { name: string }) {
  if (name === 'github') return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a9.9 9.9 0 0 0-3 19.3c.48.09.66-.21.66-.47v-1.86c-2.7.59-3.27-1.2-3.27-1.2-.44-1.14-1.07-1.45-1.07-1.45-.88-.6.07-.59.07-.59 1 .07 1.52 1.05 1.52 1.05 .87 1.5 2.3 1.06 2.86.81 .09-.64.34-1.06.62-1.31-2.15-.25-4.41-1.08-4.41-4.8 0-1.06.38-1.92 1-2.6-.1-.25-.44-1.27.1-2.65 0 0 .82-.27 2.7 1.01A9.2 9.2 0 0 1 12 7.1c.83 0 1.68.11 2.47.32 1.88-1.28 2.7-1.01 2.7-1.01 .54 1.38.2 2.4.1 2.65 .63.68 1 1.54 1 2.6 0 3.73-2.27 4.55-4.43 4.79 .35.3.66.9.66 1.82v2.69c0 .26.17.57.67.47A9.9 9.9 0 0 0 12 2z" fill="currentColor"/></svg>
  )
  if (name === 'linkedin') return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3.5 9h3v12h-3zM9 9h2.8v1.7h.04C12.5 9.7 13.7 9 15.4 9c3 0 3.6 2 3.6 4.6V21h-3v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21H9z" fill="currentColor"/></svg>
  )
  if (name === 'medium') return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5c0-.2 0-.3-.2-.5L2.3 5V5h5.6l4.3 9.4L16 5h5l-1.4 1.8c-.1.1-.2.3-.2.5V18c0 .2 0 .3.2.5L21 20h-6.1l-1.6-3.6L10.5 20H4l1.3-1.5c.2-.2.2-.3.2-.5z" fill="currentColor"/></svg>
  )
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M7 12c2-2 8-2 10 0" stroke="currentColor" strokeWidth="2" fill="none"/></svg>
  )
}

export default function Hero() {
  const { ySlow, yMedium, yFast } = useParallax()
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_SHEET_URL 

  return (
    <Section id="hero">
      <div className="relative overflow-hidden rounded-2xl card">
        <motion.div style={{ y: ySlow }} className="absolute -top-16 -right-10 h-64 w-64 rounded-sm bg-white/10" />
        <motion.div style={{ y: yMedium }} className="absolute top-10 -left-12 h-48 w-48 rotate-6 rounded-sm bg-white/10" />
        <motion.div style={{ y: yFast }} className="absolute -bottom-12 right-1/3 h-28 w-80 -rotate-3 rounded-sm bg-accent/30" />
        <div className="relative p-10 sm:p-16">
          <div className="h-1 w-32 bg-gradient-to-r from-accent via-cyan to-rose rounded mb-4" />
          <h1 className="font-display text-4xl sm:text-5xl mb-3 tracking-tight">Ideate - Design - Build - Test</h1>
          <p className="max-w-2xl opacity-90">
            I turn everyday headaches into code that just works—because life's too short for manual dashboards and broken recommendation engines.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <motion.a
              href="#projects"
              aria-label="Jump to Projects"
              className="group relative inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium no-underline"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent via-cyan to-rose opacity-100" />
              <span className="absolute inset-[1px] rounded-[10px] bg-black/5 dark:bg-white/5 backdrop-blur" />
              <span className="relative flex items-center gap-2">
                Explore Projects
                <motion.svg
                  width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
                  initial={{ x: 0 }} whileHover={{ x: 2 }}
                  className="opacity-90"
                >
                  <path d="M13 5l7 7-7 7M5 12h14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </span>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-r from-white/20 via-white/40 to-white/20 blur-md opacity-0 group-hover:opacity-40"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.a>

            <motion.a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Request access to resume"
              className="relative inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-3 text-sm font-medium no-underline"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative flex items-center gap-2">
                Request Resume
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                  <path d="M12 17a1.5 1.5 0 0 0 1.5-1.5V11a3.5 3.5 0 0 0-7 0v4.5A1.5 1.5 0 0 0 8 17h4Zm4-6v6a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-6h2v-1a5 5 0 0 1 10 0v1h2Z" fill="currentColor"/>
                </svg>
              </span>
              <span className="ml-2 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            </motion.a>
          </div>

          <ul aria-label="Social links" className="mt-8 flex items-center gap-5">
            {socials.map(s => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="inline-flex p-2 hover:opacity-80 transition-opacity">
                  <Icon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
