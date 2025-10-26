import HomeIcon from '@mui/icons-material/Home'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import React from 'react'
import { Link, useParams } from 'react-router'

import Layout from '../../components/Layout'
import Spinner from '../../components/Spinner'
import { useGetBookQuery } from '../../services/booksSlice'

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: book, isLoading, error } = useGetBookQuery(id || '')

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      </Layout>
    )
  }

  if (error || !book) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-red-50 p-4 text-red-800">
            Book not found or error loading details.
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
        <Breadcrumbs aria-label="breadcrumb" className="mb-6">
          <Link
            to="/books"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <HomeIcon fontSize="small" />
            Books
          </Link>
          <Typography color="text.primary" className="flex items-center gap-1">
            <MenuBookIcon fontSize="small" />
            {book.title}
          </Typography>
        </Breadcrumbs>

        {/* Book Details Card */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {book.title}
            </h1>
            <p className="text-lg text-gray-600">by {book.author}</p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Published Year
              </h3>
              <p className="text-lg text-gray-900">{book.publishedYear}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Price</h3>
              <p className="text-2xl font-bold text-gray-900">
                ${book.price.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">Stock</h3>
              <p className="text-lg text-gray-900">
                {book.stock} units available
              </p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-500">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {book.summary && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                Summary
              </h3>
              <p className="text-gray-700">{book.summary}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/books/${book.id}/edit`}
              className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              Edit Book
            </Link>
            <Link
              to={`/books/${book.id}/read`}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              Read Book
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default BookDetail
