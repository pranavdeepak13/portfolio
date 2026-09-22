import type { PortfolioContent, Recommendation } from '@/lib/content/portfolio-schema'

export function formatFooter(template: string, name: string, year: number) {
  return template
    .replaceAll('{year}', String(year))
    .replaceAll('{name}', name)
}

export type HomepageCollectionSection =
  | {
      kind: 'experience'
      section: PortfolioContent['sections']['experience']
      items: PortfolioContent['experience']
    }
  | {
      kind: 'projects'
      section: PortfolioContent['sections']['projects']
      items: PortfolioContent['projects']
    }
  | {
      kind: 'sideQuests'
      section: PortfolioContent['sections']['sideQuests']
      items: PortfolioContent['sideQuests']
    }

export function getHomepageCollectionSections(content: PortfolioContent): HomepageCollectionSection[] {
  return [
    { kind: 'experience', section: content.sections.experience, items: content.experience },
    { kind: 'projects', section: content.sections.projects, items: content.projects },
    { kind: 'sideQuests', section: content.sections.sideQuests, items: content.sideQuests }
  ]
}

export function getRecommendationPreview(content: PortfolioContent) {
  return content.recommendations.items.slice(0, content.recommendations.previewLimit)
}

export function getRecommendationGroups(content: PortfolioContent) {
  const items = content.recommendations.items
  return {
    books: items.filter((item): item is Extract<Recommendation, { kind: 'book' }> => item.kind === 'book'),
    movies: items.filter((item): item is Extract<Recommendation, { kind: 'movie' }> => item.kind === 'movie'),
    videos: items.filter((item): item is Extract<Recommendation, { kind: 'video' }> => item.kind === 'video'),
    articles: items.filter((item): item is Extract<Recommendation, { kind: 'article' }> => item.kind === 'article')
  }
}
