# Hero Orbit Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Replace Hero's scrolling tile layers with a one-time Framer Motion orbit that re-spins and enlarges the hovered decorative tile.

**Architecture:** Hero owns ephemeral active-tile and orbit-cycle state. A focused hook keeps only the existing scroll-cue opacity behavior. CSS places static tile slots around a responsive circle, while Framer Motion rotates the parent orbit and scales an inner tile without overriding CSS placement transforms.

**Tech Stack:** Next.js App Router, React 18, TypeScript, Framer Motion, global CSS, Node test runner.

## Global Constraints

- Preserve all JSON-owned Hero copy and do not modify src/content/portfolio.json.
- Keep all tiles decorative, aria-hidden, and non-focusable; hover changes no content or navigation.
- Animate one entry rotation only; every new hover causes one short re-spin, never a continuous loop.
- With prefers-reduced-motion, render the settled circle and allow only selected-tile scale.
- Preserve the Hero identity and scroll cue above the orbit.
- Do not alter the user's separate uncommitted src/content/portfolio.json edit.

---

### Task 1: Build the state-driven Hero orbit

**Files:**

- Modify: tests/presentation-source.test.ts
- Modify: src/components/Hero.tsx
- Delete: src/hooks/useParallax.ts
- Create: src/hooks/useHeroScrollCue.ts

**Interfaces:**

- Consumes: HeroProps, the existing heroTiles artwork class names, and PortfolioContent['hero'].
- Produces: useHeroScrollCue(target: RefObject<HTMLElement>): MotionValue<number>; Hero has no new public props.

- [ ] **Step 1: Write the failing source-level regression test**

Add this test to tests/presentation-source.test.ts:

~~~
test('Hero uses a one-time decorative orbit with hover-driven tile emphasis', async () => {
  const source = await readFile(path.join(root, 'src/components/Hero.tsx'), 'utf8')

  assert.match(source, /const \[activeTile, setActiveTile\] = useState<string \| null>\(null\)/)
  assert.match(source, /const \[orbitCycle, setOrbitCycle\] = useState\(0\)/)
  assert.match(source, /className="hero-orbit"/)
  assert.match(source, /onMouseEnter=\{\(\) => activateTile\(tile\)\}/)
  assert.match(source, /onMouseLeave=\{\(\) => setActiveTile\(null\)\}/)
  assert.match(source, /animate=\{reduceMotion \? \{ rotate: 0 \} : \{ rotate: 360 \}\}/)
  assert.match(source, /animate=\{\{ scale: activeTile === tile \? 1\.24 : 1 \}\}/)
  assert.doesNotMatch(source, /useParallax|hero-layer|ySlow|yMedium|yFast/)
  assert.equal(existsSync(path.join(root, 'src/hooks/useParallax.ts')), false)
})
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: npm test

Expected: FAIL at the new Hero orbit test because Hero imports useParallax and renders hero-layer elements.

- [ ] **Step 3: Create the focused scroll-cue hook**

Create src/hooks/useHeroScrollCue.ts:

~~~
'use client'

import type { RefObject } from 'react'
import { type MotionValue, useScroll, useTransform } from 'framer-motion'

export function useHeroScrollCue(target: RefObject<HTMLElement>): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end start']
  })

  return useTransform(scrollYProgress, [0, 0.28], [1, 0])
}
~~~

Delete src/hooks/useParallax.ts. No component may import it afterwards.

- [ ] **Step 4: Replace the tile layers with the orbit implementation**

In src/components/Hero.tsx, use these imports:

~~~
import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useHeroScrollCue } from '@/hooks/useHeroScrollCue'
~~~

Before the component, define:

~~~
const orbitTiles = Object.values(heroTiles).flat()
~~~

At the start of Hero, use:

~~~
const [activeTile, setActiveTile] = useState<string | null>(null)
const [orbitCycle, setOrbitCycle] = useState(0)
const reduceMotion = useReducedMotion()
const cueOpacity = useHeroScrollCue(heroRef)

function activateTile(tile: string) {
  setActiveTile(tile)
  if (!reduceMotion) setOrbitCycle((cycle) => cycle + 1)
}
~~~

Replace the existing hero-stage contents with:

