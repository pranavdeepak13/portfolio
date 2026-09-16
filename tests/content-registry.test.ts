import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { parsePortfolioContent } from '../src/lib/content/portfolio-schema.ts'
import {
  getRecommendationGroups,
  getRecommendationPreview
} from '../src/lib/content/portfolio-selectors.ts'

const portfolioContent = parsePortfolioContent(JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/content/portfolio.json'), 'utf8')
))
const { experience, projects, sideQuests, hobbies, recommendations } = portfolioContent

test('top navigation exposes Blog but omits recommendations and hobbies', () => {
  const labels = portfolioContent.navigation.primary.map((item) => item.label)

  assert.equal(labels.includes('Blog'), true)
  assert.equal(labels.includes('Recommendations'), false)
  assert.equal(labels.includes('Hobbies'), false)
})

test('side quests and hobby focal points are data driven', () => {
  assert.equal(portfolioContent.sections.sideQuests.title, 'Side Quests')
  assert.equal(portfolioContent.about.portrait.src, '/images/about/profile.jpg')
  assert.deepEqual(
    portfolioContent.about.actions.map((action) => action.href),
    ['/#projects', '/blog']
  )
  assert.equal(sideQuests.length > 0, true)
  assert.equal(hobbies.every((item) => /^\d+% \d+%$/.test(item.objectPosition)), true)
})

test('recommendation records have stable ids and safe optional links', () => {
  const groups = getRecommendationGroups(portfolioContent)
  const preview = getRecommendationPreview(portfolioContent)

  assert.equal(new Set(recommendations.items.map((item) => item.id)).size, recommendations.items.length)
  assert.equal(
    recommendations.items.every((item) => !item.href || item.href.startsWith('https://')),
    true
  )
  assert.equal(
    groups.books.length + groups.movies.length + groups.videos.length + groups.articles.length,
    recommendations.items.length
  )
  assert.equal(preview.length, Math.min(recommendations.previewLimit, recommendations.items.length))
  assert.deepEqual(
    preview.map((item) => item.id),
    recommendations.items.slice(0, recommendations.previewLimit).map((item) => item.id)
  )
})

test('editorial recommendations preserve interleaved article and video order', () => {
  const content = structuredClone(portfolioContent)
  content.recommendations.items = [
    { id: 'first-video', kind: 'video', title: 'First video', gradient: 'cobalt' },
    { id: 'first-article', kind: 'article', title: 'First article', gradient: 'orchid' },
    { id: 'second-video', kind: 'video', title: 'Second video', gradient: 'aurora' },
    { id: 'second-article', kind: 'article', title: 'Second article', gradient: 'citrus' }
  ]

  const groups = getRecommendationGroups(content)

  assert.deepEqual(
    groups.editorial.map((item) => item.id),
    content.recommendations.items.map((item) => item.id)
  )
})

test('all named gradient tokens are supported', () => {
  assert.equal(
    recommendations.items.every((item) => ['aurora', 'sunset', 'cobalt', 'orchid', 'citrus'].includes(item.gradient)),
    true
  )
})
