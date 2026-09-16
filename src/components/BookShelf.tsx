import type { PortfolioContent, Recommendation } from '@/lib/content/portfolio-schema'

type BookRecommendation = Extract<Recommendation, { kind: 'book' }>

interface BookShelfProps {
  books: BookRecommendation[]
  labels: Pick<PortfolioContent['recommendations'], 'shelfTitle' | 'shelfNote' | 'booksLabel'>
}

export default function BookShelf({ books, labels }: BookShelfProps) {
  if (books.length === 0) return null

  return (
    <section className="library-section" aria-labelledby="bookshelf-title">
      <div className="library-section-heading">
        <h2 id="bookshelf-title">{labels.shelfTitle}</h2>
        <p>{labels.shelfNote}</p>
      </div>
      <div className="shelf-scroll" role="region" aria-label={labels.booksLabel} tabIndex={0}>
        <ul className="book-shelf">
          {books.map((book, index) => {
            const title = `${book.title}${book.author ? ` by ${book.author}` : ''}`
            const className = `book-spine-object recommendation-gradient recommendation-gradient-${book.gradient}`
            const style = { height: `${156 + (index % 5) * 16}px` }

            return (
              <li key={book.id}>
                {book.href ? (
                  <a
                    className={className}
                    style={style}
                    href={book.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${title}`}
                  >
                    <h3>{book.title}</h3>
                  </a>
                ) : (
                  <article className={className} style={style} title={title}>
                    <h3>{book.title}</h3>
                  </article>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
