'use client'
import Image from 'next/image'
import Section from './Section'
import { motion } from 'framer-motion'

export default function About() {
return (
<Section id="about" title="Me Introducing Myself" subtitle="How I went from debugging code to debugging life choices">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="md:col-span-1 card h-full min-h-[14rem] flex items-center justify-center overflow-hidden rounded-2xl"
    >
        <Image
        src="/images/about/profile.jpg"
        alt="Portrait of Pd"
        width={180}
        height={240}
        className="h-48 w-36 md:h-56 md:w-40 object-cover rounded-xl"
        priority={false}
        />
    </motion.div>

    <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="md:col-span-2 card p-6 h-full min-h-[14rem] flex flex-col justify-center"
    >
        <p className="mb-2">
        I&apos;m a Business Analyst at Flipkart who codes (slightly addicted to automation) and convinced that
        every manual process is just a script waiting to happen.
        </p>
        <p className="mb-2">
        When I&apos;m not optimizing for better CTR or building dashboards that actually work, I&apos;m probably tinkering with
        LLMs or wondering if my next side project needs another microservice.
        </p>
        <p className="mb-2">
        From React frontends to BigQuery pipelines, I believe the best solutions are the ones that make you forget
        the problem ever existed. Currently exploring how AI can be leveraged to solve my day-to-day problems.
        </p>
    </motion.div>
    </div>
</Section>
)
}
