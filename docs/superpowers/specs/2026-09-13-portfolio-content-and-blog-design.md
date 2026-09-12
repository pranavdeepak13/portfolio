# Portfolio content and blog design

Date: 2026-09-13
Status: Approved for implementation

## Objective

Make the portfolio easy to maintain without editing presentation components. Blog articles will be readable, text-first Markdown documents with Medium-like typography. All other public portfolio content will live in one typed registry. Adding or removing a record must update the relevant homepage and index views automatically.

## Content architecture

### Portfolio registry

`src/content/portfolio.ts` will be the single source of truth for:

- identity, role, About copy, social links, navigation, and résumé URL fallback;
- experience, projects, Side Quests, and hobbies;
- section titles and homepage preview settings;
- book, film, YouTube video, and article recommendations;
- named vibrant gradient tokens used when recommendation artwork is absent.

Components will import typed records from this registry. Existing `src/utils/data.ts` and `src/utils/site.ts` will either be removed or retained only as compatibility re-exports with no duplicated content.

### Blog articles

Each article will be an individual file under `content/blog/`. The filename is the public slug. Frontmatter contains only listing and publication metadata:

```yaml
---
title: A small note on recommendation systems
description: A short summary used on listing pages and in metadata.
date: 2026-09-13
category: Technology
published: true
---
```

The remaining file is ordinary Markdown. There is no cover-image field and blog views will not invent a cover placeholder. Reading time is calculated from the body.

Three clearly labelled sample articles will be included. They demonstrate paragraphs, headings, blockquotes, lists, links, and fenced code without presenting fictional career claims as fact. Deleting a sample file removes it from every blog listing at the next build.

## Blog data flow

`src/lib/content/blog.ts` will:

1. read `content/blog/*.md` on the server at build time;
2. parse and validate frontmatter with Zod;
3. derive the slug from the filename and calculate reading time;
4. exclude records where `published` is false;
5. sort published posts by date descending;
6. return either summary records or a full article record.

Malformed published content will fail the build with a filename-specific error instead of silently rendering incomplete pages.

The Markdown renderer will use `react-markdown`, `remark-gfm`, and `gray-matter`. Raw HTML rendering will not be enabled. This adds three focused dependencies while avoiding a custom Markdown parser and preventing article files from executing React or browser scripts.

## Routes and presentation

### Blog index

`/blog` will be a server-rendered index with restrained, Medium-inspired typography. Each row contains category, date, calculated reading time, title, and description. The index is text-only and uses no cover art.

The existing `/writing` route will permanently redirect to `/blog` so saved links continue to work.

### Article page

`/blog/[slug]` will be statically generated for every published Markdown file. It includes:

- a narrow reading column of approximately 680–720px;
- title, description, category, date, and reading time;
- readable paragraph measure, generous line height, and responsive type;
- semantic styles for headings, blockquotes, ordered and unordered lists, links, inline code, fenced code, and horizontal rules;
- a back-to-blog control and site navigation;
- per-post metadata derived from frontmatter;
- a not-found response for unknown or unpublished slugs.

### Homepage Writing section

The section keeps the visible heading `Writing` and the right-aligned `View all` link, which targets `/blog`. Its explanatory subtitle is removed. The preview is generated from the latest published Markdown files and is text-only.

## Recommendations

Recommendations remain in `src/content/portfolio.ts` as a typed discriminated union:

- books: title, author, optional link, optional local artwork;
- movies: title, year, optional TMDB ID/link, optional poster;
- videos: title, channel, YouTube URL, optional thumbnail;
- articles: title, publication, URL, optional thumbnail.

Every recommendation has a stable ID and a named gradient token. When an artwork path is absent, the UI shows the configured vibrant CSS gradient. Adding or deleting an entry updates the homepage preview, category counts, bookshelf/library collections, and recommendation page automatically.

External links render only when a valid `https://` URL exists. They open in a new tab with safe relationship attributes and an accessible label. Placeholder `#` links are not permitted.

The homepage Recommendations section contains only its heading and right-aligned `View all` link; its explanatory subtitle is removed.

## Other portfolio changes

- Change the public label `Misc` to `Side Quests`, including the heading and navigation anchor label.
- Remove Hobbies and Recommendations from the desktop and mobile top navigation.
- Rename the top-navigation Writing item to `Blog` and link it to `/blog`.
- Vertically center the About portrait against the text column.
- Give `Explore projects` the same secondary-link/button treatment as `Read the writing`.
- Render hobby media as equal 4:3 rectangles with consistent gaps. Each hobby record can set its own object position so important subjects are not cropped.
- Keep the full Recommendations route available even though it is removed from the top navigation.

## Component boundaries

- Server components remain the default for content lists and article pages.
- `BlogIndex` renders a list of summary records.
- `BlogArticle` owns semantic Markdown component mappings.
- Existing recommendation primitives continue to own bookshelf, movie-library, and editorial layouts.
- Client components remain limited to interactive state such as mobile navigation, dialogs, and contact submission.

## Accessibility and responsive behavior

- Article typography retains a comfortable line length and scales down without horizontal scrolling.
- Heading levels follow document order.
- Links and controls keep visible focus treatment and at least 44px practical targets where they behave like buttons.
- Code blocks scroll horizontally rather than breaking the page.
- Recommendation fallback gradients are decorative and hidden from assistive technology; text carries the meaning.
- Hobby images retain descriptive alt text and configurable focal positions.
- Existing reduced-motion behavior remains intact.

## Error handling

- Invalid published Markdown frontmatter fails the build with the source filename.
- Missing article slugs return the Next.js not-found page.
- Empty content collections render a short neutral empty state instead of a broken grid.
- Missing recommendation artwork uses the configured gradient; missing or invalid URLs render non-clickable entries.

## Verification

Implementation will add content-loader tests covering frontmatter validation, published filtering, date ordering, reading-time calculation, and URL handling. Existing site/content tests will be updated for the new navigation and labels.

Manual checks will cover:

- homepage preview generation;
- `/blog`, all three sample articles, `/writing` redirect, and unknown slugs;
- recommendation categories, links, and gradient fallbacks;
- desktop and mobile article readability;
- hobby crop and spacing;
- keyboard focus and top/mobile navigation.

The final validation commands are:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Out of scope

- Browser-based editing or a CMS;
- runtime article publishing without a deployment;
- remote image fetching or a TMDB API integration in this slice;
- comments, likes, accounts, analytics, or search;
- dependency major-version upgrades, deployment, DNS, or contact-message submission.
