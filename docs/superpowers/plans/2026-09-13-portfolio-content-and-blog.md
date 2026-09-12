# Portfolio Content and Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add repository-authored Markdown articles, readable Medium-like article routes, a single typed registry for all other portfolio content, and the approved homepage/navigation/layout refinements.

**Architecture:** Published `.md` files under `content/blog/` are parsed and validated on the server at build time, while `src/content/portfolio.ts` owns every other public content record. Server components consume these sources directly; only existing browser interactions remain client components. Markdown is rendered without raw HTML support.

**Tech Stack:** Next.js 14 App Router, React 18, strict TypeScript, Zod, `gray-matter@4.0.3`, `react-markdown@9.0.1`, `remark-gfm@4.0.0`, Tailwind CSS, existing global CSS tokens.

## Global Constraints

- Preserve all existing uncommitted work, especially `src/components/Tilt.tsx`.
- Do not stage or commit application changes from the dirty working tree unless the user separately requests it.
- Keep `src/app/page.tsx` as the homepage composition root and use server components by default.
- Blog articles have no cover-image field and no cover placeholders.
- `src/content/portfolio.ts` is the only source of non-article public content.
- Do not render raw HTML from Markdown or execute content-defined scripts.
- Do not expose the private contact recipient or move any server secret into public content.
- Do not add placeholder `#` URLs; invalid or absent links render as non-links.
- Do not upgrade Next.js, React, Google APIs, or other existing major dependencies.
- Use vibrant CSS gradients only for missing recommendation artwork.
- Keep reduced-motion, keyboard focus, semantic heading, and 44px control behavior intact.

---

### Task 1: Consolidate the typed portfolio registry

**Files:**
- Create: `src/content/portfolio.ts`
- Modify: `src/utils/data.ts`
- Modify: `src/utils/site.ts`
- Modify: `tests/site.test.ts`

**Interfaces:**
- Produces: `portfolioContent`, `career`, `projects`, `sideQuests`, `hobbies`, `recommendations`, and their exported TypeScript types.
- Consumes: existing factual copy and URLs from `src/utils/data.ts` and `src/utils/site.ts` without changing claims.

- [ ] **Step 1: Write failing registry tests**

Update `tests/site.test.ts` to import from `../src/content/portfolio.ts` and assert:

```ts
test('top navigation exposes Blog but omits recommendations and hobbies', () => {
  const labels = portfolioContent.navigation.map((item) => item.label)
  assert.equal(labels.includes('Blog'), true)
  assert.equal(labels.includes('Recommendations'), false)
  assert.equal(labels.includes('Hobbies'), false)
})

test('side quests and hobby focal points are data driven', () => {
  assert.equal(portfolioContent.sections.sideQuests.title, 'Side Quests')
  assert.equal(hobbies.every((item) => /^\d+% \d+%$/.test(item.objectPosition)), true)
})

test('recommendation records have stable ids and safe optional links', () => {
  assert.equal(new Set(recommendations.map((item) => item.id)).size, recommendations.length)
  assert.equal(
    recommendations.every((item) => !item.href || item.href.startsWith('https://')),
    true
  )
})
```

- [ ] **Step 2: Run the focused test and verify failure**

Run: `npm test -- --test-name-pattern="top navigation|side quests|recommendation records"`

Expected: FAIL because `src/content/portfolio.ts` does not exist.

- [ ] **Step 3: Create the unified content types and registry**

Create `src/content/portfolio.ts` with these public interfaces:

```ts
export interface NavigationItem { label: string; href: `/${string}` }
export interface SocialLink { label: string; href: `https://${string}` }
export interface CareerItem { year: string; title: string; summary: string; stack: string[] }
export interface ProjectItem { slug: string; title: string; subtitle: string; description: string; details?: string; tech: string[]; metrics?: string[]; links: { demo?: `https://${string}`; repo?: `https://${string}` } }
export interface SideQuestItem { slug: string; title: string; subtitle: string; details: string; links?: { label: string; href: `https://${string}` }[] }
export interface HobbyItem { src: string; alt: string; title: string; blurb: string; objectPosition: `${number}% ${number}%` }
export type GradientToken = 'aurora' | 'sunset' | 'cobalt' | 'orchid' | 'citrus'

