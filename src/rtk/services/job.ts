// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {UserModel} from '../../types';
import {BASE_URL} from '../../utils';
import {store} from '..';

// Define a service using a base URL and expected endpoints

export const adsApi = createApi({
  reducerPath: 'adsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: headers => {
      const token = store.getState().user.token;

      headers.set('Authorization', `Bearer ${token}`);

      return headers;
    },
  }),
  endpoints: builder => ({
    getOpenAds: builder.query({
      query: () => 'ads/open',
    }),
    getAds: builder.query<JobType[], string>({
      query: () => 'ads/',
    }),
    createAd: builder.mutation({
      query: (newAds: JobType) => ({
        url: 'ads/',
        method: 'POST',
        body: newAds,
      }),
    }),
    deleteAd: builder.mutation({
      query: (id: string) => ({
        url: `ads/${id}`,
        method: 'DELETE',
      }),
    }),
    updateAd: builder.mutation({
      query: (newAds: JobType) => ({
        url: 'ads/',
        method: 'PUT',
        body: newAds,
      }),
    }),
    getUsers: builder.query<UserModel[], number>({
      query: (categoryId: number) => `users/categories/${categoryId}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetOpenAdsQuery,
  useGetAdsQuery,
  useCreateAdMutation,
  useDeleteAdMutation,
  useUpdateAdMutation,
  useGetUsersQuery,
} = adsApi;
