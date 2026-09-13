# Central Portfolio Content Store Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `src/content/portfolio.json` the single owner-edited source for all public portfolio content except long-form Markdown articles.

**Architecture:** A Zod schema validates the JSON at a server-only content seam and exports inferred TypeScript types. Server composition modules load the validated registry and pass focused records to client modules, keeping validation out of the browser. Existing Markdown articles remain independently validated under `content/blog/`.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript 5, Zod 3, JSON modules, Node test runner, existing Tailwind CSS and Framer Motion.

## Global Constraints

- Preserve the current visual design, responsive behavior, routes, animations, accessibility behavior, and contact workflow.
- Preserve existing public copy, dates, links, images, metrics, and claims verbatim during migration.
- Do not move secrets, contact recipients, provider configuration, or rate-limit settings into public JSON.
- Keep `content/blog/*.md` as the only source for long-form articles.
- Do not add a CMS, database, authentication, runtime publishing, or new dependency.
- Do not import the raw JSON from React modules; import validated content through `src/lib/content/portfolio.ts`.
- Client modules receive focused content through typed props and must not import the server-only loader.
- Existing target files contain uncommitted work. Do not stage or commit application files during execution; use the test checkpoints in this plan and preserve unrelated changes.
- Keep `src/components/Tilt.tsx` unchanged.

---

## File structure

- Create `src/content/portfolio.json`: the only owner-edited non-article content document.
- Create `src/lib/content/portfolio-schema.ts`: pure Zod schemas, duplicate checks, and inferred types.
- Create `src/lib/content/portfolio.ts`: server-only validated content loader and résumé override.
- Create `src/lib/content/portfolio-selectors.ts`: pure typed derivations that can be tested without importing a server-only module.
- Create `tests/portfolio-content.test.ts`: validation, duplicate, URL, and selector coverage.
- Modify `src/content/portfolio.ts`: temporary content-free type/re-export bridge, then remove if no imports remain.
- Modify `src/utils/data.ts` and `src/utils/site.ts`: content-free compatibility exports only.
- Modify homepage and route composition files: load validated content and pass focused props.
- Modify presentation modules: accept typed content props and remove owner-maintained literals.
- Modify `codex/docs/portfolio-context.md` and `codex/docs/portfolio-workflow.md`: document the source and editing recipes.

---

### Task 1: Add the validated JSON content model

**Files:**
- Create: `src/content/portfolio.json`
- Create: `src/lib/content/portfolio-schema.ts`
- Create: `tests/portfolio-content.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `portfolioSchema`, `PortfolioContent`, `Project`, `Recommendation`, `ContactCopy`, `NavigationContent`, and `parsePortfolioContent(input: unknown): PortfolioContent`.
- Consumes: the exact existing values in `src/content/portfolio.ts` plus owner-facing literals currently embedded in route and presentation modules.

- [ ] **Step 1: Add a failing production-document validation test**

Create `tests/portfolio-content.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parsePortfolioContent } from '../src/lib/content/portfolio-schema.ts'

const rawPortfolio = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/content/portfolio.json'), 'utf8')
)

