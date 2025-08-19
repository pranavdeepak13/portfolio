'use client'
import Section from './Section'
import { career } from '@/utils/data'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import Tilt from './Tilt'
import { makeWavePath } from '@/hooks/useWavePath'

export default function Timeline() {
  const boxRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: boxRef, offset: ['start 0.9', 'end 0.1'] })
  const [phase, setPhase] = useState(0)
  const [height, setHeight] = useState(600)

  useMotionValueEvent(scrollYProgress, 'change', (v) => setPhase(v * Math.PI * 14))

  useEffect(() => {
    const update = () => {
      const h = listRef.current?.getBoundingClientRect().height ?? 600
      setHeight(Math.ceil(h))
    }
    update()
    const ro = new ResizeObserver(update)
    if (boxRef.current) ro.observe(boxRef.current)
    if (listRef.current) ro.observe(listRef.current)
    window.addEventListener('load', update)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('load', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const pathD = useMemo(() => makeWavePath({
    height,
    amplitude: 18,
    frequency: 0.035,
    phase,
    x: 56
  }), [height, phase])

  return (
    <Section id="experience" title="My Professional Glow-Up" subtitle="From bugs to business impact">
      <div ref={boxRef} className="relative">
        <div className="absolute left-0 top-0 h-full w-28 overflow-hidden pointer-events-none">
          <svg width="112" height={height} aria-hidden className="block">
            <path d={pathD} fill="none" stroke="currentColor" className="text-black/50 dark:text-white/60" strokeWidth="2" />
          </svg>
        </div>

        <ol ref={listRef} className="ms-32 space-y-6">
          {career.map((item) => (
            <Tilt key={item.year} className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-display text-xl">{item.title}</h3>
                <time className="text-sm opacity-70" aria-label={`Year ${item.year}`}>{item.year}</time>
              </div>
              <p className="opacity-90 mb-3">{item.summary}</p>
              <ul className="flex flex-wrap gap-2">
                {item.stack.map(tag => (
                  <span key={tag} className="text-xs rounded-full border border-concrete-200 dark:border-white/25 px-2 py-1">{tag}</span>
                ))}
              </ul>
            </Tilt>
          ))}
        </ol>
      </div>
    </Section>
  )
}
