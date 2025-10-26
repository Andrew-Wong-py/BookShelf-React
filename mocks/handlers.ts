import { http, HttpResponse } from 'msw'

import type { Book } from '../src/services/types'
import { sleep } from '../src/utils/sleep'
import booksData from '../take-home-assessment/books.json'

// In-memory storage for books (to simulate updates)
const books: Book[] = booksData.books as Book[]

export const handlers = [
  // GET /books - List books with pagination and search
  http.get('http://localhost:4000/api/books', async ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('_page') || '1', 10)
    const limit = parseInt(url.searchParams.get('_limit') || '24', 10)
    const query = url.searchParams.get('query') || ''

    await sleep(300) // Simulate network delay

    // Filter books by query (search in title and author)
    let filteredBooks = books
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredBooks = books.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery),
      )
    }

    // Calculate pagination
    const total = filteredBooks.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedBooks = filteredBooks.slice(start, end)

    return HttpResponse.json({
      books: paginatedBooks,
      total,
      page,
      limit,
    })
  }),

  // GET /books/:id - Get single book
  http.get('http://localhost:4000/api/books/:id', async ({ params }) => {
    const { id } = params
    await sleep(200)

    const book = books.find((b) => b.id === id)

    if (!book) {
      return HttpResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return HttpResponse.json(book)
  }),

  // PUT /books/:id - Update book
  http.put(
    'http://localhost:4000/api/books/:id',
    async ({ params, request }) => {
      const { id } = params
      const updates = await request.json()
      await sleep(300)

      const bookIndex = books.findIndex((b) => b.id === id)

      if (bookIndex === -1) {
        return HttpResponse.json({ error: 'Book not found' }, { status: 404 })
      }

      books[bookIndex] = { ...books[bookIndex], ...(updates as Partial<Book>) }

      return HttpResponse.json(books[bookIndex])
    },
  ),

  // GET /categories - Get all unique categories
  http.get('http://localhost:4000/api/categories', async () => {
    await sleep(200)

    const categories = Array.from(
      new Set(books.flatMap((book) => book.categories)),
    ).sort()

    return HttpResponse.json(categories)
  }),
]
