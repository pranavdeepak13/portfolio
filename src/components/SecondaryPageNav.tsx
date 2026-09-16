import type { NavigationContent, PortfolioContent } from '@/lib/content/portfolio-schema'

interface SecondaryPageNavProps {
  active: 'blog' | 'recommendations'
  items: NavigationContent['secondary']
  label: NavigationContent['secondaryLabel']
  name: PortfolioContent['site']['name']
}

export default function SecondaryPageNav({ active, items, label, name }: SecondaryPageNavProps) {
  return (
    <header className="secondary-nav-wrap">
      <nav className="secondary-nav" aria-label={label}>
        <a href="/" className="secondary-nav-link interactive-target">← {name}</a>
        {items.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`secondary-nav-link interactive-target ${active === item.id ? 'is-active' : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
