interface RateLimiterOptions {
  limit: number
  windowMs: number
}

interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

interface Bucket {
  count: number
  resetAt: number
}

export function createRateLimiter({ limit, windowMs }: RateLimiterOptions) {
  const buckets = new Map<string, Bucket>()

  return {
    check(key: string, now = Date.now()): RateLimitResult {
      const existing = buckets.get(key)

      if (!existing || now >= existing.resetAt) {
        buckets.set(key, { count: 1, resetAt: now + windowMs })
        return { allowed: true, retryAfterSeconds: Math.ceil(windowMs / 1000) }
      }

      if (existing.count >= limit) {
        return {
          allowed: false,
          retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
        }
      }

      existing.count += 1
      return {
        allowed: true,
        retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
      }
    }
  }
}

export const contactRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 15 * 60 * 1000
})
