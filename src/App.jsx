import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    title: '',
    author: '',
    year: ''
  })
  const popularBooks = ['Harry Potter and the Philosopher\'s Stone', 'The Alchemist', 'Alice\'s Adventures in Wonderland', 'The Jungle Book', 'The Diary of a Young Girl', 'The Fault in Our Stars']
  useEffect(() => {
    async function fetchBooks() {
      try {
        const popularResults = await Promise.all(
          popularBooks.map((title) =>
            fetch(
              `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=1`
            ).then((response) => {
              if (!response.ok) {
                throw new Error('Failed to fetch popular books')
              }
              return response.json()
            })
          )
        )

        const extraResponse = await fetch(
          'https://openlibrary.org/search.json?q=best+sellers&limit=24'
        )

        if (!extraResponse.ok) {
          throw new Error('Failed to fetch additional books')
        }

        const extraData = await extraResponse.json()

        const popularList = popularResults.map((data, index) => {
          const book = data.docs[0]

          return {
            id: `popular-${index}`,
            title: book?.title || popularBooks[index],
            author: book?.author_name?.[0] || 'Unknown Author',
            year: book?.first_publish_year || 'Not Available',
            cover: book?.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : ''
          }
        })

        const extraBooks = extraData.docs.map((book, index) => ({
          id: `extra-${index}`,
          title: book.title || 'Unknown Title',
          author: book.author_name?.[0] || 'Unknown Author',
          year: book.first_publish_year || 'Not Available',
          cover: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : ''
        }))

        const allBooks = [
          ...popularList,
          ...extraBooks.filter(
            (book) =>
              !popularList.some(
                (popular) =>
                  popular.title.toLowerCase() === book.title.toLowerCase()
              )
          )
        ]

        setBooks(allBooks)
        setSuccess('Books loaded successfully!')
      } catch {
        setError('Unable to load books. Please check your internet connection.')
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  )

  const booksPerPage = 6
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const startIndex = (page - 1) * booksPerPage

  const currentBooks = filteredBooks.slice(
    startIndex,
    startIndex + booksPerPage
  )

  function handleSearch(event) {
    setSearch(event.target.value)
    setPage(1)
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const newBook = {
      id: Date.now(),
      title: form.title.trim(),
      author: form.author.trim(),
      year: form.year || 'Not Available',
      cover: ''
    }

    setBooks((previousBooks) => [...previousBooks, newBook])
    setSearch('')
    setPage(1)
    setSuccess('Book added successfully!')
    setError('')

    setForm({
      title: '',
      author: '',
      year: ''
    })
  }

  return (
    <div className="container">

      <header>
        <h1>Book Explorer</h1>
        <p>Discover popular books and find your next favourite read</p>
      </header>

      <section className="user-section">
        <h2>Explore Books</h2>

        <input
          type="text"
          placeholder="Search by book title or author..."
          value={search}
          onChange={handleSearch}
          className="search"
        />

        {loading && <p>Loading books...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && success && (
          <p className="success">{success}</p>
        )}

        {!loading && !error && currentBooks.length === 0 && (
          <p>No books found.</p>
        )}

        <div className="user-list">
          {currentBooks.map((book) => (
            <div className="user-card" key={book.id}>

              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="book-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="no-cover"></div>
              )}

              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Published:</strong> {book.year}</p>

            </div>
          ))}
        </div>

        {!loading && !error && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span>Page {page} of {totalPages}</span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <section className="form-section">
        <h2>Add a New Book</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Enter book title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input type="text" name="author"  placeholder="Enter author name" value={form.author} onChange={handleChange} required/>
          <input type="number" name="year" placeholder="Enter published year" min="1" max={new Date().getFullYear()} value={form.year} onChange={handleChange}/>
          <button type="submit">Add Book</button>
        </form>
      </section>
    </div>
  )
}

export default App