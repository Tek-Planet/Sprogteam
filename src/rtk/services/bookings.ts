// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../../utils';
import {store} from '..';
import {suffix} from '../../environment';
import {BookingModel, WrittenBooking} from '../../types';

// Define a service using a base URL and expected endpoints
export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + suffix,
    prepareHeaders: headers => {
      const token = store.getState().user.token;

      headers.set('Authorization', `Bearer ${token.token}`);
      headers.set('secret', `${token.secret}`);

      return headers;
    },
  }),
  tagTypes: ['Booking', 'Written', 'OpenBooking'],
  endpoints: builder => ({
    getBookings: builder.query<BookingModel[], string>({
      query: () => `orders/`,
      providesTags: ['Booking'],
    }),

    getOpenBookings: builder.query<BookingModel[], {userLanguages: string}>({
      query: userLanguages => `orders/open/${userLanguages}`,
      providesTags: ['OpenBooking'],
    }),

    createBooking: builder.mutation({
      query: (newBooking: BookingModel) => ({
        url: 'orders/',
        method: 'POST',
        body: newBooking,
      }),
      invalidatesTags: ['Booking'],
    }),
    // get single booking
    getBooking: builder.query<BookingModel, {id: number}>({
      query: ({id}) => `orders/${id}`,
    }),
    // upfate booking status

    updateBooking: builder.mutation({
      query: (updatedBooking: BookingModel) => ({
        url: 'orders/',
        method: 'PUT',
        body: updatedBooking,
      }),
      invalidatesTags: ['Booking', 'OpenBooking'],
    }),

    // new endtime
    changeNewTimeStatus: builder.mutation({
      query: (updatedBooking: BookingModel) => ({
        url: 'orders/newtime',
        method: 'PUT',
        body: updatedBooking,
      }),
      invalidatesTags: ['Booking'],
    }),

    // changeInterpreter to anonymous
    changeInterpreterToAnonymous: builder.mutation({
      query: (body: any) => ({
        url: 'orders/anonymous',
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['Booking'],
    }),

    // change thr rating status of a booking

    changeRatingStatus: builder.mutation({
      query: (bookingId: any) => ({
        url: `orders/${bookingId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Booking'],
    }),

    // handle booking feedbacks here
    getFeedBacks: builder.query<any[], {id: number}>({
      query: id => `feedback/${id}`,
    }),

    // written booking section

    getWritten: builder.query<WrittenBooking[], string>({
      query: () => `written/`,
      providesTags: ['Written'],
    }),
    createWrittenBooking: builder.mutation({
      query: (newBooking: WrittenBooking) => ({
        url: 'written/',
        method: 'POST',
        body: newBooking,
      }),
      invalidatesTags: ['Written'],
    }),

    createRejected: builder.mutation({
      query: (body: any) => ({
        url: 'orders/rejected',
        method: 'POST',
        body: body,
      }),
    }),
  }),

  // update rejected table
});

export const {
  useGetBookingsQuery,
  useCreateBookingMutation,
  useGetBookingQuery,
  useGetFeedBacksQuery,
  useChangeInterpreterToAnonymousMutation,
  useUpdateBookingMutation,
  useGetWrittenQuery,
  useCreateWrittenBookingMutation,
  useGetOpenBookingsQuery,
  useChangeNewTimeStatusMutation,
  useCreateRejectedMutation,
  useChangeRatingStatusMutation,
} = bookingApi;
