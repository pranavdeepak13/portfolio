'use client'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <html>
      <body className="container-narrow section">
        <div className="card p-8">
          <h1 className="font-display text-2xl mb-2">Ik you want to see my portfolio badly 😔 , please try reloading the page.</h1>
          <button onClick={reset} className="px-4 py-2 rounded bg-accent text-black">Reload</button>
        </div>
      </body>
    </html>
  )
}
