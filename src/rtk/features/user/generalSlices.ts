import {createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from '../../../utils';
import {mailSuffix} from '../../../environment';

export const sendAnonymousEmail = createAsyncThunk(
  'mail/anonymous',
  async (body: any) => {
    try {
      const response = await axios.post(
        `${BASE_URL}${mailSuffix}anonymous`,
        body,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const sendConfirmbookingEmail = createAsyncThunk(
  'mail/confirmbooking',
  async (body: any) => {
    try {
      const response = await axios.post(
        `${BASE_URL}${mailSuffix}confirmbooking`,
        body,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);
