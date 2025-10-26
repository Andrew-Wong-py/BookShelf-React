import React from 'react'
import { Link, useParams } from 'react-router'

import bookContent from '../../../take-home-assessment/book_content.txt?raw'
import Layout from '../../components/Layout'
import Spinner from '../../components/Spinner'
import { useGetBookQuery } from '../../services/books'

const BookRead: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: book, isLoading } = useGetBookQuery(id || '')

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
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link to="/books" className="text-blue-600 hover:underline">
            Books
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to={`/books/${id}`} className="text-blue-600 hover:underline">
            {book.title}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Read</span>
        </nav>

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
              {bookContent}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex gap-4">
          <Link
            to={`/books/${id}`}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            ← Back to Details
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default BookRead