test('the production portfolio document is valid', () => {
  const content = parsePortfolioContent(rawPortfolio)
  assert.equal(content.site.name, 'Pranav Deepak')
  assert.equal(content.projects.length > 0, true)
  assert.equal(content.recommendations.items.length > 0, true)
})
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- --test-name-pattern="production portfolio document"`

Expected: FAIL because `portfolio.json` and `portfolio-schema.ts` do not exist.

- [ ] **Step 3: Create the strict schema and path-specific parser**

Create `src/lib/content/portfolio-schema.ts`. Define reusable `requiredText`, `internalHref`, `httpsUrl`, `imagePath`, and `objectPosition` schemas. Define strict nested schemas for this exact top-level interface:

```ts
export interface PortfolioContentShape {
  site: {
    name: string
    mark: string
    role: string
    language: string
    metadata: { title: string; description: string; notFoundTitle: string }
    resume: { label: string; fallbackUrl: string }
    socials: Array<{ label: string; href: string }>
    socialsLabel: string
    footer: string
  }
  navigation: {
    primaryLabel: string
    mobileLabel: string
    menuOpenLabel: string
    menuCloseLabel: string
    backToTopLabel: string
    primary: Array<{ label: string; href: string }>
    secondaryLabel: string
    secondary: Array<{ id: 'blog' | 'recommendations'; label: string; href: string }>
  }
  hero: {
    ambientTop: string
    ambientBottom: string
    scrollLabel: string
    scrollHref: string
  }
  about: {
    eyebrow: string
    headline: string
    portrait: { src: string; alt: string }
    paragraphs: string[]
    actions: Array<{ label: string; href: string }>
  }
  sections: {
    experience: { title: string; subtitle: string; empty: string }
    projects: { title: string; subtitle: string; empty: string; codeLabel: string; demoLabel: string }
    skills: { title: string; subtitle: string; empty: string }
    sideQuests: { title: string; subtitle: string; empty: string }
    writing: { title: string; viewAllLabel: string; empty: string; previewLimit: number }
    recommendations: { title: string; viewAllLabel: string; empty: string }
    hobbies: { title: string; subtitle: string; empty: string }
  }
  experience: Array<{ id: string; period: string; title: string; summary: string; stack: string[] }>
  projects: Array<{
    slug: string
    title: string
    subtitle: string
    description: string
    details?: string | null
    tech: string[]
    metrics: string[]
    links: { repo?: string | null; demo?: string | null }
  }>
  skills: Array<{ id: string; category: string; items: Array<{ name: string; level: number }> }>
  sideQuests: Array<{
    slug: string
    title: string
    subtitle: string
    details: string
    links: Array<{ label: string; href: string }>
  }>
  writing: { backLabel: string; indexLabel: string; readLabel: string }
  recommendations: {
    previewLimit: number
    countsLabel: string
    labels: { book: string; movie: string; video: string; article: string; editorial: string }
    shelfTitle: string
    shelfNote: string
    filmsTitle: string
    editorialTitle: string
    letterboxd: { label: string; href: string }
    items: Array<
      | { id: string; kind: 'book'; title: string; author?: string | null; href?: string | null; image?: string | null; gradient: GradientToken }
      | { id: string; kind: 'movie'; title: string; year?: string | null; tmdbId?: number | null; href?: string | null; image?: string | null; gradient: GradientToken }
      | { id: string; kind: 'video'; title: string; channel?: string | null; href?: string | null; image?: string | null; gradient: GradientToken }
      | { id: string; kind: 'article'; title: string; publication?: string | null; href?: string | null; image?: string | null; gradient: GradientToken }
    >
  }
  hobbies: Array<{ id: string; src: string; alt: string; title: string; blurb: string; objectPosition: string }>
  contact: {
    triggerLabel: string
    eyebrow: string
    title: string
    intro: string
    closeLabel: string
    fields: {
      name: { label: string; autoComplete: string }
      email: { label: string; autoComplete: string }
      message: { label: string }
      website: { label: string }
    }
    submitLabel: string
    submittingLabel: string
    validation: {
      nameRequired: string
      nameTooShort: string
      nameTooLong: string
      nameUnsafe: string
      emailRequired: string
      emailTooLong: string
      emailInvalid: string
      messageRequired: string
      messageTooShort: string
      messageTooLong: string
      messageUnsafe: string
    }
    messages: { invalid: string; sending: string; success: string; rateLimited: string; failure: string; network: string }
  }
}
```

Define `GradientToken` as the inferred type of `z.enum(['aurora', 'sunset', 'cobalt', 'orchid', 'citrus'])`. Export all other types from the Zod schemas rather than maintaining a second handwritten type implementation. Add a `superRefine` helper that reports duplicate values at their array paths for experience IDs, project slugs, skill IDs, Side Quest slugs, hobby IDs, recommendation IDs, and navigation destinations. `parsePortfolioContent` must call `portfolioSchema.parse(input)` so Zod includes field paths in thrown errors.

- [ ] **Step 4: Create `portfolio.json` by mechanically migrating existing values**

Use the structure above. Copy records from `src/content/portfolio.ts` without rewriting them. Move literals from `Hero.tsx`, `Skills.tsx`, `BookShelf.tsx`, `MovieLibrary.tsx`, `Recommendations.tsx`, `RecommendationsPreview.tsx`, `SiteHeader.tsx`, `SecondaryPageNav.tsx`, `BlogArticle.tsx`, `BlogIndex.tsx`, `ContactSticky.tsx`, `layout.tsx`, and `SiteFooter.tsx` into their corresponding fields. Use stable kebab-case IDs for experience, skill, and hobby records. Set `sections.writing.previewLimit` and `recommendations.previewLimit` to `3` to preserve current behavior.

- [ ] **Step 5: Add validation edge-case tests**

Extend `tests/portfolio-content.test.ts` with exact mutation-based cases:

```ts
const clone = () => structuredClone(rawPortfolio) as any

