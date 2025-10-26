import EditIcon from '@mui/icons-material/Edit'
import HomeIcon from '@mui/icons-material/Home'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import Layout from '../../components/Layout'
import Spinner from '../../components/Spinner'
import {
  useGetBookContentQuery,
  useGetBookQuery,
  useUpdateBookContentMutation,
  useUpdateBookMutation,
} from '../../services/booksSlice'
import type { Book } from '../../services/types'

const BookEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: book, isLoading } = useGetBookQuery(id || '')
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation()

  // Get book content using RTK Query
  const { data: bookContent = '' } = useGetBookContentQuery(id || '')
  const [updateBookContent] = useUpdateBookContentMutation()

  const [formData, setFormData] = useState<Partial<Book>>({
    title: '',
    author: '',
    publishedYear: new Date().getFullYear(),
    categories: [],
    price: 0,
    summary: '',
    stock: 0,
  })

  const [categoryInput, setCategoryInput] = useState('')
  const [contentInput, setContentInput] = useState(bookContent)

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        publishedYear: book.publishedYear,
        categories: book.categories,
        price: book.price,
        summary: book.summary,
        stock: book.stock,
      })
    }
  }, [book])

  // Update content input when bookContent changes
  useEffect(() => {
    setContentInput(bookContent)
  }, [bookContent])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'publishedYear' || name === 'price' || name === 'stock'
          ? parseFloat(value) || 0
          : value,
    }))
  }

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.categories?.includes(categoryInput)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), categoryInput.trim()],
      }))
      setCategoryInput('')
    }
  }

  const handleRemoveCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories?.filter((c) => c !== category) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      // Update book content using RTK Query mutation (in-memory only)
      await updateBookContent({ bookId: id, content: contentInput })

      await updateBook({ id, updates: formData }).unwrap()
      navigate(`/books/${id}`)
    } catch (error) {
      console.error('Failed to update book:', error)
    }
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
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" className="mb-6">
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
          <Typography color="text.primary" className="flex items-center gap-1">
            <EditIcon fontSize="small" />
            Edit
          </Typography>
        </Breadcrumbs>

        {/* Edit Form */}
        <div className="rounded-lg bg-white p-8 shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Book</h1>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Author */}
            <div className="mb-4">
              <label
                htmlFor="author"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Published Year */}
            <div className="mb-4">
              <label
                htmlFor="publishedYear"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Published Year
              </label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleInputChange}
                required
                min="1000"
                max="9999"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Price (USD)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Stock */}
            <div className="mb-4">
              <label
                htmlFor="stock"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Categories */}
            <div className="mb-4">
              <label
                htmlFor="category-input"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Categories
              </label>
              <div className="mb-2 flex gap-2">
                <input
                  type="text"
                  id="category-input"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddCategory()
                    }
                  }}
                  placeholder="Add category..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.categories?.map((category) => (
                  <span
                    key={category}
                    className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="mb-4">
              <label
                htmlFor="summary"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Book Content */}
            <div className="mb-6">
              <label
                htmlFor="content"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Reading Content
              </label>
              <textarea
                id="content"
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter book reading content..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                to={`/books/${id}`}
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default BookEdit
