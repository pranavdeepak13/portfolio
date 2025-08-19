'use client'
import { motion, useCycle } from 'framer-motion'

export default function BlueprintGrid() {
  const [on, toggle] = useCycle(false, true)

  return (
    <>
      <button
        aria-label="Toggle blueprint overlay"
        onClick={() => toggle()}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-blueprint text-white px-3 py-2 shadow-soft"
      >
        Grid
      </button>
      <motion.div
        aria-hidden
        className="fixed inset-0 blueprint-overlay z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </>
  )
}