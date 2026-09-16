import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { parsePortfolioContent } from '../src/lib/content/portfolio-schema.ts'
import { getRecommendationGroups } from '../src/lib/content/portfolio-selectors.ts'

const portfolioContent = parsePortfolioContent(JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/content/portfolio.json'), 'utf8')
))
const { experience, projects, sideQuests, hobbies, recommendations } = portfolioContent

test('navigation exposes the blog route without removed top-level items', () => {
  const hrefs = portfolioContent.navigation.primary.map((item) => item.href)

  assert.equal(hrefs.includes('/blog'), true)
  assert.equal(hrefs.includes('/#recommendations'), false)
  assert.equal(hrefs.includes('/#hobbies'), false)
  assert.equal(hrefs.includes('/#skills'), false)
  assert.equal(hrefs.includes('#skills'), false)
})

test('home section navigation remains valid from the blog route', () => {
  const sectionLinks = portfolioContent.navigation.primary.filter((item) => item.href.includes('#'))

  assert.equal(sectionLinks.length > 0, true)
  assert.equal(sectionLinks.every((item) => item.href.startsWith('/#')), true)
})

test('recommendations use supported discriminators', () => {
  const groups = getRecommendationGroups(portfolioContent)

  assert.equal(
    recommendations.items.every((item) => ['book', 'movie', 'video', 'article'].includes(item.kind)),
    true
  )
  assert.equal(
    groups.books.length + groups.movies.length + groups.videos.length + groups.articles.length,
    recommendations.items.length
  )
})

test('recommendation visuals use configured gradients instead of generated image assets', () => {
  const content = JSON.stringify({ recommendations: recommendations.items })

  assert.equal(content.includes('/images/sead'), false)
  assert.equal(recommendations.items.every((item) => item.gradient.length > 0), true)
})

test('home imagery uses local colour photography only where requested', () => {
  assert.equal(hobbies.every((hobby) => hobby.src.startsWith('/images/hobbies/')), true)
  assert.equal(hobbies.every((hobby) => hobby.alt.length > 0), true)
  assert.equal(projects.every((project) => !('artClass' in project)), true)
})

test('footer templates resolve every year and name token without changing visible copy', async () => {
  const modulePath = '../src/lib/content/portfolio-selectors.ts'
  const selectorModule = await import(modulePath) as {
    formatFooter?: (template: string, name: string, year: number) => string
  }

  assert.equal(portfolioContent.site.footer, '© {year} · {name}')
  assert.equal(typeof selectorModule.formatFooter, 'function')
  assert.equal(
    selectorModule.formatFooter?.('{name} · {year} · {name}', 'Pranav Deepak', 2026),
    'Pranav Deepak · 2026 · Pranav Deepak'
  )
})

test('homepage collection composition omits the removed Skills section', async () => {
  const modulePath = '../src/lib/content/portfolio-selectors.ts'
  const selectorModule = await import(modulePath) as {
    getHomepageCollectionSections?: (content: typeof portfolioContent) => Array<{
      kind: string
      section: unknown
      items: unknown
    }>
  }

  assert.equal(typeof selectorModule.getHomepageCollectionSections, 'function')
  const collections = selectorModule.getHomepageCollectionSections?.(portfolioContent) ?? []
  assert.deepEqual(
    collections.map((collection) => collection.kind),
    ['experience', 'projects', 'sideQuests']
  )
  assert.equal('skills' in portfolioContent.sections, false)
  assert.equal('skills' in portfolioContent, false)
  assert.equal(collections[2]?.section, portfolioContent.sections.sideQuests)
  assert.equal(collections[2]?.items, portfolioContent.sideQuests)
})
