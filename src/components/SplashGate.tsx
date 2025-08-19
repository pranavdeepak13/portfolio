'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SplashGate() {
const [visible, setVisible] = useState(true)
const unlockTimer = useRef<number | null>(null)

function lockScroll(lock: boolean) {
const html = document.documentElement
const body = document.body
if (lock) {
    html.classList.add('splash-lock')
    body.classList.add('splash-lock')
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    html.style.height = '100vh'
    body.style.height = '100vh'
} else {
    html.classList.remove('splash-lock')
    body.classList.remove('splash-lock')
    html.style.overflow = ''
    body.style.overflow = ''
    html.style.height = ''
    body.style.height = ''
}
}

function forceUnlock() {
lockScroll(false)
requestAnimationFrame(() => lockScroll(false))
setTimeout(() => lockScroll(false), 0)
}

useEffect(() => {
lockScroll(true)
const t = window.setTimeout(() => setVisible(false), 3000)
const safety = window.setTimeout(forceUnlock, 3200)
unlockTimer.current = safety
return () => {
    window.clearTimeout(t)
    window.clearTimeout(safety)
    forceUnlock()
}
}, [])

useEffect(() => {
if (!visible) {
    forceUnlock()
    if (unlockTimer.current) window.clearTimeout(unlockTimer.current)
}
}, [visible])

const blocks = useMemo(() => {
type B = { id: string; c: number; r: number; delay: number; color: 'light' | 'accent' }
const seq: B[] = []
let d = 0
seq.push({ id: 'b1', c: 2, r: 6, delay: (d += 0.08), color: 'light' })
seq.push({ id: 'b2', c: 3, r: 6, delay: (d += 0.08), color: 'accent' })
seq.push({ id: 'b3', c: 4, r: 6, delay: (d += 0.08), color: 'light' })
seq.push({ id: 'b4', c: 3, r: 5, delay: (d += 0.1), color: 'light' })
seq.push({ id: 'b5', c: 4, r: 5, delay: (d += 0.1), color: 'accent' })
seq.push({ id: 'b6', c: 3, r: 4, delay: (d += 0.12), color: 'light' })
return seq
}, [])

return (
<AnimatePresence mode="wait" onExitComplete={forceUnlock}>
    {visible && (
    <motion.div
        key="splash"
        className="fixed inset-0 z-[999999] bg-white dark:bg-black flex items-start justify-center pt-[max(env(safe-area-inset-top),1.5rem)]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        aria-live="polite"
        role="status"
    >
        <div className="w-[560px] max-w-[92vw]">
        <motion.svg viewBox="0 0 320 192" width="100%" height="100%" className="text-black dark:text-white">
            <motion.line x1="20" y1="160" x2="300" y2="160" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
            <motion.rect
            x="20" y="20" width="280" height="140" rx="6" fill="url(#sweep)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            {blocks.map((b) => {
            const cell = 20
            const bw = 36
            const bh = 28
            const x = 20 + b.c * cell
            const yFinal = 20 + b.r * cell
            const yStart = 190
            const fill = b.color === 'accent' ? '#b9924b' : 'currentColor'
            const opacity = b.color === 'accent' ? 0.9 : 0.85
            return (
                <motion.rect
                key={b.id}
                x={x}
                y={yFinal}
                width={bw}
                height={bh}
                rx="2"
                fill={fill}
                fillOpacity={opacity}
                initial={{ y: yStart, opacity: 0, scale: 0.95 }}
                animate={{ y: yFinal, opacity: 1, scale: 1 }}
                transition={{ delay: b.delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
            )
            })}
            <motion.path
            d="M 100 160 L 100 128 L 136 128 L 136 108 L 172 108 L 172 80 L 208 80 L 208 160 Z"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.6"
            strokeWidth="2"
            strokeDasharray="400"
            initial={{ strokeDashoffset: 400 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ delay: 1.1, duration: 1.2, ease: 'easeInOut' }}
            />
            <motion.rect
            x="100" y="80" width="108" height="80" rx="2" fill="url(#glint)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ delay: 2.0, duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {[0,1,2,3,4].map((i) => (
            <motion.circle
                key={i}
                cx={120 + i * 28}
                cy={160}
                r="2"
                fill="currentColor"
                initial={{ opacity: 0, cy: 160 }}
                animate={{ opacity: [0, 0.6, 0], cy: [160, 140, 130] }}
                transition={{ delay: 0.6 + i * 0.15, duration: 1.8, repeat: Infinity }}
            />
            ))}
            <defs>
            <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.07" />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="glint" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#b9924b" stopOpacity="0" />
                <stop offset="50%" stopColor="#b9924b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#b9924b" stopOpacity="0" />
            </linearGradient>
            </defs>
        </motion.svg>
        <div className="mt-3 flex items-center justify-between">
            <div className="h-1 w-28 bg-gradient-to-r from-[#b9924b] via-[#6ccff6] to-[#f66cb1] rounded" />
            <div className="text-right">
            <p className="font-display text-base">Assembling interface…</p>
            <p className="font-dots text-xs opacity-70">foundations • frame • facade</p>
            </div>
        </div>
        </div>
    </motion.div>
    )}
</AnimatePresence>
)
}
