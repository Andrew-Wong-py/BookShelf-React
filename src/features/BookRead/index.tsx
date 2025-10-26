import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode'
import HomeIcon from '@mui/icons-material/Home'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import React, { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'

import Layout from '../../components/Layout'
import Spinner from '../../components/Spinner'
import {
  useGetBookContentQuery,
  useGetBookQuery,
} from '../../services/booksSlice'

const WORDS_PER_PAGE = 300 // 每页显示的单词数

const BookRead: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: book, isLoading } = useGetBookQuery(id || '')
  const [currentPage, setCurrentPage] = useState(1)

  // Get book content using RTK Query
  const { data: bookContent = '' } = useGetBookContentQuery(id || '')

  // 计算总页数和当前页内容
  const { totalPages, currentContent } = useMemo(() => {
    // 将文本按单词分割（包括空格、标点等）
    const words = bookContent.trim().split(/\s+/)
    const total = Math.ceil(words.length / WORDS_PER_PAGE)
    const start = (currentPage - 1) * WORDS_PER_PAGE
    const end = start + WORDS_PER_PAGE
    const pageWords = words.slice(start, end)
    const content = pageWords.join(' ')
    return { totalPages: total, currentContent: content }
  }, [currentPage, bookContent])

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setCurrentPage(value)
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      </Layout>
    )
  }

  if (!book) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            Book not found.
          </div>
          <Link
            to="/books"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            ← Back to books
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          {/* Breadcrumb */}
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              to="/books"
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <HomeIcon fontSize="small" />
              Books
            </Link>
            <Link
              to={`/books/${id}`}
              className="flex items-center gap-1 text-blue-600 hover:underline"
            >
              <MenuBookIcon fontSize="small" />
              {book.title}
            </Link>
            <Typography
              color="text.primary"
              className="flex items-center gap-1"
            >
              <ChromeReaderModeIcon fontSize="small" />
              Read
            </Typography>
          </Breadcrumbs>
          <Link
            to={`/books/${id}`}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            ← Back to Details
          </Link>
        </div>

        {/* Reading Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {book.title}
          </h1>
          <p className="text-gray-600">by {book.author}</p>
        </div>

        {/* Book Content */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="prose prose-gray max-w-none">
            <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
              {currentContent}
            </p>
          </div>

          {/* Pagination Controls */}
          <div className="mt-8 flex flex-col items-center gap-4 border-t pt-6">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BookRead
