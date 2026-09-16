import RecommendationArtwork from '@/components/RecommendationArtwork'
import type { PortfolioContent, Recommendation } from '@/lib/content/portfolio-schema'

type MovieRecommendation = Extract<Recommendation, { kind: 'movie' }>

interface MovieLibraryProps {
  movies: MovieRecommendation[]
  labels: Pick<PortfolioContent['recommendations'], 'filmsTitle' | 'letterboxd'>
}

export default function MovieLibrary({ movies, labels }: MovieLibraryProps) {
  if (movies.length === 0) return null

  return (
    <section className="library-section" aria-labelledby="movies-title">
      <div className="library-section-heading">
        <h2 id="movies-title">{labels.filmsTitle}</h2>
        <a className="text-link interactive-target" href={labels.letterboxd.href} target="_blank" rel="noopener noreferrer">{labels.letterboxd.label}</a>
      </div>
      <ul className="movie-library">
        {movies.map((movie) => {
          const content = (
            <>
              <RecommendationArtwork
                image={movie.image}
                alt={movie.image ? `${movie.title} poster` : ''}
                gradient={movie.gradient}
                className="movie-poster-placeholder"
              />
              <h3>{movie.title}</h3>
              {movie.year && <p>{movie.year}</p>}
            </>
          )

          return (
            <li key={movie.id}>
              {movie.href ? (
                <a className="movie-entry" href={movie.href} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <article className="movie-entry">{content}</article>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
