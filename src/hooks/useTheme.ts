'use client'
import { useEffect, useState } from 'react'
type Theme = 'light' | 'dark'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light')
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme | null) : null
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle('dark', stored === 'dark'); return
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])
  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
  return { theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }
}
