'use client'
import { motion } from 'framer-motion'
import { useSystemCopy } from '@/components/SystemCopyProvider'

export default function Loading() {
  const copy = useSystemCopy()

  return (
    <div className="container-narrow section">
      <div className="card p-6 flex items-center gap-6">
        <motion.div className="h-24 w-3 bg-concrete-200 dark:bg-concrete-800"
          initial={{ scaleY: 0.8 }} animate={{ scaleY: 1 }} transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1.6 }} />
        <motion.div className="h-2 w-40 bg-concrete-200 dark:bg-concrete-800"
          initial={{ x: -12 }} animate={{ x: 12 }} transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1.6 }} />
        <motion.div className="relative h-24 w-24">
          <motion.div className="absolute left-1/2 -translate-x-1/2 top-0 h-10 w-[2px] bg-concrete-200 dark:bg-concrete-800"
            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} />
          <motion.div className="absolute left-1/2 -translate-x-1/2 top-10 h-6 w-6 bg-accent rounded-sm shadow"
            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} />
        </motion.div>
        <div>
          <p className="font-display text-lg">{copy.loading.title}</p>
          <p className="font-dots text-sm opacity-80">{copy.loading.detail}</p>
        </div>
      </div>
    </div>
  )
}