interface RecommendationBase {
  id: string
  title: string
  href?: `https://${string}`
  image?: string
  gradient: GradientToken
}

export interface BookRecommendation extends RecommendationBase { kind: 'book'; author?: string }
export interface MovieRecommendation extends RecommendationBase { kind: 'movie'; year?: string; tmdbId?: number }
export interface VideoRecommendation extends RecommendationBase { kind: 'video'; channel?: string }
export interface ArticleRecommendation extends RecommendationBase { kind: 'article'; publication?: string }
export type RecommendationItem = BookRecommendation | MovieRecommendation | VideoRecommendation | ArticleRecommendation
```

Move the existing identity, About, navigation, social, career, project, side-quest, hobby, and recommendation values into the same file. Define navigation as About, Experience, Projects, Side Quests, and Blog (`/blog`). Add `objectPosition` values to the four hobby records based on their current visible subjects. Replace `note` and `artClass` with the typed per-kind metadata and `gradient` tokens while retaining the existing recommendation titles.

- [ ] **Step 4: Convert old registries to content-free compatibility exports**

Replace `src/utils/data.ts` with:

```ts
export * from '@/content/portfolio'
```

Replace `src/utils/site.ts` with:

```ts
export { portfolioContent as siteConfig } from '@/content/portfolio'
export type { NavigationItem, SocialLink } from '@/content/portfolio'
```

- [ ] **Step 5: Run registry tests**

Run: `npm test`

Expected: all content tests pass after updating old discriminator assertions from `editorial` to `video` and `article`.

---

### Task 2: Add the validated Markdown content loader and sample posts

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `content/blog/a-small-note-on-recommendation-systems.md`
- Create: `content/blog/how-to-structure-an-analytics-problem.md`
- Create: `content/blog/building-a-personal-knowledge-system.md`
- Create: `src/lib/content/blog-parser.ts`
- Create: `src/lib/content/blog.ts`
- Create: `tests/blog-content.test.ts`

**Interfaces:**
- Produces: pure `BlogPostSummary`, `BlogPost`, `parseBlogDocument(filename, source)`, `calculateReadingTime(markdown)`, and `selectPublishedPosts(posts)` exports from `blog-parser.ts`; server-only `getPublishedPosts()`, `getPostBySlug(slug)`, and `getPublishedSlugs()` exports from `blog.ts`.
- Consumes: Markdown files with validated frontmatter and no cover-image property.

- [ ] **Step 1: Install the approved Markdown dependencies**

Run:

```bash
npm install gray-matter@4.0.3 react-markdown@9.0.1 remark-gfm@4.0.0
```

Expected: only these packages and their compatible transitive dependencies change `package.json` and `package-lock.json`; existing framework dependency versions stay unchanged.

- [ ] **Step 2: Write failing loader tests**

Create `tests/blog-content.test.ts` covering the pure exports:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { calculateReadingTime, parseBlogDocument, selectPublishedPosts } from '../src/lib/content/blog-parser.ts'

test('reading time has a one minute minimum', () => {
  assert.equal(calculateReadingTime('A short article.'), '1 min read')
})

test('frontmatter rejects a cover image and invalid date', () => {
  assert.throws(() => parseBlogDocument('bad.md', `---\ntitle: Bad\ndescription: Bad\ndate: tomorrow\ncategory: Notes\npublished: true\ncover: /bad.jpg\n---\nBody`))
})

test('frontmatter produces a slug and summary', () => {
  const post = parseBlogDocument('hello-world.md', `---\ntitle: Hello world\ndescription: A sample.\ndate: 2026-09-13\ncategory: Notes\npublished: true\n---\nHello world.`)
  assert.equal(post.slug, 'hello-world')
  assert.equal(post.readTime, '1 min read')
})

test('published posts are filtered and newest first', () => {
  const oldPost = parseBlogDocument('old.md', `---\ntitle: Old\ndescription: Old post.\ndate: 2026-01-01\ncategory: Notes\npublished: true\n---\nOld.`)
  const draft = parseBlogDocument('draft.md', `---\ntitle: Draft\ndescription: Draft post.\ndate: 2026-12-01\ncategory: Notes\npublished: false\n---\nDraft.`)
  const newPost = parseBlogDocument('new.md', `---\ntitle: New\ndescription: New post.\ndate: 2026-09-13\ncategory: Notes\npublished: true\n---\nNew.`)
  assert.deepEqual(selectPublishedPosts([oldPost, draft, newPost]).map((post) => post.slug), ['new', 'old'])
})
```

