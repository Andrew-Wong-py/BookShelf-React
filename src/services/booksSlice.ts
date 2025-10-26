import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import bookContentRaw from '../../take-home-assessment/book_content.txt?raw'

import type { Book, BooksResponse, BooksQueryParams } from './types'

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4000/api' }),
  tagTypes: ['Book', 'BookContent'], // 定义标签类型（用于缓存失效）
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
    // Book Content endpoints (in-memory only, no actual API calls)
    getBookContent: builder.query<string, string>({
      queryFn: (bookId, { getState }) => {
        // Return from cache or default content
        const state = getState() as any
        const cachedContent =
          state.booksApi?.queries?.[`getBookContent("${bookId}")`]?.data
        return { data: cachedContent || bookContentRaw }
      },
      providesTags: (result, error, bookId) => [
        { type: 'BookContent', id: bookId },
      ],
    }),
    updateBookContent: builder.mutation<
      string,
      { bookId: string; content: string }
    >({
      queryFn: ({ content }) => {
        // Simulate successful update (in-memory only)
        return { data: content }
      },
      // Update the cache optimistically
      async onQueryStarted({ bookId, content }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          booksApi.util.updateQueryData(
            'getBookContent',
            bookId,
            () => content,
          ),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (result, error, { bookId }) => [
        { type: 'BookContent', id: bookId },
      ],
    }),
  }),
})

export const {
  useGetBooksQuery,
  useGetBookQuery,
  useUpdateBookMutation,
  useGetCategoriesQuery,
  useGetBookContentQuery,
  useUpdateBookContentMutation,
} = booksApi
