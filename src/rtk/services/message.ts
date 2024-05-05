// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../../utils';
import {store} from '..';
import {ChatModel, UserModel} from '../../types';
import {suffix} from '../../environment';

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + suffix,
    prepareHeaders: headers => {
      const token = store.getState().user.token;

      headers.set('Authorization', `Bearer ${token.token}`);
      headers.set('secret', `${token.secret}`);

      return headers;
    },
  }),
  tagTypes: ['Inbox', ''],
  endpoints: builder => ({
    getInboxs: builder.query<UserModel[], string>({
      query: () => 'messages/',
      providesTags: ['Inbox'],
    }),
    getInbox: builder.query<string, {userId: string}>({
      query: userId => `messages/${userId}`,
      providesTags: ['Inbox'],
    }),
    getChats: builder.query({
      query: (Id: string) => `chats/${Id}`,
    }),
    createChats: builder.mutation({
      query: (newChat: ChatModel) => ({
        url: 'chats/',
        method: 'POST',
        body: newChat,
      }),
      invalidatesTags: ['Inbox'],
    }),
    createInbox: builder.mutation({
      query: (newIbox: UserModel) => ({
        url: 'chats/Inbox',
        method: 'POST',
        body: newIbox,
      }),
      invalidatesTags: ['Inbox'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetInboxsQuery,
  useGetInboxQuery,
  useGetChatsQuery,
  useCreateInboxMutation,
  useCreateChatsMutation,
} = messageApi;