~~~
<div className="hero-stage" aria-hidden="true">
  <motion.div
    key={orbitCycle}
    className="hero-orbit"
    initial={reduceMotion ? false : { rotate: 0 }}
    animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
    transition={{ duration: orbitCycle === 0 ? 2.4 : 0.72, ease: 'easeInOut' }}
  >
    {orbitTiles.map((tile, index) => (
      <span
        key={tile}
        className="hero-tile-slot"
        style={{ '--tile-angle': String(index * (360 / orbitTiles.length)) + 'deg' } as React.CSSProperties}
        onMouseEnter={() => activateTile(tile)}
        onMouseLeave={() => setActiveTile(null)}
      >
        <motion.span
          className={'hero-tile ' + tile}
          animate={{ scale: activeTile === tile ? 1.24 : 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        />
      </span>
    ))}
  </motion.div>
</div>
~~~

Keep the identity and motion.a scroll cue. Its opacity must use cueOpacity.

- [ ] **Step 5: Run the regression suite to verify it passes**

Run: npm test

Expected: PASS. The Hero test proves that initial rotation, hover re-spin state, selected-tile scaling, and removal of the old parallax layers are all present.

- [ ] **Step 6: Commit the behavior slice**

~~~
git add tests/presentation-source.test.ts src/components/Hero.tsx src/hooks/useHeroScrollCue.ts src/hooks/useParallax.ts
git commit -m "feat(hero): add interactive tile orbit"
~~~

### Task 2: Add responsive orbit styling and motion-safe verification

**Files:**

- Modify: tests/presentation-source.test.ts
- Modify: src/app/globals.css

**Interfaces:**

- Consumes: .hero-stage, .hero-orbit, .hero-tile-slot, and .hero-tile from Task 1.
- Produces: a centered, responsive circular arrangement where scaling cannot alter a tile's orbital placement.

- [ ] **Step 1: Extend the failing test for the orbit CSS contract**

Add this test:

~~~
test('Hero orbit CSS keeps tile placement separate from selected-tile scaling', async () => {
  const css = await readFile(path.join(root, 'src/app/globals.css'), 'utf8')

  assert.match(css, /\.hero-orbit\s*\{[\s\S]*?place-items:\s*center/)
  assert.match(css, /\.hero-tile-slot\s*\{[\s\S]*?rotate\(var\(--tile-angle\)\)/)
  assert.match(css, /translateY\(calc\(-1 \* var\(--hero-orbit-radius\)\)\)/)
  assert.match(css, /\.hero-tile-slot\s*\{[\s\S]*?pointer-events:\s*auto/)
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.hero-orbit/)
})
~~~

- [ ] **Step 2: Run the test to verify it fails**

Run: npm test

Expected: FAIL at the new CSS contract because the stylesheet has no hero-orbit or hero-tile-slot rules.

- [ ] **Step 3: Replace layer/parallax CSS with the orbit layout**

Remove hero-layer from the shared absolute-position selector and delete its will-change rule. Replace the current per-tile placement declarations with these structural rules; preserve the existing hero-tile-01 through hero-tile-12 artwork backgrounds:

~~~
.hero-stage {
  --hero-orbit-radius: clamp(128px, 22vw, 310px);
  display: grid;
  place-items: center;
  pointer-events: none;
}

.hero-orbit {
  position: relative;
  display: grid;
  width: calc(var(--hero-orbit-radius) * 2 + clamp(38px, 4.4vw, 76px));
  aspect-ratio: 1;
  place-items: center;
}

.hero-tile-slot {
  position: absolute;
  display: grid;
  width: clamp(38px, 4.4vw, 76px);
  aspect-ratio: 0.78;
  pointer-events: auto;
  transform: rotate(var(--tile-angle)) translateY(calc(-1 * var(--hero-orbit-radius))) rotate(calc(-1 * var(--tile-angle)));
}

.hero-tile {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 2px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
}
~~~

Remove the current small-screen list that hides six tile classes. Add this responsive radius rule instead:

~~~
@media (max-width: 767px) {
  .hero-stage {
    --hero-orbit-radius: clamp(108px, 31vw, 178px);
  }
}
~~~

In the existing reduced-motion query, replace the obsolete hero-layer rule with:

~~~
.hero-orbit {
  animation: none;
  will-change: auto;
}
~~~

- [ ] **Step 4: Run the source tests to verify the styling contract passes**

Run: npm test

Expected: PASS, including the two Hero orbit tests.

- [ ] **Step 5: Run production verification and browser checks**

Run:

~~~
npm run lint
npx tsc --noEmit
npm run build
~~~

Expected: all commands exit 0. In a browser, confirm one entry rotation, a settled orbit, a short hover re-spin with the hovered tile enlarged, no persistent spin after pointer leave, usable mobile layout, and no rotation under reduced motion.

- [ ] **Step 6: Commit the presentation slice**

~~~
git add tests/presentation-source.test.ts src/app/globals.css
git commit -m "style(hero): arrange tiles in responsive orbit"
~~~

