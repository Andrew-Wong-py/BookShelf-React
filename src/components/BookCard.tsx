import React from 'react'
import { Link } from 'react-router'

import type { Book } from '../services/types'

interface BookCardProps {
  book: Book
  variant?: 'grid' | 'list'
}

const BookCard: React.FC<BookCardProps> = ({ book, variant = 'grid' }) => {
  if (variant === 'list') {
    return (
      <Link
        to={`/books/${book.id}`}
        className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {book.title}
            </h3>
            <p className="mb-2 text-sm text-gray-600">by {book.author}</p>
            {book.summary && (
              <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                {book.summary}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {book.categories.slice(0, 5).map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${book.price}
            </span>
            <span className="text-sm text-gray-500">Stock: {book.stock}</span>
            <span className="text-xs text-gray-400">{book.publishedYear}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/books/${book.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{book.title}</h3>
      <p className="mb-2 text-sm text-gray-600">by {book.author}</p>
      <div className="mb-3 flex flex-wrap gap-1">
        {book.categories.slice(0, 3).map((category) => (
          <span
            key={category}
            className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
          >
            {category}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">${book.price}</span>
        <span className="text-sm text-gray-500">Stock: {book.stock}</span>
      </div>
      {book.summary && (
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">
          {book.summary}
        </p>
      )}
    </Link>
  )
}

export default BookCard