test('unsafe URLs and image paths are rejected with field paths', () => {
  const content = clone()
  content.projects[0].links.repo = '#'
  content.hobbies[0].src = 'https://example.com/photo.jpg'
  assert.throws(() => parsePortfolioContent(content), /projects|hobbies/)
})

test('duplicate stable identifiers are rejected', () => {
  const content = clone()
  content.projects[1].slug = content.projects[0].slug
  assert.throws(() => parsePortfolioContent(content), /projects/)
})

test('bounded fields reject invalid display configuration', () => {
  const content = clone()
  content.skills[0].items[0].level = 101
  content.hobbies[0].objectPosition = 'middle'
  content.recommendations.items[0].gradient = 'unknown'
  assert.throws(() => parsePortfolioContent(content), /skills|hobbies|recommendations/)
})
```

- [ ] **Step 6: Keep the existing test command dependency-free**

Use `readFileSync` and `JSON.parse` in the test as shown above. Do not add a JSON loader or change framework or library versions. `package.json` should remain unchanged unless a separate verification failure proves a script change is necessary.

- [ ] **Step 7: Run the content tests**

Run: `npm test -- --test-name-pattern="portfolio document|unsafe URLs|duplicate stable|bounded fields"`

Expected: all new tests PASS.

---

### Task 2: Add the server-only content interface and selectors

**Files:**
- Create: `src/lib/content/portfolio.ts`
- Create: `src/lib/content/portfolio-selectors.ts`
- Modify: `src/content/portfolio.ts`
- Modify: `src/utils/data.ts`
- Modify: `src/utils/site.ts`
- Modify: `tests/content-registry.test.ts`
- Modify: `tests/site.test.ts`

**Interfaces:**
- Consumes: `parsePortfolioContent(rawPortfolio)` from Task 1.
- Produces: server-only `portfolioContent: PortfolioContent`, pure `getRecommendationGroups(content)`, and focused exported types for presentation props.

- [ ] **Step 1: Rewrite registry tests against the new interface**

Change imports in `tests/content-registry.test.ts` and `tests/site.test.ts` to load `src/content/portfolio.json` with `readFileSync` and validate it with `parsePortfolioContent`. Read collections through the resulting `portfolioContent.experience`, `.projects`, `.skills`, `.sideQuests`, `.hobbies`, and `.recommendations.items`. Preserve the existing assertions for Blog navigation, Side Quests, local hobby media, supported gradients, and safe recommendation links. Import selectors only from `../src/lib/content/portfolio-selectors.ts`; Node tests must not import the `server-only` loader.

- [ ] **Step 2: Run registry tests and verify they fail**

Run: `npm test -- --test-name-pattern="navigation exposes|side quests|recommendation records"`

Expected: FAIL because the server-only interface does not exist.

- [ ] **Step 3: Implement the loader and recommendation selector**

Create `src/lib/content/portfolio.ts`:

```ts
import 'server-only'
import rawPortfolio from '@/content/portfolio.json'
import { parsePortfolioContent, type PortfolioContent } from '@/lib/content/portfolio-schema'

