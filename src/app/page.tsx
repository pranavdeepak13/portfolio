import Hero from '@/components/Hero'
import About from '@/components/About'
import Timeline from '@/components/Timeline'
import Projects from '@/components/Projects'
import Misc from '@/components/Misc'
import RecommendationsPreview from '@/components/RecommendationsPreview'
import Hobbies from '@/components/Hobbies'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import ContactSticky from '@/components/ContactSticky'
import WritingPreview from '@/components/WritingPreview'
import { portfolioContent } from '@/lib/content/portfolio'
import {
  getHomepageCollectionSections,
  type HomepageCollectionSection
} from '@/lib/content/portfolio-selectors'

function renderHomepageCollection(collection: HomepageCollectionSection) {
  switch (collection.kind) {
    case 'experience':
      return <Timeline key={collection.kind} section={collection.section} items={collection.items} />
    case 'projects':
      return <Projects key={collection.kind} section={collection.section} items={collection.items} />
    case 'sideQuests':
      return <Misc key={collection.kind} section={collection.section} items={collection.items} />
  }
}

export default function HomePage() {
  const homepageCollections = getHomepageCollectionSections(portfolioContent)
  const heroIdentity = {
    name: portfolioContent.site.name,
    mark: portfolioContent.site.mark,
    role: portfolioContent.site.role
  }
  const headerNavigation = {
    primary: portfolioContent.navigation.primary,
    primaryLabel: portfolioContent.navigation.primaryLabel,
    mobileLabel: portfolioContent.navigation.mobileLabel,
    menuOpenLabel: portfolioContent.navigation.menuOpenLabel,
    menuCloseLabel: portfolioContent.navigation.menuCloseLabel,
    menuLabel: portfolioContent.navigation.menuLabel,
    backToTopLabel: portfolioContent.navigation.backToTopLabel
  }

  return (
    <>
      <a href="#main" className="skip-link">{portfolioContent.interface.skipToContentLabel}</a>
      <SiteHeader mark={portfolioContent.site.mark} resume={portfolioContent.site.resume} navigation={headerNavigation} />
      <main id="main">
        <Hero identity={heroIdentity} hero={portfolioContent.hero} />
        <About content={portfolioContent.about} socials={portfolioContent.site.socials} socialsLabel={portfolioContent.site.socialsLabel} />
        {homepageCollections.map(renderHomepageCollection)}
        <WritingPreview section={portfolioContent.sections.writing} />
        <RecommendationsPreview section={portfolioContent.sections.recommendations} content={portfolioContent.recommendations} />
        <Hobbies section={portfolioContent.sections.hobbies} items={portfolioContent.hobbies} />
      </main>
      <SiteFooter footer={portfolioContent.site.footer} name={portfolioContent.site.name} />
      <ContactSticky content={portfolioContent.contact} />
    </>
  )
}
