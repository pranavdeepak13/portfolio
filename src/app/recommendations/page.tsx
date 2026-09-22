import type { Metadata } from 'next'
import Recommendations from '@/components/Recommendations'
import SecondaryPageShell from '@/components/SecondaryPageShell'
import { portfolioContent } from '@/lib/content/portfolio'
import { getRecommendationGroups } from '@/lib/content/portfolio-selectors'
import { getMoviePosterUrls } from '@/lib/tmdb'

export const metadata: Metadata = {
  title: `${portfolioContent.sections.recommendations.title} · ${portfolioContent.site.name}`
}

export default async function RecommendationsPage() {
  const groups = getRecommendationGroups(portfolioContent)
  const posterUrls = await getMoviePosterUrls(groups.movies)
  const secondaryNavigation = {
    secondary: portfolioContent.navigation.secondary,
    secondaryLabel: portfolioContent.navigation.secondaryLabel
  }
  const secondarySite = {
    name: portfolioContent.site.name,
    footer: portfolioContent.site.footer
  }

  return (
    <SecondaryPageShell
      active="recommendations"
      title={portfolioContent.sections.recommendations.title}
      skipToContentLabel={portfolioContent.interface.skipToContentLabel}
      navigation={secondaryNavigation}
      site={secondarySite}
      contact={portfolioContent.contact}
    >
      <Recommendations groups={groups} content={portfolioContent.recommendations} posterUrls={posterUrls} />
    </SecondaryPageShell>
  )
}