const parsed = parsePortfolioContent(rawPortfolio)

export const portfolioContent: PortfolioContent = {
  ...parsed,
  site: {
    ...parsed.site,
    resume: {
      ...parsed.site.resume,
      fallbackUrl: process.env.NEXT_PUBLIC_RESUME_URL
        ?? process.env.NEXT_PUBLIC_RESUME_SHEET_URL
        ?? parsed.site.resume.fallbackUrl
    }
  }
}

export type * from '@/lib/content/portfolio-schema'
```

Create `src/lib/content/portfolio-selectors.ts`:

```ts
import type { PortfolioContent, Recommendation } from '@/lib/content/portfolio-schema'

export function getRecommendationGroups(content: PortfolioContent) {
  const items = content.recommendations.items
  return {
    books: items.filter((item): item is Extract<Recommendation, { kind: 'book' }> => item.kind === 'book'),
    movies: items.filter((item): item is Extract<Recommendation, { kind: 'movie' }> => item.kind === 'movie'),
    videos: items.filter((item): item is Extract<Recommendation, { kind: 'video' }> => item.kind === 'video'),
    articles: items.filter((item): item is Extract<Recommendation, { kind: 'article' }> => item.kind === 'article')
  }
}
```

- [ ] **Step 4: Reduce legacy registries to content-free bridges**

Replace `src/content/portfolio.ts` and `src/utils/data.ts` with type/re-export bridges to `@/lib/content/portfolio`. Keep `src/utils/site.ts` as a content-free `siteConfig` alias only if an untouched import still requires it. Delete each bridge once `rg "@/content/portfolio|@/utils/data|@/utils/site" src` shows no consumer.

- [ ] **Step 5: Add selector assertions and run all content tests**

Assert that the total of the four recommendation groups equals `portfolioContent.recommendations.items.length` and that the configured preview is `items.slice(0, previewLimit)`. Run: `npm test`.

Expected: all tests PASS.

---

### Task 3: Convert homepage sections to focused typed props

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/About.tsx`
- Modify: `src/components/Timeline.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/Skills.tsx`
- Modify: `src/components/Misc.tsx`
- Modify: `src/components/RecommendationsPreview.tsx`
- Modify: `src/components/Hobbies.tsx`
- Modify: `src/components/WritingPreview.tsx`

**Interfaces:**
- Consumes: validated `portfolioContent` and inferred record types.
- Produces: presentation modules whose props contain all owner-managed copy and records they render.

- [ ] **Step 1: Add source-boundary assertions**

Extend `tests/presentation-source.test.ts` to read the files above and assert that only `src/app/page.tsx` contains `@/lib/content/portfolio`; component sources must not match `@/content/portfolio`, `@/utils/data`, `@/utils/site`, or raw `portfolio.json` imports.

- [ ] **Step 2: Run the boundary test and verify it fails**

Run: `npm test -- --test-name-pattern="focused content props"`

Expected: FAIL because components still import the old registry.

- [ ] **Step 3: Pass section content from the server composition root**

Import `portfolioContent` in `src/app/page.tsx` and pass focused props:

```tsx
<Hero site={portfolioContent.site} hero={portfolioContent.hero} />
<About content={portfolioContent.about} socials={portfolioContent.site.socials} socialsLabel={portfolioContent.site.socialsLabel} />
<Timeline section={portfolioContent.sections.experience} items={portfolioContent.experience} />
<Projects section={portfolioContent.sections.projects} items={portfolioContent.projects} />
<Misc section={portfolioContent.sections.sideQuests} items={portfolioContent.sideQuests} />
<WritingPreview section={portfolioContent.sections.writing} writing={portfolioContent.writing} />
<RecommendationsPreview section={portfolioContent.sections.recommendations} content={portfolioContent.recommendations} />
<Hobbies section={portfolioContent.sections.hobbies} items={portfolioContent.hobbies} />
```