- [ ] **Step 3: Run the loader tests and verify failure**

Run: `npm test -- --test-name-pattern="reading time|frontmatter"`

Expected: FAIL because the loader exports do not exist.

- [ ] **Step 4: Implement validation and loading**

Create `src/lib/content/blog-parser.ts` as a pure module. Use:

```ts
const frontmatterSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(240),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().trim().min(1).max(40),
  published: z.boolean()
}).strict()
```

`parseBlogDocument(filename, source)` must call `matter(source)`, validate with the strict schema, derive the `.md` filename slug, reject slugs outside `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, and include the Markdown body. `calculateReadingTime` strips Markdown punctuation, counts whitespace-separated words, uses 220 words per minute, and returns at least `1 min read`. `selectPublishedPosts` filters `published: true` and sorts ISO dates descending.

Create `src/lib/content/blog.ts` as a server-only filesystem adapter that imports the pure parser. `getPublishedPosts` reads only `.md` files from `content/blog`, calls `selectPublishedPosts`, and returns summaries without body. `getPostBySlug` rejects unsafe slugs before reading and returns `null` for absent or unpublished files.

- [ ] **Step 5: Add three visible sample Markdown articles**

Create the three named files with `published: true`. Begin each body with:

```md
> Sample article — replace this text with Pranav's final draft before publishing the portfolio.
```

Across the files, include semantic examples of `##` headings, paragraphs, a blockquote, unordered and ordered lists, one safe HTTPS link, inline code, and a fenced TypeScript code block. Keep all prose instructional and avoid fictional employment outcomes, metrics, or personal claims.

- [ ] **Step 6: Run loader and full tests**

Run: `npm test`

Expected: loader tests and existing content tests pass.

---

### Task 3: Build the blog index and Medium-like article pages

**Files:**
- Create: `src/components/BlogIndex.tsx`
- Create: `src/components/BlogArticle.tsx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/writing/page.tsx`
- Modify: `src/components/SecondaryPageNav.tsx`
- Modify: `src/components/SecondaryPageShell.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `getPublishedPosts()`, `getPublishedSlugs()`, `getPostBySlug(slug)`, and `BlogPost`.
- Produces: `/blog`, statically generated `/blog/[slug]`, and permanent `/writing` redirect.

- [ ] **Step 1: Add route-presence assertions**

Extend `tests/site.test.ts` to read route sources and assert that `/writing` calls `permanentRedirect('/blog')`, the dynamic page exports `generateStaticParams`, and the article component configures `remarkGfm` without `rehypeRaw`.

- [ ] **Step 2: Run route assertions and verify failure**

Run: `npm test -- --test-name-pattern="blog routes"`

Expected: FAIL because the blog route files do not exist.

- [ ] **Step 3: Implement the server-rendered blog index**

`src/app/blog/page.tsx` calls `getPublishedPosts()` and passes summaries to `BlogIndex`. Export route metadata with title `Blog · Pranav Deepak` and a neutral description. `BlogIndex` renders an ordered list of text-only rows linking to `/blog/${slug}`, with category, formatted date, reading time, title, and description. Render `No published writing yet.` when the array is empty.

- [ ] **Step 4: Implement the safe Markdown article renderer**

`BlogArticle` uses:

```tsx
<ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
  {post.body}
