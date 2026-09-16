import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'

const root = process.cwd()

test('legacy content registries and compatibility bridges are absent', () => {
  for (const legacySource of [
    'src/content/portfolio.ts',
    'src/utils/data.ts',
    'src/utils/site.ts'
  ]) {
    assert.equal(existsSync(path.join(root, legacySource)), false, legacySource)
  }
})

test('homepage sections receive focused content props from the server composition root', async () => {
  const components = ['Hero', 'About', 'Timeline', 'Projects', 'Misc', 'RecommendationsPreview', 'RecommendationArtwork', 'Hobbies', 'WritingPreview']
  const sources = await Promise.all(components.map(async (name) => ({
    name,
    source: await readFile(path.join(root, `src/components/${name}.tsx`), 'utf8')
  })))

  for (const { name, source } of sources) {
    assert.doesNotMatch(source, /@\/content\/portfolio|@\/utils\/(?:data|site)|portfolio\.json/, name)
    assert.doesNotMatch(source, /['"]@\/lib\/content\/portfolio['"]/, name)
    assert.match(source, /import type \{[^}]+\} from '@\/lib\/content\/portfolio-schema'/, name)
  }

  const page = await readFile(path.join(root, 'src/app/page.tsx'), 'utf8')
  assert.match(page, /import \{ portfolioContent \} from '@\/lib\/content\/portfolio'/)
  assert.match(page, /const heroIdentity = \{\s*name: portfolioContent\.site\.name,\s*mark: portfolioContent\.site\.mark,\s*role: portfolioContent\.site\.role\s*\}/)
  assert.match(page, /<Hero identity=\{heroIdentity\} hero=\{portfolioContent\.hero\}/)
  assert.doesNotMatch(page, /<Hero site=\{portfolioContent\.site\}/)
  assert.match(page, /<About content=\{portfolioContent\.about\} socials=\{portfolioContent\.site\.socials\} socialsLabel=\{portfolioContent\.site\.socialsLabel\}/)
  for (const [component, kind] of [
    ['Timeline', 'experience'],
    ['Projects', 'projects'],
    ['Misc', 'sideQuests']
  ]) {
    assert.match(
      page,
      new RegExp(`case '${kind}':\\s*return <${component} key=\\{collection\\.kind\\} section=\\{collection\\.section\\} items=\\{collection\\.items\\}`)
    )
  }
  assert.match(page, /<Hobbies section=\{portfolioContent\.sections\.hobbies\} items=\{portfolioContent\.hobbies\}/)
  assert.match(page, /<WritingPreview section=\{portfolioContent\.sections\.writing\}/)
  assert.match(page, /<RecommendationsPreview section=\{portfolioContent\.sections\.recommendations\} content=\{portfolioContent\.recommendations\}/)
})

test('focused content props provide configured collection empty states and preview copy', async () => {
  for (const name of ['Timeline', 'Projects', 'Misc', 'RecommendationsPreview', 'Hobbies', 'WritingPreview']) {
    const source = await readFile(path.join(root, `src/components/${name}.tsx`), 'utf8')
    assert.match(source, /\.length === 0/, name)
    assert.match(source, /\{section\.empty\}/, name)
  }
  const writing = await readFile(path.join(root, 'src/components/WritingPreview.tsx'), 'utf8')
  assert.match(writing, /slice\(0, section\.previewLimit\)/)
  assert.match(writing, /section\.viewAllLabel/)
  const recommendations = await readFile(path.join(root, 'src/components/RecommendationsPreview.tsx'), 'utf8')
  assert.match(recommendations, /slice\(0, content\.previewLimit\)/)
  assert.match(recommendations, /content\.labels\[item\.kind\]/)
})

test('homepage source omits the removed Skills section', async () => {
  const page = await readFile(path.join(root, 'src/app/page.tsx'), 'utf8')

  assert.match(page, /getHomepageCollectionSections\(portfolioContent\)/)
  assert.doesNotMatch(page, /Skills|case 'skills'/)
  assert.equal(existsSync(path.join(root, 'src/components/Skills.tsx')), false)
})

test('homepage writing preview loads published markdown without artwork or an explanation', async () => {
  const source = await readFile(path.join(root, 'src/components/WritingPreview.tsx'), 'utf8')

  assert.match(source, /getPublishedPosts/)
  assert.match(source, /href="\/blog"/)
  assert.doesNotMatch(source, /PlaceholderArt|subtitle=/)
  assert.doesNotMatch(source, /className="home-writing-card"[^>]*aria-label=/)
})

test('Hero exposes the configured concise mark label while preserving the visible mark', async () => {
  const source = await readFile(path.join(root, 'src/components/Hero.tsx'), 'utf8')

  assert.match(source, /className="hero-mark" aria-label=\{hero\.markLabel\}>\{identity\.mark\}/)
})

test('recommendation rendering supports each typed collection and gradient artwork', async () => {
  const [recommendations, artwork] = await Promise.all([
    readFile(path.join(root, 'src/components/Recommendations.tsx'), 'utf8'),
    readFile(path.join(root, 'src/components/RecommendationArtwork.tsx'), 'utf8')
  ])

  assert.match(recommendations, /content\.labels\[item\.kind\]/)
  assert.match(recommendations, /groups/)
  assert.match(artwork, /recommendation-gradient-/)
  assert.match(artwork, /next\/image/)
})

test('homepage recommendation section has only a heading and view-all action', async () => {
  const source = await readFile(path.join(root, 'src/components/RecommendationsPreview.tsx'), 'utf8')

  assert.match(source, /section\.viewAllLabel/)
  assert.doesNotMatch(source, /subtitle=/)
})

test('approved presentation uses focused section content with equal CTA treatment and hobby focal points', async () => {
  const [about, sideQuests, hobbies, header] = await Promise.all([
    readFile(path.join(root, 'src/components/About.tsx'), 'utf8'),
    readFile(path.join(root, 'src/components/Misc.tsx'), 'utf8'),
    readFile(path.join(root, 'src/components/Hobbies.tsx'), 'utf8'),
    readFile(path.join(root, 'src/components/SiteHeader.tsx'), 'utf8')
  ])

  assert.match(about, /content\.actions\.map/)
  assert.match(about, /button-secondary interactive-target/)
  assert.match(sideQuests, /title=\{section\.title\}/)
  assert.match(hobbies, /objectPosition: hobby\.objectPosition/)
  assert.match(header, /navigation\.primary\.map/)
})

test('shared shell and secondary components receive content without crossing the server boundary', async () => {
  for (const name of ['SiteHeader', 'SiteFooter', 'SecondaryPageNav', 'SecondaryPageShell', 'BlogIndex', 'BlogArticle', 'BookShelf', 'MovieLibrary', 'Recommendations', 'ContactSticky']) {
    const source = await readFile(path.join(root, `src/components/${name}.tsx`), 'utf8')
    assert.doesNotMatch(source, /@\/content\/portfolio|@\/utils\/(?:data|site)|portfolio\.json/, name)
    assert.doesNotMatch(source, /['"]@\/lib\/content\/portfolio['"]/, name)
    assert.match(source, /import type \{[^}]+\} from '@\/lib\/content\/portfolio-schema'/, name)
  }
  for (const route of ['layout.tsx', 'page.tsx', 'blog/page.tsx', 'blog/[slug]/page.tsx', 'recommendations/page.tsx']) {
    const source = await readFile(path.join(root, 'src/app', route), 'utf8')
    assert.match(source, /import \{ portfolioContent \} from '@\/lib\/content\/portfolio'/, route)
  }
})

test('route loading and error UI consume focused interface copy from the root provider', async () => {
  const providerPath = path.join(root, 'src/components/SystemCopyProvider.tsx')
  assert.equal(existsSync(providerPath), true)
  if (!existsSync(providerPath)) return

  const [provider, layout, loading, error] = await Promise.all([
    readFile(providerPath, 'utf8'),
    readFile(path.join(root, 'src/app/layout.tsx'), 'utf8'),
    readFile(path.join(root, 'src/app/loading.tsx'), 'utf8'),
    readFile(path.join(root, 'src/app/error.tsx'), 'utf8')
  ])

  assert.match(provider, /^'use client'/)
  assert.match(provider, /createContext/)
  assert.doesNotMatch(provider, /@\/lib\/content\/portfolio['"]|portfolio\.json|from ['"]zod['"]/)
  assert.match(layout, /<SystemCopyProvider copy=\{portfolioContent\.interface\}>\{children\}<\/SystemCopyProvider>/)
  assert.match(loading, /useSystemCopy\(\)/)
  assert.match(loading, /copy\.loading\.title/)
  assert.match(loading, /copy\.loading\.detail/)
  assert.match(error, /useSystemCopy\(\)/)
  assert.match(error, /copy\.error\.title/)
  assert.match(error, /copy\.error\.reloadLabel/)
  assert.match(error, /console\.error\(error\)/)
  assert.match(error, /onClick=\{reset\}/)
})

test('server composition passes skip-link copy directly to homepage and secondary shells', async () => {
  const [page, shell, ...routes] = await Promise.all([
    readFile(path.join(root, 'src/app/page.tsx'), 'utf8'),
    readFile(path.join(root, 'src/components/SecondaryPageShell.tsx'), 'utf8'),
    ...['blog/page.tsx', 'blog/[slug]/page.tsx', 'recommendations/page.tsx'].map((route) =>
      readFile(path.join(root, 'src/app', route), 'utf8')
    )
  ])

  assert.match(page, />\{portfolioContent\.interface\.skipToContentLabel\}<\/a>/)
  assert.match(shell, />\{skipToContentLabel\}<\/a>/)
  for (const route of routes) {
    assert.match(route, /skipToContentLabel=\{portfolioContent\.interface\.skipToContentLabel\}/)
  }
})

test('server composition constructs exact client view models instead of forwarding whole records', async () => {
  const page = await readFile(path.join(root, 'src/app/page.tsx'), 'utf8')
  assert.match(
    page,
    /const headerNavigation = \{\s*primary: portfolioContent\.navigation\.primary,\s*primaryLabel: portfolioContent\.navigation\.primaryLabel,\s*mobileLabel: portfolioContent\.navigation\.mobileLabel,\s*menuOpenLabel: portfolioContent\.navigation\.menuOpenLabel,\s*menuCloseLabel: portfolioContent\.navigation\.menuCloseLabel,\s*menuLabel: portfolioContent\.navigation\.menuLabel,\s*backToTopLabel: portfolioContent\.navigation\.backToTopLabel\s*\}/
  )
  assert.match(page, /navigation=\{headerNavigation\}/)
  assert.doesNotMatch(page, /<SiteHeader[^>]*navigation=\{portfolioContent\.navigation\}/)

  for (const route of ['blog/page.tsx', 'blog/[slug]/page.tsx', 'recommendations/page.tsx']) {
    const source = await readFile(path.join(root, 'src/app', route), 'utf8')
    assert.match(
      source,
      /const secondaryNavigation = \{\s*secondary: portfolioContent\.navigation\.secondary,\s*secondaryLabel: portfolioContent\.navigation\.secondaryLabel\s*\}/,
      route
    )
    assert.match(
      source,
      /const secondarySite = \{\s*name: portfolioContent\.site\.name,\s*footer: portfolioContent\.site\.footer\s*\}/,
      route
    )
    assert.match(source, /navigation=\{secondaryNavigation\}/, route)
    assert.match(source, /site=\{secondarySite\}/, route)
    assert.doesNotMatch(source, /navigation=\{portfolioContent\.navigation\}|site=\{portfolioContent\.site\}/, route)
  }
})

test('remaining shell, blog, and collection labels render from focused props', async () => {
  const expected: Record<string, string[]> = {
    SiteHeader: ['navigation.primaryLabel', 'navigation.mobileLabel', 'navigation.menuOpenLabel', 'navigation.menuCloseLabel', 'navigation.menuLabel', 'resume.label', 'navigation.backToTopLabel'],
    SiteFooter: ['formatFooter(footer, name'],
    SecondaryPageNav: ['items.map', 'aria-label={label}', '{name}'],
    BlogIndex: ['{empty}', '{writing.indexLabel}', 'writing.readLabel'],
    BlogArticle: ['{writing.backLabel}'],
    BookShelf: ['{labels.shelfTitle}', '{labels.shelfNote}', 'labels.booksLabel'],
    MovieLibrary: ['{labels.filmsTitle}', 'labels.letterboxd.href', '{labels.letterboxd.label}'],
    Recommendations: ['content.countsLabel', '{content.booksTitle}', '{content.filmsTitle}', '{content.labels.editorial}', '{content.editorialTitle}', 'content.labels[item.kind]']
  }
  for (const [name, expressions] of Object.entries(expected)) {
    const source = await readFile(path.join(root, `src/components/${name}.tsx`), 'utf8')
    for (const expression of expressions) assert.ok(source.includes(expression), `${name}: ${expression}`)
  }
  const layout = await readFile(path.join(root, 'src/app/layout.tsx'), 'utf8')
  assert.match(layout, /title: portfolioContent\.site\.metadata\.title/)
  assert.match(layout, /description: portfolioContent\.site\.metadata\.description/)
  assert.match(layout, /lang=\{portfolioContent\.site\.language\}/)
  const blogIndexRoute = await readFile(path.join(root, 'src/app/blog/page.tsx'), 'utf8')
  assert.match(
    blogIndexRoute,
    /title: `\$\{portfolioContent\.sections\.writing\.metadata\.title\} · \$\{portfolioContent\.site\.name\}`/
  )
  const route = await readFile(path.join(root, 'src/app/recommendations/page.tsx'), 'utf8')
  assert.match(
    route,
    /title: `\$\{portfolioContent\.sections\.recommendations\.title\} · \$\{portfolioContent\.site\.name\}`/
  )
  assert.match(route, /getRecommendationGroups\(portfolioContent\)/)
})

test('contact client and API share dependency-free injected validation while preserving the dialog and request contract', async () => {
  const client = await readFile(path.join(root, 'src/components/ContactSticky.tsx'), 'utf8')
  const api = await readFile(path.join(root, 'src/app/api/contact/route.ts'), 'utf8')
  assert.match(client, /useMemo\(\(\) => createContactValidator\(content\.validation\), \[content\.validation\]\)/)
  assert.match(api, /createContactValidator\(portfolioContent\.contact\.validation\)/)
  for (const name of ['invalid', 'sending', 'success', 'rateLimited', 'failure', 'network']) {
    assert.ok(client.includes(`content.messages.${name}`), name)
  }
  for (const name of ['triggerLabel', 'eyebrow', 'title', 'intro', 'closeLabel', 'submitLabel', 'submittingLabel']) {
    assert.ok(client.includes(`content.${name}`), name)
  }
  for (const field of ['name', 'email', 'message', 'website']) {
    assert.ok(client.includes(`content.fields.${field}.label`), field)
    assert.ok(client.includes(`name="${field}"`), field)
  }
  assert.match(client, /fetch\('\/api\/contact', \{\s*method: 'POST'/)
  assert.match(client, /id="contact-dialog"/)
  assert.match(client, /showModal\(\)/)
  assert.match(client, /triggerRef\.current\?\.focus\(\)/)
  assert.match(client, /nameRef\.current\?\.focus\(\)/)
})
