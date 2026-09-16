'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useParallax } from '@/hooks/useParallax'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

interface HeroProps {
  identity: Pick<PortfolioContent['site'], 'name' | 'mark' | 'role'>
  hero: PortfolioContent['hero']
}

const heroTiles = {
  slow: ['hero-tile-01', 'hero-tile-02', 'hero-tile-03', 'hero-tile-04'],
  medium: ['hero-tile-05', 'hero-tile-06', 'hero-tile-07', 'hero-tile-08'],
  fast: ['hero-tile-09', 'hero-tile-10', 'hero-tile-11', 'hero-tile-12']
} as const

function TileLayer({ tiles }: { tiles: readonly string[] }) {
  return (
    <>
      {tiles.map((tile) => (
        <span key={tile} className={`hero-tile ${tile}`} />
      ))}
    </>
  )
}

export default function Hero({ identity, hero }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const { ySlow, yMedium, yFast, cueOpacity } = useParallax(heroRef)

  return (
    <section ref={heroRef} id="hero" aria-labelledby="hero-title" className="hero-section">
      <div className="hero-atmosphere" aria-hidden="true">
        <span className="hero-word hero-word-top">{hero.ambientTop}</span>
        <span className="hero-word hero-word-bottom">{hero.ambientBottom}</span>
        <span className="hero-glow" />
      </div>

      <div className="hero-stage" aria-hidden="true">
        <motion.div className="hero-layer" style={{ y: ySlow }}>
          <TileLayer tiles={heroTiles.slow} />
        </motion.div>
        <motion.div className="hero-layer" style={{ y: yMedium }}>
          <TileLayer tiles={heroTiles.medium} />
        </motion.div>
        <motion.div className="hero-layer" style={{ y: yFast }}>
          <TileLayer tiles={heroTiles.fast} />
        </motion.div>
      </div>

      <div className="hero-identity">
        <h1 id="hero-title">{identity.name}</h1>
        <p className="hero-mark" aria-label={hero.markLabel}>{identity.mark}</p>
        <p>{identity.role}</p>
      </div>

      <motion.a
        href={hero.scrollHref}
        className="hero-scroll-cue interactive-target"
        style={{ opacity: cueOpacity }}
      >
        <span>{hero.scrollLabel}</span>
        <span aria-hidden>↓</span>
      </motion.a>
    </section>
  )
}
