'use client'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

export interface ParallaxLayers {
  ySlow: MotionValue<number>
  yMedium: MotionValue<number>
  yFast: MotionValue<number>
}
export const useParallax = (): ParallaxLayers => {
  const { scrollY } = useScroll()
  const ySlow = useTransform(scrollY, [0, 800], [0, 40])
  const yMedium = useTransform(scrollY, [0, 800], [0, 80])
  const yFast = useTransform(scrollY, [0, 800], [0, 140])
  return { ySlow, yMedium, yFast }
}
