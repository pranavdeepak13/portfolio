'use client'
import { useEffect } from 'react'
import { useSystemCopy } from '@/components/SystemCopyProvider'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  const copy = useSystemCopy()

  return (
    <div className="container-narrow section">
      <div className="card p-8">
        <h1 className="font-display text-2xl mb-2">{copy.error.title}</h1>
        <button onClick={reset} className="px-4 py-2 rounded bg-accent text-black">{copy.error.reloadLabel}</button>
      </div>
    </div>
  )
}
