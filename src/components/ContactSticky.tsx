'use client'
import { z } from 'zod'
import { useState } from 'react'

const Schema = z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(5) })

export default function ContactSticky() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle'|'ok'|'err'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = { name: String(fd.get('name')||''), email: String(fd.get('email')||''), message: String(fd.get('message')||'') }
    const v = Schema.safeParse(payload)
    if (!v.success) return alert('Please fill all fields correctly.')
    try {
      setLoading(true)
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      setStatus('ok'); (e.target as HTMLFormElement).reset()
    } catch { setStatus('err') } finally { setLoading(false) }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button onClick={()=>setOpen(o=>!o)} className="rounded-lg bg-accent text-black px-3 py-2 shadow-soft">
        {open ? 'Close' : 'Contact'}
      </button>
      {open && (
        <div className="mt-2 w-72 rounded-xl shadow-soft bg-white/80 dark:bg-concrete-800/70 backdrop-blur p-3 text-sm">
          <p className="font-dots mb-2">leave a note</p>
          <form onSubmit={onSubmit} className="space-y-2">
            <input name="name" placeholder="Name" className="w-full rounded border border-concrete-200 dark:border-white/20 bg-transparent px-2 py-1" />
            <input name="email" type="email" placeholder="Email" className="w-full rounded border border-concrete-200 dark:border-white/20 bg-transparent px-2 py-1" />
            <textarea name="message" rows={3} placeholder="Message" className="w-full rounded border border-concrete-200 dark:border-white/20 bg-transparent px-2 py-1" />
            <button disabled={loading} className="w-full rounded bg-accent text-black py-1.5">{loading ? 'Sending…' : 'Send'}</button>
          </form>
          {status==='ok' && <p className="mt-2 text-green-700">Sent!</p>}
          {status==='err' && <p className="mt-2 text-red-600">Error. Try again.</p>}
        </div>
      )}
    </div>
  )
}
