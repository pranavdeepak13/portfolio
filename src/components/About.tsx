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
        I&apos;m currently working as a Business Analyst at Flipkart and convinced that
        every gruntwork done is just a script waiting to be coded (slightly addicted to automation).
        </p>
        <p className="mb-2">
        When I&apos;m not cohortizing customers or drafting strategies for improving customer engagement, I&apos;m probably working with
        ML models or contemplating if my next side project needs another complete do over.
        </p>
        <p className="mb-2">
        From Boring Gsheet Dashboards to Graph Neural Networks,I believe that the working solution is not always the complex one.
        Currently exploring how AI can be leveraged to solve my day-to-day problems like doing laundry and deciding what to cook 🤣.
        </p>
    </motion.div>
    </div>
</Section>
)
}
