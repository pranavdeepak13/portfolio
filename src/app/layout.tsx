import type { Metadata } from 'next'
import { SystemCopyProvider } from '@/components/SystemCopyProvider'
import { portfolioContent } from '@/lib/content/portfolio'
import './globals.css'

export const metadata: Metadata = {
  title: portfolioContent.site.metadata.title,
  description: portfolioContent.site.metadata.description
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={portfolioContent.site.language} className="dark">
      <body><SystemCopyProvider copy={portfolioContent.interface}>{children}</SystemCopyProvider></body>
    </html>
  )
}
