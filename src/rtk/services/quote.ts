// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../../utils';
import {QuoteDetail, QuoteType} from '../../types';
import {store} from '..';
import {suffix} from '../../environment';

// Define a service using a base URL and expected endpoints
export const quoteApi = createApi({
  reducerPath: 'quoteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + suffix,
    prepareHeaders: headers => {
      const token = store.getState().user.token;

      headers.set('Authorization', `Bearer ${token.token}`);
      headers.set('secret', `${token.secret}`);

      return headers;
    },
  }),
  tagTypes: ['Quote', 'QuoteDetails', 'OpenQuote'],
  endpoints: builder => ({
    getQuotes: builder.query<QuoteType[], string>({
      query: () => 'quotes/',
      providesTags: ['Quote'],
    }),
    getQuote: builder.query<QuoteType, string>({
      query: (id: string) => `quotes/${id}`,
    }),
    createQuote: builder.mutation({
      query: (newQuote: QuoteType) => ({
        url: 'quotes/',
        method: 'POST',
        body: newQuote,
      }),
      invalidatesTags: ['Quote'],
    }),
    updateQuote: builder.mutation({
      query: (updatedQuote: QuoteType) => ({
        url: 'quotes/',
        method: 'PUT',
        body: updatedQuote,
      }),
      invalidatesTags: ['Quote'],
    }),
    acceptQuote: builder.mutation({
      query: (newQuote: QuoteType) => ({
        url: 'quotes/',
        method: 'PUT',
        body: newQuote,
      }),
      invalidatesTags: ['Quote', 'OpenQuote'],
    }),

    deleteQuote: builder.mutation({
      query: (id: number) => ({
        url: `quotes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quote'],
    }),

    getOpenQuotes: builder.query<QuoteType[], string>({
      query: () => 'quotes/open',
      providesTags: ['OpenQuote'],
    }),

    // quotes details routes

    createQuoteDetails: builder.mutation({
      query: (newQuoteDetails: QuoteDetail) => ({
        url: 'quotes/details',
        method: 'POST',
        body: newQuoteDetails,
      }),
    }),
    getQuotesDetails: builder.query<QuoteDetail[], {quoteId: number}>({
      query: quoteId => `quotes/details/${quoteId}`,
    }),
  }),
});

export const {
  useGetQuotesQuery,
  useGetQuoteQuery,
  useCreateQuoteMutation,
  useAcceptQuoteMutation,
  useCreateQuoteDetailsMutation,
  useGetQuotesDetailsQuery,
  useGetOpenQuotesQuery,
  useUpdateQuoteMutation,
  useDeleteQuoteMutation,
} = quoteApi;
