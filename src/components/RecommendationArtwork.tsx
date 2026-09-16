import Image from 'next/image'
import type { GradientToken } from '@/lib/content/portfolio-schema'

interface RecommendationArtworkProps {
  image?: string | null
  alt: string
  gradient: GradientToken
  className?: string
  sizes?: string
}

export default function RecommendationArtwork({
  image,
  alt,
  gradient,
  className = '',
  sizes = '(min-width: 768px) 190px, 42vw'
}: RecommendationArtworkProps) {
  const classes = `recommendation-artwork ${className}`.trim()

  if (!image) {
    return (
      <div
        className={`${classes} recommendation-gradient recommendation-gradient-${gradient}`}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className={classes}>
      <Image src={image} alt={alt} fill sizes={sizes} className="recommendation-artwork-image" />
    </div>
  )
}
