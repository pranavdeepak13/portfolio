'use client'

export default function BlueprintBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(0deg, var(--line), var(--line) 1px, transparent 1px, transparent 120px), repeating-linear-gradient(90deg, var(--line), var(--line) 1px, transparent 1px, transparent 120px)',
          opacity: 0.22,
          filter: 'blur(2px)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15 dark:to-black/25" />
    </div>
  )
}
