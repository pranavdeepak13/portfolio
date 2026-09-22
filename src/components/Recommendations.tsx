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
  }
  posterUrls: Record<string, string>
}

interface EditorialLibraryProps {
  title: string
  headingId: string
  items: Extract<Recommendation, { kind: 'video' | 'article' }>[]
  labels: PortfolioContent['recommendations']['labels']
}

function EditorialLibrary({ title, headingId, items, labels }: EditorialLibraryProps) {
  if (items.length === 0) return null

  return (
    <section className="library-section" aria-labelledby={headingId}>
      <div className="library-section-heading">
        <h2 id={headingId}>{title}</h2>
      </div>
      <ul className="editorial-library">
        {items.map((item) => (
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
              <p className="editorial-library-kind">{labels[item.kind]}</p>
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
  )
}

export default function Recommendations({ content, groups, posterUrls }: RecommendationsProps) {
  return (
    <div className="library-page-content">
      <ul className="library-counts" aria-label={content.countsLabel}>
        <li className="is-active">{content.booksTitle} {groups.books.length}</li>
        <li>{content.filmsTitle} {groups.movies.length}</li>
        <li>{content.videosTitle} {groups.videos.length}</li>
        <li>{content.articlesTitle} {groups.articles.length}</li>
      </ul>
      <BookShelf books={groups.books} labels={content} />
      <MovieLibrary movies={groups.movies} labels={content} posterUrls={posterUrls} />
      <EditorialLibrary title={content.videosTitle} headingId="videos-title" items={groups.videos} labels={content.labels} />
      <EditorialLibrary title={content.articlesTitle} headingId="articles-title" items={groups.articles} labels={content.labels} />
    </div>
  )
}