Add `<Skills section={portfolioContent.sections.skills} items={portfolioContent.skills} />` only if Skills is intentionally present in the current homepage composition; do not change section order incidentally.

- [ ] **Step 4: Replace imports with typed props in each section**

Import types with `import type` from `@/lib/content/portfolio-schema`. Keep all mapping and interaction logic local. In `Projects`, replace the module-level `projects` lookup with `items.find(...)`. Render the section's configured empty message when an item array is empty. In `WritingPreview`, slice published posts with `section.previewLimit` and use `section.viewAllLabel` and `writing.readLabel` rather than embedded labels.

- [ ] **Step 5: Verify homepage content boundaries**

Run: `npm test -- --test-name-pattern="focused content props|approved presentation|homepage writing|homepage recommendation"`.

Expected: all matching tests PASS.

---

### Task 4: Convert shared shell and secondary pages

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/recommendations/page.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/components/SecondaryPageNav.tsx`
- Modify: `src/components/SecondaryPageShell.tsx`
- Modify: `src/components/BlogIndex.tsx`
- Modify: `src/components/BlogArticle.tsx`
- Modify: `src/components/BookShelf.tsx`
- Modify: `src/components/MovieLibrary.tsx`
- Modify: `src/components/Recommendations.tsx`
- Modify: `src/components/ContactSticky.tsx`
- Modify: `src/lib/contact/schema.ts`
- Modify: `src/app/api/contact/route.ts`
- Modify: `tests/contact.test.ts`

**Interfaces:**
- Consumes: `portfolioContent`, `getRecommendationGroups`, and focused types.
- Produces: data-driven metadata, navigation, footer, contact UI and validation messages, blog labels, and recommendation collections.

- [ ] **Step 1: Add source assertions for remaining owner copy**

Extend `tests/presentation-source.test.ts` to assert that the secondary and recommendation modules render passed labels and contain no old registry imports. Add assertions that `layout.tsx`, blog routes, and recommendation route import `@/lib/content/portfolio`.

- [ ] **Step 2: Move metadata and shell composition to server modules**

In `layout.tsx`, derive `metadata.title` and `metadata.description` from `portfolioContent.site.metadata` and set `<html lang={portfolioContent.site.language}>`. Pass focused navigation data to `SiteHeader`, footer data to `SiteFooter`, and contact copy to `ContactSticky` from server composition modules. Keep `SiteHeader` and `ContactSticky` client-side and type their props with erased type-only imports.

- [ ] **Step 3: Make contact validation copy injectable**

Replace the fixed schema export in `src/lib/contact/schema.ts` with `createContactSchema(copy: ContactValidationCopy)`. Keep every current length and control-character rule unchanged, but replace each Zod message with the matching `copy` field. In `src/app/api/contact/route.ts`, construct the server schema from `portfolioContent.contact.validation`. In `ContactSticky`, use `useMemo(() => createContactSchema(content.validation), [content.validation])`. Update `tests/contact.test.ts` to construct the schema from `parsePortfolioContent(rawPortfolio).contact.validation` before running the existing trimming, type, and size assertions.

- [ ] **Step 4: Move contact and navigation literals to data props**

Replace every visible literal in `ContactSticky` with `content` fields, including validation, sending, success, rate-limit, server-failure, and network-failure messages. Replace header navigation labels, résumé label, menu labels, and accessible navigation labels with passed data. Preserve the existing dialog IDs, form field names, API route, HTTP method, focus handling, and validation limits.

- [ ] **Step 5: Make secondary navigation and blog labels data-driven**

Pass `navigation.secondary` and `navigation.secondaryLabel` into `SecondaryPageNav`. Pass Writing labels into `BlogIndex` and `BlogArticle`; preserve dynamic titles and descriptions from each Markdown post. Use the site name from JSON when composing route metadata such as `${post.title} · ${site.name}`.

- [ ] **Step 6: Make recommendation collections data-driven**

Call `getRecommendationGroups(portfolioContent)` in `src/app/recommendations/page.tsx` and pass the groups plus `portfolioContent.recommendations` into `Recommendations`. Pass label subsets into `BookShelf` and `MovieLibrary`. Replace `Books`, `Films`, `Videos and reads`, `The shelf`, the shelf note, and the Letterboxd label and URL with JSON values. Preserve existing fallback artwork and safe external-link behavior.

- [ ] **Step 7: Run route and presentation tests**

Run: `npm test`.

Expected: all tests PASS with no content modules importing raw JSON or client modules importing the server-only loader.

---

### Task 5: Remove duplicate sources and document editing

**Files:**
- Delete when unused: `src/content/portfolio.ts`
- Modify: `src/utils/data.ts`
- Modify: `src/utils/site.ts`
- Modify: `codex/docs/portfolio-context.md`
- Modify: `codex/docs/portfolio-workflow.md`

**Interfaces:**
- Consumes: the completed JSON registry and validated interface.
- Produces: one documented owner workflow with no duplicated content values.

- [ ] **Step 1: Audit imports and embedded records**

Run:

```bash
rg -n "@/content/portfolio|@/utils/data|@/utils/site|const (career|projects|skills|sideQuests|hobbies|recommendations)" src
rg -n "Pranav Deepak|Thinking in Systems|Amusify|Business Analyst · Flipkart" src --glob '!content/portfolio.json'
```

Expected: no presentation module contains registry imports or known owner records. Keep only a content-free compatibility bridge if an external import genuinely remains.

- [ ] **Step 2: Update architecture documentation**

Update `codex/docs/portfolio-context.md` so its technical map names `src/content/portfolio.json`, `src/lib/content/portfolio-schema.ts`, and `src/lib/content/portfolio.ts`. Remove the conflicting instruction that `src/utils/data.ts` owns content.

- [ ] **Step 3: Add exact editing recipes**

Update `codex/docs/portfolio-workflow.md` with valid JSON examples for one project, one experience record, one Side Quest, one skill group, one recommendation of each kind, and one hobby. Explain array ordering, stable IDs/slugs, nullable links/artwork, allowed gradient tokens, `/images/` paths, `objectPosition`, validation commands, Markdown authoring, and résumé environment precedence.

- [ ] **Step 4: Run the source audit and tests**

Run the two `rg` commands from Step 1 and then `npm test`.

Expected: audits show no duplicate owner records; all tests PASS.

---

### Task 6: Full verification and browser smoke check

**Files:**
- Modify only if verification exposes a defect in an in-scope file.

**Interfaces:**
- Consumes: the completed content migration.
- Produces: a verified production-ready local change set.

- [ ] **Step 1: Run static verification**

Run:

```bash
npm run lint
npx tsc --noEmit
```

Expected: both commands exit `0`; existing warnings may be reported separately but no new warnings are accepted.

- [ ] **Step 2: Run the production build**

Run: `npm run build`.

Expected: exit `0`. If sandboxed font fetching fails, rerun with approved network access and report the environment limitation precisely.

- [ ] **Step 3: Smoke-test rendered routes**

Run the existing development server and inspect `/`, `/blog`, one published `/blog/<slug>` route, and `/recommendations`. Verify desktop and mobile navigation, project dialog focus and close behavior, recommendation fallbacks and external links, hobby crops, contact dialog labels and status transitions without submitting a real message, and empty-state safety by temporarily testing a cloned fixture rather than changing production content.

- [ ] **Step 4: Review the final diff**

Run `git diff --check` and `git status --short`. Confirm `src/components/Tilt.tsx` and unrelated user changes were not modified by this implementation. Report all changed files, test results, and any environment limitation without staging the mixed working tree.
