// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../../utils';
import {store} from '..';
import {suffix} from '../../environment';
import {GigType, UserModel} from '../../types';

export const gigsApi = createApi({
  reducerPath: 'gigsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + suffix,
    prepareHeaders: headers => {
      const token = store.getState().user.token;

      headers.set('Authorization', `Bearer ${token.token}`);
      headers.set('secret', `${token.secret}`);

      return headers;
    },
  }),
  tagTypes: ['Gig'],
  endpoints: builder => ({
    getGigs: builder.query<GigType[], string>({
      query: () => `gigs/`,
      providesTags: ['Gig'],
    }),
    getGigsByServiceId: builder.query<
      any[],
      {
        serviceId: number;
        country: string;
        fromLanguage: number;
        toLanguage: number;
        subServiceId: number;
      }
    >({
      query: ({serviceId, country, fromLanguage, toLanguage, subServiceId}) =>
        `gigs/${serviceId}?country=${country}&fromLanguage=${fromLanguage}&toLanguage=${toLanguage}&subServiceId=${subServiceId}`,
    }),
    getGigsByUserId: builder.query<
      GigType[],
      {userId: string; serviceId: string}
    >({
      query: ({userId, serviceId}) =>
        `gigs/others/${userId}?serviceId=${serviceId}`,
      providesTags: ['Gig'],
    }),
    // search gig
    searchGig: builder.query<UserModel[], {filter: string}>({
      query: filter => `gigs/search?filter=${filter}`,
    }),

    // get most ordered gig
    getMostOrderedGigs: builder.query<UserModel[], string>({
      query: () => `gigs/mostordered`,
    }),

    //
    createGig: builder.mutation({
      query: (newGig: GigType) => ({
        url: 'gigs/',
        method: 'POST',
        body: newGig,
      }),
      invalidatesTags: ['Gig'],
    }),

    editGig: builder.mutation({
      query: (updatedGig: GigType) => ({
        url: 'gigs/',
        method: 'PUT',
        body: updatedGig,
      }),
      invalidatesTags: ['Gig'],
    }),

    // delete
    deleteGig: builder.mutation({
      query: (gigId: number) => ({
        url: `gigs/${gigId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gig'],
    }),

    getRatings: builder.query<any[], {userId: string}>({
      query: userId => `ratings/${userId}`,
    }),
  }),
});

export const {
  useGetGigsQuery,
  useCreateGigMutation,
  useGetGigsByServiceIdQuery,
  useGetGigsByUserIdQuery,
  useSearchGigQuery,
  useDeleteGigMutation,
  useEditGigMutation,
  useGetRatingsQuery,
  useGetMostOrderedGigsQuery,
} = gigsApi;
