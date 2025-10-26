import Pagination from '@mui/material/Pagination'
import React, { useMemo, useRef, useState } from 'react'

import BookCard from '../../components/BookCard'
import Layout from '../../components/Layout'
import SearchInput from '../../components/SearchInput'
import Spinner from '../../components/Spinner'
import { useGetBooksQuery } from '../../services/booksSlice'

const ITEMS_PER_PAGE = 24

const BookList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isFetching, error } = useGetBooksQuery({
    page,
    limit: ITEMS_PER_PAGE,
    query: searchQuery,
  })

  // 计算总页数
  const totalPages = useMemo(() => {
    if (!data) return 0
    return Math.ceil(data.total / ITEMS_PER_PAGE)
  }, [data])

  const hasNextPage = page < totalPages

  // 仅预取下一页数据，不自动翻页
  useGetBooksQuery(
    {
      page: page + 1,
      limit: ITEMS_PER_PAGE,
      query: searchQuery,
    },
    {
      skip: !hasNextPage, // Skip if no next page
      // 只预取，不触发 setPage
      // RTK Query 会自动缓存
    },
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1) // Reset to first page on search
  }

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Layout>
      <div
        ref={listRef}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-8 flex">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            Book Catalog
          </h1>
          <div className="ml-auto w-240">
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
                <div className="flex flex-col gap-3">
                  {data.books.map((book) => (
                    <BookCard key={book.id} book={book} variant="list" />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default BookList
