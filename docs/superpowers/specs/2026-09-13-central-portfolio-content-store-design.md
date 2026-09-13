# Central portfolio content store design

Date: 2026-09-13
Status: Approved for implementation planning

## Objective

Make the portfolio maintainable without editing React presentation files. All owner-edited public content except long-form article bodies will live in one JSON document. Adding, reordering, updating, or removing projects, experience entries, Side Quests, skills, hobbies, recommendations, navigation links, metadata, and interface copy must be possible through that document alone.

The existing visual design, routes, animations, responsive behavior, and contact workflow will remain unchanged unless a small rendering adjustment is required to support an empty or optional content collection.

## Content sources

### Portfolio JSON

`src/content/portfolio.json` will be the only owner-edited source for non-article public content. It will contain:

- site identity, role, language, metadata, social links, résumé fallback URL, and footer copy;
- primary and secondary navigation labels and destinations;
- Hero, About, and section-level headings, descriptions, action labels, and empty states;
- experience, projects, skills, Side Quests, hobbies, and recommendations;
- recommendation category labels and fallback artwork tokens;
- Writing preview labels and display limit;
- contact-dialog labels, instructions, field labels, submission states, and user-facing messages.

Array order determines display order. Removing an object removes it from the rendered site. Stable `id` or `slug` fields identify records independently of their visible title.

The JSON document will contain public values only. Secrets, email recipients, API keys, rate-limit settings, and provider configuration remain in server environment variables. `NEXT_PUBLIC_RESUME_URL` may continue to override the résumé fallback in JSON so existing deployments are not broken; the content workflow will document that precedence.

### Blog Markdown

Long-form writing remains under `content/blog/*.md`. Each file owns its article title, description, date, category, publication status, and Markdown body. The existing validated Markdown loader, publication filtering, date ordering, reading-time calculation, `/blog` index, and `/blog/[slug]` routes remain in place.

Adding or removing an article requires only adding or removing its Markdown file. Article content will not be duplicated in `portfolio.json`.

## Content model

The JSON document will be grouped by the way the owner thinks about the site rather than by React component names:

```text
site
navigation
hero
about
sections
experience[]
projects[]
skills[]
sideQuests[]
writing
recommendations { labels, previewLimit, items[] }
hobbies[]
contact
```

Content records will use explicit fields instead of presentation-shaped HTML. For example, a project contains its slug, title, subtitle, descriptions, technologies, metrics, and optional links. A recommendation uses a discriminated `kind` (`book`, `movie`, `video`, or `article`) plus the fields appropriate to that kind. Missing recommendation artwork selects a named gradient token already understood by the design system.

Optional links are omitted or set to `null`; placeholder `#` links are invalid. Internal links must start with `/` or `/#`, and external links must use `https://`. Local image paths must point under `/images/`. Hobby focal points retain their percentage-based `objectPosition` value.

Owner-facing copy belongs in JSON. Pure implementation details remain in code, including CSS classes, DOM IDs, animation constants, HTTP methods, validation mechanics, focus management, derived accessibility labels, date formatting, and technical server logs.

## Validation and typed interface

React modules will not import the raw JSON file. A content module under `src/lib/content/` will form the single seam between editable content and the application:

1. `portfolio-schema.ts` defines the Zod schemas and exports inferred TypeScript types.
2. `portfolio.ts` imports `portfolio.json`, validates it once, applies the existing résumé environment override, and exports the validated `portfolioContent` object.
3. Server components import `portfolioContent` through this interface.
4. Client components receive only the content they need as typed props from their server parent. This keeps Zod and the complete content registry out of the browser bundle.

The schema will validate required text, recognized recommendation kinds and gradient tokens, URL/path formats, numeric skill levels, dates represented as display strings, image focal points, and per-record structure. Cross-record validation will reject duplicate project slugs, Side Quest slugs, recommendation IDs, and navigation destinations where duplicates would make rendering ambiguous.

Validation fails fast during development, tests, and production builds. The error will identify the JSON path of each invalid value so the owner can correct the content without inspecting a React component.

Compatibility files such as `src/utils/data.ts` and `src/utils/site.ts` may remain temporarily as content-free re-exports if required by untouched imports. No data may be duplicated in them.

## Rendering flow

The homepage and secondary routes remain composition roots. They load validated content on the server and pass section records into the existing presentation modules. Each repeated collection renders by mapping its JSON array.

Interactive modules remain client-side only where browser behavior is required:

- Hero receives identity and Hero copy as props while retaining parallax behavior internally.
- SiteHeader receives navigation and résumé data as props while retaining menu state and keyboard handling.
- ContactSticky receives its public labels and messages as props while retaining validation, dialog focus, and submission logic.

Recommendation grouping and homepage preview selection are derived from the validated item list. The configured preview limit controls how many recommendations appear on the homepage. Blog previews continue to be derived from the latest published Markdown files.

Empty collections render either nothing or the configured neutral empty-state copy, according to the existing layout needs; they must not produce broken grids, dialogs, or undefined property access. Optional project and recommendation links render only when present.

## Scope of the migration

The migration will:

- move the existing values without silently rewriting personal claims, dates, descriptions, titles, or URLs;
- migrate remaining embedded owner-facing copy from components and route metadata;
- update every content consumer to use the validated interface or typed props;
- remove duplicated content exports after consumers have moved;
- update the portfolio context and content workflow with JSON editing examples for every repeatable record type.

The migration will not:

- add a browser CMS, authentication, database, or runtime publishing;
- change the visual design or introduce a new content management dependency beyond the existing Zod validator;
- move secrets or server configuration into public JSON;
- combine long-form article bodies into the portfolio registry;
- invent new personal copy, links, images, metrics, or career claims.

## Error handling

- Invalid JSON syntax produces a build error at the source file.
- Schema failures identify the invalid field path and expected value.
- Duplicate stable identifiers are rejected before rendering.
- Missing optional artwork uses the existing named gradient fallback.
- Missing optional links render a non-clickable item.
- Empty collections use their defined empty behavior without causing runtime errors.
- Existing Markdown errors continue to name the invalid article file.

## Testing and verification

Automated tests will cover:

- successful validation of the production JSON document;
- rejection of unsafe links, invalid image paths, unknown recommendation kinds or gradients, out-of-range skill levels, malformed focal points, and duplicate identifiers;
- recommendation grouping and preview limits;
- empty and optional collection behavior where it is implemented as a pure selector;
- preservation of the Markdown content loader behavior.

Repository verification will run:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Manual verification will check the homepage, `/blog`, an article page, `/recommendations`, desktop and mobile navigation, project details, recommendation links and fallbacks, hobby crops, contact-dialog copy and states, keyboard behavior, and responsive layouts. A source audit will confirm that owner-maintained portfolio records and prose no longer remain inside React components.

## Success criteria

The change is complete when:

1. All non-article owner-maintained public content is editable in `src/content/portfolio.json`.
2. Adding or deleting any repeated content record requires no React edit.
3. Long-form writing remains editable as individual Markdown files.
4. Invalid content fails with a useful path-specific validation error.
5. Components render the existing design from typed data without shipping the validator or entire registry unnecessarily to client-only code.
6. Documentation gives the portfolio owner enough examples to maintain the site without opening component files.
