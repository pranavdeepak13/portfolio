import type { PortfolioContent } from '@/lib/content/portfolio-schema'
import { formatFooter } from '@/lib/content/portfolio-selectors'

interface SiteFooterProps {
  footer: PortfolioContent['site']['footer']
  name: PortfolioContent['site']['name']
}

export default function SiteFooter({ footer, name }: SiteFooterProps) {
  return (
    <footer className="container-narrow pb-8 pt-20">
      <div className="border-t border-white/10 pt-6 text-sm text-white/55">
        <p>{formatFooter(footer, name, new Date().getFullYear())}</p>
      </div>
    </footer>
  )
}
