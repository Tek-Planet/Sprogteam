import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';

import {
  userApi,
  bookingApi,
  languageApi,
  favouritesApi,
  messageApi,
  gigsApi,
  quoteApi,
} from './services';

const store = configureStore({
  reducer: {
    // cake: cakeReducer,
    // icecream: icecreamReducer,
    user: userReducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [languageApi.reducerPath]: languageApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [favouritesApi.reducerPath]: favouritesApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [gigsApi.reducerPath]: gigsApi.reducer,
    [quoteApi.reducerPath]: quoteApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      bookingApi.middleware,
      languageApi.middleware,
      userApi.middleware,
      favouritesApi.middleware,
      messageApi.middleware,
      gigsApi.middleware,
      quoteApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export {store};
