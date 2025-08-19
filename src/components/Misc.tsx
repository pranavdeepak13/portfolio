'use client'
import Section from './Section'
import Tilt from './Tilt'
import { miscItems } from '@/utils/data'
import { motion } from 'framer-motion'

export default function Misc() {
return (
<Section id="misc" title="Plot Twists & Side Quests" subtitle="When work gets boring">
    <div className="space-y-6">
    {miscItems.map((item, i) => (
        <Tilt key={item.slug} max={8}>
        <motion.article
            className="card p-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
        >
            <div className="min-w-0 sm:max-w-[48%]">
            <h3 className="font-display text-xl truncate">{item.title}</h3>
            <p className="text-sm opacity-75 truncate">{item.subtitle}</p>
            </div>
            <div className="flex-1 min-w-0">
            <p className="opacity-90 text-sm">{item.details}</p>
            {item.links?.length ? (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                {item.links.map(l => (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="no-underline text-sm underline-offset-4 hover:underline">
                    {l.label}
                    </a>
                ))}
                </div>
            ) : null}
            </div>
        </motion.article>
        </Tilt>
    ))}
    </div>
</Section>
)
}
