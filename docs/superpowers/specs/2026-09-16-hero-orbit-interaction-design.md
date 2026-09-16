# Hero orbit interaction design

**Date:** 2026-09-16

## Goal

Replace the Hero's scroll-parallax tile field with an interactive circular orbit that feels like a refined loading indicator without obscuring the identity copy.

## Agreed behavior

- The twelve existing decorative tiles enter in a circular orbit once when the Hero loads, then settle into a stationary ring.
- Hovering a tile makes the full ring complete one quick rotation and enlarges the active tile in its existing orbital position.
- Leaving the tile restores the settled ring and normal tile scale.
- The tiles remain purely decorative: they do not navigate or reveal content.
- With reduced motion enabled, tiles render in the settled ring; hover can use a subtle scale change but never rotate.

## Implementation

- Keep the Hero as a client component and replace the three parallax layers with one Framer Motion orbit container.
- Preserve the tile artwork and count. Give each tile a stable angle and place it with CSS custom properties around the ring.
- Track the active tile id in React state. Framer Motion animates the initial orbit, a short re-spin on active-tile changes, and the individual active-tile scale.
- Keep tiles `aria-hidden` and non-focusable: hover is a purely decorative enhancement, not a control or content interaction.
- Update Hero CSS for responsive orbit radius, selected-tile elevation, and the existing small-screen tile reduction. Remove unused tile parallax styling and keep the identity and scroll cue above the orbit.

## Verification

- Add source-level coverage for the one-time orbit, active-tile state, and reduced-motion handling.
- Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- Check desktop hover, touch-safe layout, and reduced-motion behavior in the browser.

## Out of scope

- No content-schema changes, new tile artwork, tile links, or changes to the Hero's text and calls to action.
