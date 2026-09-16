import type { ReactNode } from 'react'
import ContactSticky from '@/components/ContactSticky'
import SecondaryPageNav from '@/components/SecondaryPageNav'
import SiteFooter from '@/components/SiteFooter'
import type { NavigationContent, PortfolioContent } from '@/lib/content/portfolio-schema'

interface SecondaryPageShellProps {
  active: 'blog' | 'recommendations'
  title?: string
  intro?: string
  skipToContentLabel: PortfolioContent['interface']['skipToContentLabel']
  navigation: Pick<NavigationContent, 'secondary' | 'secondaryLabel'>
  site: Pick<PortfolioContent['site'], 'name' | 'footer'>
  contact: PortfolioContent['contact']
  children: ReactNode
}

export default function SecondaryPageShell({ active, title, intro, skipToContentLabel, navigation, site, contact, children }: SecondaryPageShellProps) {
  return (
    <>
      <a href="#main" className="skip-link">{skipToContentLabel}</a>
      <SecondaryPageNav active={active} items={navigation.secondary} label={navigation.secondaryLabel} name={site.name} />
      <main id="main" className={`secondary-page secondary-page-${active}`}>
        {title && (
          <header className="secondary-page-intro">
            <h1>{title}</h1>
            {intro && <p>{intro}</p>}
          </header>
        )}
        {children}
      </main>
      <SiteFooter footer={site.footer} name={site.name} />
      <ContactSticky content={contact} />
    </>
  )
}
