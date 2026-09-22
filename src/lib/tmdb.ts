import 'server-only'
import type { Recommendation } from '@/lib/content/portfolio-schema'

type MovieRecommendation = Extract<Recommendation, { kind: 'movie' }>

type TmdbResponse = {
  poster_path?: string | null
  results?: Array<{ poster_path?: string | null }>
}

const posterBaseUrl = 'https://image.tmdb.org/t/p/w500'

export async function getMoviePosterUrls(movies: MovieRecommendation[]): Promise<Record<string, string>> {
  const token = process.env.TMDB_API_READ_ACCESS_TOKEN
  if (!token) return {}

  const entries = await Promise.all(movies.map(async (movie) => {
    const endpoint = movie.tmdbId
      ? `https://api.themoviedb.org/3/movie/${movie.tmdbId}`
      : `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}${movie.year ? `&primary_release_year=${encodeURIComponent(movie.year)}` : ''}`

    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 * 60 * 24 * 30 }
      })
      if (!response.ok) return [movie.id, ''] as const

      const payload = await response.json() as TmdbResponse
      const posterPath = payload.poster_path ?? payload.results?.[0]?.poster_path
      return [movie.id, posterPath ? `${posterBaseUrl}${posterPath}` : ''] as const
    } catch {
      return [movie.id, ''] as const
    }
  }))

  return Object.fromEntries(entries.filter(([, posterUrl]) => posterUrl))
}
