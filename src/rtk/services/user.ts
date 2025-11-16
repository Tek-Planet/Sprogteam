// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../../utils';
import {store} from '..';
import {suffix} from '../../environment';
import {UserModel} from '../../types';

// Define a service using a base URL and expected endpoints
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + suffix,
    prepareHeaders: headers => {
      const token = store.getState().user.token;

      headers.set('Authorization', `Bearer ${token.token}`);
      headers.set('secret', `${token.secret}`);

      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: builder => ({
    searchTranslator: builder.query<
      UserModel[],
      {country: string; zipcode: string; language: number}
    >({
      query: ({country, language}) =>
        `users/search?country=${country}&language=${language}`,
      providesTags: ['User'],
    }),
    getUserDetails: builder.query<UserModel, {Id: string}>({
      query: Id => `users/${Id}`,
      providesTags: ['User'],
    }),
    updateUserRating: builder.mutation({
      query: (payload: any) => ({
        url: 'users/rating',
        method: 'PUT',
        body: payload,
      }),
    }),
  }),
});

export const {
  useSearchTranslatorQuery,
  useGetUserDetailsQuery,
  useUpdateUserRatingMutation,
} = userApi;
