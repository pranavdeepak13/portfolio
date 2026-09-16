import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parsePortfolioContent } from '../src/lib/content/portfolio-schema.ts'

const rawPortfolio = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src/content/portfolio.json'), 'utf8')
)

test('the production portfolio document is valid', () => {
  const content = parsePortfolioContent(rawPortfolio)
  assert.equal(content.site.name, 'Pranav Deepak')
  assert.equal(content.hero.markLabel, 'PD')
  assert.deepEqual(content.interface, {
    skipToContentLabel: 'Skip to content',
    loading: {
      title: 'Under construction…',
      detail: 'assembling components'
    },
    error: {
      title: 'Ik you want to see my portfolio badly 😔 , please try reloading the page.',
      reloadLabel: 'Reload'
    }
  })
  assert.equal('notFoundTitle' in content.site.metadata, false)
  assert.equal(content.projects.length > 0, true)
  assert.equal(content.recommendations.items.length > 0, true)
  assert.equal('skills' in content.sections, false)
  assert.equal('skills' in content, false)
})

const clone = () => structuredClone(rawPortfolio) as any

function issuePaths(action: () => unknown) {
  try {
    action()
  } catch (error) {
    return (error as { issues?: Array<{ path: Array<string | number> }> }).issues?.map((issue) => issue.path.join('.')) ?? []
  }
  return []
}

test('unsafe URLs and image paths are rejected with field paths', () => {
  const content = clone()
  content.projects[0].links.repo = '#'
  content.hobbies[0].src = 'https://example.com/photo.jpg'
  assert.throws(() => parsePortfolioContent(content), /projects|hobbies/)
})

test('local image paths are restricted to the public images directory', () => {
  const content = clone()
  content.about.portrait.src = '/assets/profile.jpg'

  assert.deepEqual(issuePaths(() => parsePortfolioContent(content)), ['about.portrait.src'])
})

test('every production content image resolves to an existing public asset', () => {
  const content = parsePortfolioContent(rawPortfolio)
  const images = [
    content.about.portrait.src,
    ...content.hobbies.map((item) => item.src),
    ...content.recommendations.items.flatMap((item) => item.image ? [item.image] : [])
  ]

  for (const image of images) {
    assert.equal(existsSync(path.join(process.cwd(), 'public', image.slice(1))), true, image)
  }
})

test('duplicate stable identifiers are rejected', () => {
  const content = clone()
  content.projects[1].slug = content.projects[0].slug
  assert.throws(() => parsePortfolioContent(content), /projects/)
})

test('duplicate secondary navigation ids report both exact id paths', () => {
  const content = clone()
  content.navigation.secondary[1].id = content.navigation.secondary[0].id

  assert.deepEqual(
    issuePaths(() => parsePortfolioContent(content)),
    ['navigation.secondary.0.id', 'navigation.secondary.1.id']
  )
})

test('effective resume overrides are validated and honor primary then legacy precedence', async () => {
  const modulePath = '../src/lib/content/portfolio-schema.ts'
  const resolverModule = await import(modulePath).catch(() => null) as null | {
    resolvePortfolioContent: (
      input: unknown,
      environment: { NEXT_PUBLIC_RESUME_URL?: string; NEXT_PUBLIC_RESUME_SHEET_URL?: string }
    ) => ReturnType<typeof parsePortfolioContent>
  }

  assert.notEqual(resolverModule, null)
  assert.equal(typeof resolverModule?.resolvePortfolioContent, 'function')
  if (!resolverModule) return

  const primaryUrl = 'https://example.com/primary-resume'
  const legacyUrl = 'https://example.com/legacy-resume'
  assert.equal(
    resolverModule.resolvePortfolioContent(clone(), {
      NEXT_PUBLIC_RESUME_URL: primaryUrl,
      NEXT_PUBLIC_RESUME_SHEET_URL: legacyUrl
    }).site.resume.fallbackUrl,
    primaryUrl
  )
  assert.equal(
    resolverModule.resolvePortfolioContent(clone(), {
      NEXT_PUBLIC_RESUME_SHEET_URL: legacyUrl
    }).site.resume.fallbackUrl,
    legacyUrl
  )
  assert.equal(
    resolverModule.resolvePortfolioContent(clone(), {}).site.resume.fallbackUrl,
    rawPortfolio.site.resume.fallbackUrl
  )
  assert.throws(
    () => resolverModule.resolvePortfolioContent(clone(), { NEXT_PUBLIC_RESUME_URL: 'not-a-url' }),
    /site|resume|fallbackUrl/
  )
})

test('bounded fields reject invalid display configuration', () => {
  const content = clone()
  content.hobbies[0].objectPosition = 'middle'
  content.recommendations.items[0].gradient = 'unknown'
  assert.throws(() => parsePortfolioContent(content), /hobbies|recommendations/)
})
