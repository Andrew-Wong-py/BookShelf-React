import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Book, BooksResponse, BooksQueryParams } from './types'

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
  tagTypes: ['Book'], // 定义标签类型（用于缓存失效）
  endpoints: (builder) => ({
    getBooks: builder.query<BooksResponse, BooksQueryParams>({
      query: ({ page = 1, limit = 24, query = '' }) => ({
        url: '/books',
        params: {
          _page: page,
          _limit: limit,
          ...(query && { query }),
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.books.map(({ id }) => ({ type: 'Book' as const, id })),
              { type: 'Book', id: 'LIST' },
            ]
          : [{ type: 'Book', id: 'LIST' }],
    }),
    getBook: builder.query<Book, string>({
      query: (id) => `/books/${id}`,
      providesTags: (result, error, id) => [{ type: 'Book', id }],
    }),
    updateBook: builder.mutation<Book, { id: string; updates: Partial<Book> }>({
      query: ({ id, updates }) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Book', id },
        { type: 'Book', id: 'LIST' },
      ],
    }),
    getCategories: builder.query<string[], void>({
      query: () => '/categories',
    }),
  }),
})

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useUpdateBookMutation,
  useGetCategoriesQuery,
} = booksApi
