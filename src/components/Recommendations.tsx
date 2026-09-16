import BookShelf from '@/components/BookShelf'
import MovieLibrary from '@/components/MovieLibrary'
import RecommendationArtwork from '@/components/RecommendationArtwork'
import type { PortfolioContent, Recommendation } from '@/lib/content/portfolio-schema'

interface RecommendationsProps {
  content: PortfolioContent['recommendations']
  groups: {
    books: Extract<Recommendation, { kind: 'book' }>[]
    movies: Extract<Recommendation, { kind: 'movie' }>[]
    videos: Extract<Recommendation, { kind: 'video' }>[]
    articles: Extract<Recommendation, { kind: 'article' }>[]
    editorial: Extract<Recommendation, { kind: 'video' | 'article' }>[]
  }
}

export default function Recommendations({ content, groups }: RecommendationsProps) {
  return (
    <div className="library-page-content">
      <ul className="library-counts" aria-label={content.countsLabel}>
        <li className="is-active">{content.booksTitle} {groups.books.length}</li>
        <li>{content.filmsTitle} {groups.movies.length}</li>
        <li>{content.labels.editorial} {groups.editorial.length}</li>
      </ul>
      <BookShelf books={groups.books} labels={content} />
      <MovieLibrary movies={groups.movies} labels={content} />
      {groups.editorial.length > 0 && (
        <section className="library-section" aria-labelledby="editorial-title">
          <div className="library-section-heading">
            <h2 id="editorial-title">{content.editorialTitle}</h2>
          </div>
          <ul className="editorial-library">
            {groups.editorial.map((item) => (
              <li key={item.id}>
                <article>
                  <RecommendationArtwork
                    image={item.image}
                    alt={item.image ? `${item.title} artwork` : ''}
                    gradient={item.gradient}
                    className="editorial-library-art"
                    sizes="110px"
                  />
                  <div className="editorial-library-copy">
                    <h3>{item.title}</h3>
                    {'channel' in item && item.channel && <p>{item.channel}</p>}
                    {'publication' in item && item.publication && <p>{item.publication}</p>}
                  </div>
                  <p className="editorial-library-kind">{content.labels[item.kind]}</p>
                  {item.href && (
                    <a
                      href={item.href}
                      className="editorial-library-hit"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${item.title}`}
                    />
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
