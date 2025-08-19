import type { Metadata } from 'next'
import './globals.css'
import { Raleway, Raleway_Dots, Orbitron } from 'next/font/google'
import BlueprintBackground from '@/components/BlueprintBackground'
import { ThemeToggle } from '@/components/ThemeToggle'
import ContactSticky from '@/components/ContactSticky'
import { jsonLdOrganization } from '@/utils/seo'
import SplashGate from '@/components/SplashGate'
import InfoBadge from '@/components/InfoBadge'

const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' })
const ralewayDots = Raleway_Dots({ subsets: ['latin'], weight: '400', variable: '--font-raleway-dots' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', weight: ['400','600','700'] })

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'A portfolio made with Next.js and Tailwind CSS.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }} />
      </head>
      <body className={`${raleway.variable} ${ralewayDots.variable} ${orbitron.variable} font-body`}>
        <SplashGate />
        <BlueprintBackground />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 bg-accent text-black px-3 py-2 rounded">Skip to content</a>

        <header className="container-narrow py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <InfoBadge />
            <div className="flex items-baseline gap-4">
              <span className="font-gimmick tracking-widest text-sm opacity-70">PORTFOLIO</span>
              <nav aria-label="Primary">
                <ul className="hidden sm:flex gap-5 text-sm">
                  <li><a href="#about">About</a></li>
                  <li><a href="#experience">Timeline</a></li>
                  <li><a href="#projects">Projects</a></li>
                  <li><a href="#skills">Skills</a></li>
                  <li><a href="#hobbies">Hobbies</a></li>
                  <li><a href="#misc">Misc</a></li>
                </ul>
              </nav>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <main id="main">{children}</main>

        <footer className="container-narrow py-8 text-center border-t border-black/10 dark:border-white/10">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">
            © {new Date().getFullYear()} · Made with <span role="img" aria-label="love">❤️</span> by Pd · All rights reserved
          </p>
        </footer>

        <ContactSticky />
      </body>
    </html>
  )
}
