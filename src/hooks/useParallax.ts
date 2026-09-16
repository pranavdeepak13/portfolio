'use client'
import { RefObject } from 'react'
import { MotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'

export interface ParallaxLayers {
  ySlow: MotionValue<number>
  yMedium: MotionValue<number>
  yFast: MotionValue<number>
  cueOpacity: MotionValue<number>
}

export const useParallax = (target: RefObject<HTMLElement>): ParallaxLayers => {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target,
    offset: ['start start', 'end start']
  })

  const ySlow = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -56])
  const yMedium = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -132])
  const yFast = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -232])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0])

  return { ySlow, yMedium, yFast, cueOpacity }
}
