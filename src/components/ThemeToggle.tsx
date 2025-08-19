'use client'
import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button aria-label="Toggle dark mode" onClick={toggle}
      className="rounded-full border border-concrete-200 dark:border-white/20 p-2 focus:outline-none">
      {/* simple geometric sun/moon */}
      <svg width="22" height="22" viewBox="0 0 24 24" role="img" aria-hidden="true">
        {theme === 'dark'
          ? <path d="M12 2a1 1 0 0 1 1 1v2l3.46-2a1 1 0 0 1 1.08 1.68L14 6.3V10a2 2 0 0 1-2 2H6.3l-1.62 3.54A1 1 0 0 1 3 16.92L5 13.46V10a8 8 0 1 0 7-8Z" fill="currentColor" />
          : <path d="M12 4a8 8 0 1 0 8 8 6 6 0 0 1-8-8Z" fill="currentColor" />}
      </svg>
    </button>
  )
}
