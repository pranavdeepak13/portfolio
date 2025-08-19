'use client'
import Section from './Section'
import Tilt from './Tilt'
import { hobbies } from '@/utils/data'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Hobbies() {
return (
<Section id="hobbies" title="How I Spend My Free Time" subtitle="When I'm not using ChatGPT">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
    {hobbies.map((h, i) => (
        <Tilt key={h.title} max={10} className="h-full">
        <motion.article
            className="card overflow-hidden h-full"
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
        >
            <div className="relative w-full h-24 sm:h-28">
            <Image src={`/${h.src}`} alt={h.alt} fill className="object-cover" />
            </div>
            <div className="p-3">
            <h3 className="font-display text-base mb-1">{h.title}</h3>
            <p className="text-xs opacity-80">{h.blurb}</p>
            </div>
        </motion.article>
        </Tilt>
    ))}
    </div>
</Section>
)
}
