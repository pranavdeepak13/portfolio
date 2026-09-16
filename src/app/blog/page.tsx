import type { Metadata } from 'next'
import BlogIndex from '@/components/BlogIndex'
import SecondaryPageShell from '@/components/SecondaryPageShell'
import { portfolioContent } from '@/lib/content/portfolio'
import { getPublishedPosts } from '@/lib/content/blog'

export const metadata: Metadata = {
  title: `${portfolioContent.sections.writing.metadata.title} · ${portfolioContent.site.name}`,
  description: portfolioContent.sections.writing.metadata.description.replace('{name}', portfolioContent.site.name)
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  const secondaryNavigation = {
    secondary: portfolioContent.navigation.secondary,
    secondaryLabel: portfolioContent.navigation.secondaryLabel
  }
  const secondarySite = {
    name: portfolioContent.site.name,
    footer: portfolioContent.site.footer
  }

  return (
    <SecondaryPageShell active="blog" title={portfolioContent.sections.writing.title} skipToContentLabel={portfolioContent.interface.skipToContentLabel} navigation={secondaryNavigation} site={secondarySite} contact={portfolioContent.contact}>
      <BlogIndex posts={posts} writing={portfolioContent.writing} empty={portfolioContent.sections.writing.empty} />
    </SecondaryPageShell>
  )
}