</ReactMarkdown>
```

Do not import or configure `rehype-raw`. Map headings, paragraphs, lists, blockquotes, links, `code`, and `hr` to semantic elements with `blog-prose` classes. External links receive `target="_blank"` and `rel="noopener noreferrer"`; internal `/` links remain same-tab.

- [ ] **Step 5: Implement the dynamic article route**

`generateStaticParams()` maps `getPublishedSlugs()` to `{ slug }`. `generateMetadata()` returns title and description for a found post and neutral not-found metadata otherwise. The page awaits `params`, calls `notFound()` for `null`, and renders the article header plus `BlogArticle` inside the shared secondary shell.

- [ ] **Step 6: Redirect the legacy route and update secondary navigation**

Replace the `/writing` page body with:

```tsx
import { permanentRedirect } from 'next/navigation'

export default function WritingRedirect() {
  permanentRedirect('/blog')
}
```

Update secondary navigation to link `Blog` to `/blog` while retaining Recommendations. Extend its active union to `'blog' | 'recommendations'`, and make the shell intro optional so the Blog index can render without an explanatory paragraph.

- [ ] **Step 7: Add Medium-like typography**

Add scoped CSS for `.blog-index`, `.blog-index-row`, `.blog-article`, `.blog-article-header`, and `.blog-prose`. Use a maximum reading width of `720px`, body font size `clamp(18px, 1.7vw, 21px)`, line height `1.75`, heading margins of at least `2.2em 0 0.7em`, visible link underlines, distinct blockquotes, and horizontally scrollable code blocks. At widths below 768px, retain at least 20px inline page padding and reduce the article title without shrinking body copy below 18px.

- [ ] **Step 8: Run route tests, lint, and type checking**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
```

Expected: all commands pass with no warnings or errors.

---

### Task 4: Drive homepage Writing and Recommendations from content

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/WritingPreview.tsx`
- Modify: `src/components/RecommendationsPreview.tsx`
- Modify: `src/components/Recommendations.tsx`
- Modify: `src/components/BookShelf.tsx`
- Modify: `src/components/MovieLibrary.tsx`
- Create: `src/components/RecommendationArtwork.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/site.test.ts`

**Interfaces:**
- Consumes: published Markdown summaries and the recommendation union from `src/content/portfolio.ts`.
- Produces: automatic homepage previews and category-specific recommendation collections.

- [ ] **Step 1: Write failing UI-source tests**

Assert in `tests/site.test.ts` that `WritingPreview` calls `getPublishedPosts`, contains no hard-coded subtitle or placeholder art, and targets `/blog`; assert that recommendation rendering handles `book`, `movie`, `video`, and `article`, and that gradient class names come from the typed token.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- --test-name-pattern="homepage previews|recommendation rendering"`

Expected: FAIL against the current hard-coded Writing registry and `editorial` recommendation type.

- [ ] **Step 3: Convert Writing preview to a server component**

Call `getPublishedPosts()`, take the first three, and render a text-only grid. Each title links to `/blog/${post.slug}` and shows category, date, and calculated reading time. Pass no `subtitle` to `Section`; keep `title="Writing"` and the right-side `View all` action linking to `/blog`.

- [ ] **Step 4: Add recommendation artwork fallbacks**

`RecommendationArtwork` accepts `image`, `alt`, `gradient`, and `className`. When `image` exists, render `next/image`; otherwise render an `aria-hidden` element with `recommendation-gradient recommendation-gradient-${gradient}`. Define five saturated gradient classes using CSS gradients only.

- [ ] **Step 5: Update recommendation collections**

Filter the unified records into books, movies, videos, and articles. Books remain bookshelf spines; movies retain poster proportions; videos and articles share accessible editorial rows. Wrap entries in anchors only when `href` is a validated URL. Use title plus author/year/channel/publication as visible metadata. Remove the homepage section subtitle and keep `View all recommendations` on the right.

