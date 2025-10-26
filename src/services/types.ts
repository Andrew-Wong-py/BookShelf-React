// Book types for bookshelf application
export type Book = {
  id: string
  title: string
  author: string
  publishedYear: number
  categories: string[] // e.g., ["Novel", "CS", "History"]
  price: number // USD
  summary?: string
  stock: number // inventory
}

export type BooksResponse = {
  books: Book[]
  total: number
  page: number
  limit: number
}

export type BooksQueryParams = {
  page?: number
  limit?: number
  query?: string
}
