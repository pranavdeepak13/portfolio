'use client'
import { useRef } from 'react'

interface TiltProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
}

export default function Tilt({ children, max = 12, className = '', ...rest }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (py - 0.5) * -2 * max
    const ry = (px - 0.5) * 2 * max
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`
    el.style.setProperty('--mx', String(px))
    el.style.setProperty('--my', String(py))
  }

  function reset() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`relative transition-transform duration-150 ease-out will-change-transform ${className}`}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            'radial-gradient(380px circle at calc(var(--mx,0.5) * 100%) calc(var(--my,0.5) * 100%), rgba(255,255,255,0.16), transparent 42%)',
          mixBlendMode: 'soft-light'
        }}
      />
      {children}
    </div>
  )
}
