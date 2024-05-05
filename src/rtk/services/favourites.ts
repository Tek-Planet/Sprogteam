// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {BASE_URL} from '../../utils';
import {store} from '..';
import {suffix} from '../../environment';

export const favouritesApi = createApi({
  reducerPath: 'favouritesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + suffix,
    prepareHeaders: headers => {
      const token = store.getState().user.token;

      headers.set('Authorization', `Bearer ${token.token}`);
      headers.set('secret', `${token.secret}`);

      return headers;
    },
  }),
  tagTypes: ['Favourites'],
  endpoints: builder => ({
    getFavouries: builder.query<any[], string>({
      query: () => 'favourites/',
      providesTags: ['Favourites'],
    }),
    createFavourie: builder.mutation({
      query: (favourite: any) => ({
        url: 'favourites/',
        method: 'POST',
        body: favourite,
      }),
      invalidatesTags: ['Favourites'],
    }),
    deleteFavourie: builder.mutation({
      query: (id: number) => ({
        url: `favourites/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favourites'],
    }),

    addRating: builder.mutation({
      query: (payload: any) => ({
        url: `ratings/`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetFavouriesQuery,
  useCreateFavourieMutation,
  useDeleteFavourieMutation,
  useAddRatingMutation,
} = favouritesApi;
