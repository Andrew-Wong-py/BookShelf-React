import React, { useMemo, useState } from 'react'

import BookCard from '../../components/BookCard'
import Layout from '../../components/Layout'
import SearchInput from '../../components/SearchInput'
import Spinner from '../../components/Spinner'
import { useGetBooksQuery } from '../../services/books'

const ITEMS_PER_PAGE = 24

const BookList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, error } = useGetBooksQuery({
    page,
    limit: ITEMS_PER_PAGE,
    query: searchQuery,
  })

  const totalPages = useMemo(() => {
    if (!data) return 0
    return Math.ceil(data.total / ITEMS_PER_PAGE)
  }, [data])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1) // Reset to first page on search
  }

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages, prev + 1))
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Book Catalog
          </h1>
          <div className="max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title or author..."
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            Error loading books. Please try again.
          </div>
        )}

        {/* Results */}
        {data && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {data.books.length} of {data.total} books
              {searchQuery && ` for "${searchQuery}"`}
            </div>

            {/* Book Grid */}
            <div className="relative">
              {isFetching && !isLoading && (
                <div className="absolute top-0 right-0">
                  <Spinner />
                </div>
              )}
              {data.books.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  No books found. {searchQuery && 'Try adjusting your search.'}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {data.books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default BookList
