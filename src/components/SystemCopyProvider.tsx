'use client'

import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import type { PortfolioContent } from '@/lib/content/portfolio-schema'

type SystemCopy = PortfolioContent['interface']

const SystemCopyContext = createContext<SystemCopy | null>(null)

export function SystemCopyProvider({ copy, children }: { copy: SystemCopy; children: ReactNode }) {
  return <SystemCopyContext.Provider value={copy}>{children}</SystemCopyContext.Provider>
}

export function useSystemCopy() {
  const copy = useContext(SystemCopyContext)
  if (!copy) throw new Error('SystemCopyProvider is missing.')
  return copy
}
