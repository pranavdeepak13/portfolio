'use client'
import Section from './Section'
import { skills } from '@/utils/data'
import { motion } from 'framer-motion'
import Tilt from './Tilt'

export default function Skills() {
  return (
    <Section id="skills" title="Languages I Pretend to Master" subtitle="If it compiles, I collect it">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {skills.map((group, gi) => (
          <Tilt key={group.category} max={8} className="h-full">
            <motion.article className="card p-6 h-full min-h-64"
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: gi*0.05 }}>
              <h3 className="font-display text-lg mb-4">{group.category}</h3>
              <ul className="space-y-3">
                {group.items.map((item, i) => (
                  <li key={item.name} className="flex items-center gap-3">
                    <span className="min-w-28 text-sm opacity-80">{item.name}</span>
                    <div className="relative w-full h-2 rounded bg-concrete-200 dark:bg-white/10 overflow-hidden">
                      <motion.div className="absolute inset-y-0 left-0 rounded bg-accent"
                        initial={{ width: 0 }} whileInView={{ width: `${item.level}%` }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.article>
          </Tilt>
        ))}
      </div>
    </Section>
  )
}
