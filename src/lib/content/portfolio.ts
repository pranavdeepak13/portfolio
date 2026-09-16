import 'server-only'
import rawPortfolio from '@/content/portfolio.json'
import { resolvePortfolioContent } from '@/lib/content/portfolio-schema'

export const portfolioContent = resolvePortfolioContent(rawPortfolio, {
  NEXT_PUBLIC_RESUME_URL: process.env.NEXT_PUBLIC_RESUME_URL,
  NEXT_PUBLIC_RESUME_SHEET_URL: process.env.NEXT_PUBLIC_RESUME_SHEET_URL
})

export type * from '@/lib/content/portfolio-schema'
