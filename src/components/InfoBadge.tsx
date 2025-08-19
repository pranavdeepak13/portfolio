'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function InfoBadge() {
const [hovered, setHovered] = useState(false)
const [updated, setUpdated] = useState('—')

useEffect(() => {
try {
    const dt = new Date(document.lastModified)
    const fmt = new Intl.DateTimeFormat(navigator.language, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    setUpdated(fmt.format(dt))
} catch {
    setUpdated('Recently')
}
}, [])

return (
<div className="relative">
    <motion.button
    aria-label="Information"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onFocus={() => setHovered(true)}
    onBlur={() => setHovered(false)}
    className="h-7 w-7 rounded-full border border-black/10 dark:border-white/20 text-xs flex items-center justify-center select-none bg-white/70 dark:bg-neutral-900/70 backdrop-blur"
    whileHover={{ scale: 1.08 }}
    whileFocus={{ scale: 1.08 }}
    transition={{ type: 'spring', stiffness: 320, damping: 18, mass: 0.4 }}
    >
    i
    </motion.button>

    <motion.div
    role="tooltip"
    initial={false}
    animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.96, y: hovered ? 0 : -6 }}
    transition={{ duration: 0.14, ease: 'easeOut' }}
    className="pointer-events-none absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md px-2.5 py-1 text-xs shadow-soft border bg-black/85 text-white border-black/20 dark:bg-white/10 dark:text-white dark:border-white/15 backdrop-blur"
    >
    Last updated: {updated}
    </motion.div>
</div>
)
}
