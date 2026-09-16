'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { NavigationContent, PortfolioContent } from '@/lib/content/portfolio-schema'

interface SiteHeaderProps {
  mark: PortfolioContent['site']['mark']
  resume: PortfolioContent['site']['resume']
  navigation: Pick<NavigationContent, 'primary' | 'primaryLabel' | 'mobileLabel' | 'menuOpenLabel' | 'menuCloseLabel' | 'menuLabel' | 'backToTopLabel'>
}

export default function SiteHeader({ mark, resume, navigation }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div className="site-nav-shell">
        <a
          href="/#hero"
          className="site-nav-brand interactive-target"
          aria-label={navigation.backToTopLabel}
          onClick={closeMenu}
        >
          {mark}
        </a>

        <nav className="hidden items-center lg:flex" aria-label={navigation.primaryLabel}>
          <ul className="flex items-center">
            {navigation.primary.map((item) => (
              <li key={item.href}>
                <a className="site-nav-link interactive-target" href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a
          className="site-nav-resume interactive-target hidden lg:inline-flex"
          href={resume.fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {resume.label}
          <span aria-hidden>↗</span>
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          className="site-nav-menu-button interactive-target lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? navigation.menuCloseLabel : navigation.menuOpenLabel}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden>{menuOpen ? '×' : navigation.menuLabel}</span>
        </button>

        <nav
          id={menuId}
          aria-label={navigation.mobileLabel}
          className="site-mobile-menu lg:hidden"
          hidden={!menuOpen}
        >
          <ul>
            {navigation.primary.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={resume.fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                {resume.label} <span aria-hidden>↗</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