- [ ] **Step 6: Run tests and type checking**

Run:

```bash
npm test
npx tsc --noEmit
```

Expected: all tests and strict TypeScript pass.

---

### Task 5: Apply approved labels, navigation, portrait, buttons, and hobby geometry

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/Misc.tsx`
- Modify: `src/components/Hobbies.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/app/globals.css`
- Modify: `tests/site.test.ts`

**Interfaces:**
- Consumes: labels, links, social data, hobby focal positions, and section copy from `portfolioContent`.
- Produces: the approved public labels and responsive geometry without component-owned copy.

- [ ] **Step 1: Write failing presentation assertions**

Assert that `Misc.tsx` reads `portfolioContent.sections.sideQuests`, `About.tsx` links both CTAs with `button-secondary`, `Hobbies.tsx` applies `style={{ objectPosition: hobby.objectPosition }}`, and top navigation is generated only from the new registry.

- [ ] **Step 2: Run focused assertions and verify failure**

Run: `npm test -- --test-name-pattern="approved presentation"`

Expected: FAIL against the current component-owned labels and button classes.

- [ ] **Step 3: Apply the content-driven labels and links**

Render `Side Quests` as the section title while preserving `id="misc"` for existing anchors. Read the Hobbies title and any remaining section copy from the registry. Keep Recommendations and Hobbies on the page but omit them from the registry-provided top navigation. Update the About writing CTA to `/blog`.

- [ ] **Step 4: Align About and CTA treatments**

Set `.about-grid { align-items: center; }`. Give both About CTAs `button-secondary interactive-target`; preserve their distinct labels and destinations.

- [ ] **Step 5: Make hobby images equal 4:3 rectangles**

Replace the fixed `300px` hobby image height with `aspect-ratio: 4 / 3; width: 100%`. Use a four-column grid at desktop, two columns on tablets, and one column on narrow screens, with a consistent `24px` gap. Apply each record's `objectPosition` inline and retain `object-fit: cover`.

- [ ] **Step 6: Run tests, lint, and type checking**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
```

Expected: all commands pass with no warnings or errors.

---

### Task 6: Update maintenance documentation and perform release-level validation

**Files:**
- Modify: `codex/docs/portfolio-context.md`
- Modify: `codex/docs/portfolio-workflow.md`
- Verify only: `src/components/Tilt.tsx`

**Interfaces:**
- Consumes: the completed content and route architecture.
- Produces: an accurate local authoring workflow and validation evidence.

- [ ] **Step 1: Document article authoring**

Update the local context and workflow to state that non-blog content lives in `src/content/portfolio.ts`, posts live in `content/blog/*.md`, `published: false` hides drafts, filenames are slugs, reading time is automatic, raw HTML is disabled, and `/writing` redirects to `/blog`.

- [ ] **Step 2: Run complete automated verification**

Run:

```bash
npm test
npm run lint
npx tsc --noEmit
git diff --check
npm run build
```

Expected: tests, lint, strict TypeScript, whitespace validation, and the production build all pass. The build route table includes `/blog`, `/blog/[slug]`, `/recommendations`, `/writing`, and `/api/contact`.

- [ ] **Step 3: Run manual browser verification**

At desktop and 390×844 mobile viewports, verify the homepage, `/blog`, all three sample article routes, `/recommendations`, and an unknown blog slug. Confirm the `/writing` redirect, readable article measure, code-block scrolling, focus visibility, mobile navigation, recommendation links/fallback gradients, 4:3 hobby geometry, and About vertical alignment. Confirm reduced-motion mode does not gate content.

- [ ] **Step 4: Verify protected work and scope**

Run:

```bash
git diff -- src/components/Tilt.tsx
git status --short
```

Compare `Tilt.tsx` with its pre-task state and confirm it was not modified during this implementation. Confirm no real contact message was sent, no deployment occurred, and no unrelated dependency major version changed.
