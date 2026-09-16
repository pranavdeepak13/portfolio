import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogArticle from '@/components/BlogArticle'
import SecondaryPageShell from '@/components/SecondaryPageShell'
import { portfolioContent } from '@/lib/content/portfolio'
import { getPostBySlug, getPublishedSlugs } from '@/lib/content/blog'

interface BlogArticlePageProps {
  params: { slug: string }
}

export const dynamicParams = false

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return { title: `${portfolioContent.writing.notFoundTitle} · ${portfolioContent.site.name}` }

  return {
    title: `${post.title} · ${portfolioContent.site.name}`,
    description: post.description
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()
  const secondaryNavigation = {
    secondary: portfolioContent.navigation.secondary,
    secondaryLabel: portfolioContent.navigation.secondaryLabel
  }
  const secondarySite = {
    name: portfolioContent.site.name,
    footer: portfolioContent.site.footer
  }

  return (
    <SecondaryPageShell active="blog" skipToContentLabel={portfolioContent.interface.skipToContentLabel} navigation={secondaryNavigation} site={secondarySite} contact={portfolioContent.contact}>
      <BlogArticle post={post} writing={portfolioContent.writing} />
    </SecondaryPageShell>
  )
}
