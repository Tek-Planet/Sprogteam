import axios from 'axios';
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {UserState, LoginModel} from '../../models';
import {AUTH_BASE_URL, BASE_URL} from '../../../utils';
import {OTPModel, RegisterModel, TokenModel, UserModel} from '../../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authSuffix, suffix} from '../../../environment';

const initialState: UserState = {
  user: {} as UserModel,
  token: {} as TokenModel,
  gigState: undefined,
  error: undefined,
  authenticated: false,
  loading: true,
  currency: {dkk: 'DKK', usd: 'USD'},
  currentRoute: 'General',
  defaultLanguage: undefined,
};

// Generates pending, fulfilled and rejected action types
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (body: LoginModel) => {
    try {
      let response: any = await axios.post(`${AUTH_BASE_URL}login`, body);
      if (!response.data?.token) {
        return response.data;
      }
      // get server token

      response = await getServerToken(body.UserName, response.data?.token);

      if (!response) return 'Authentication Error';

      if (response?.user?.InActive) return 'InActive';


      await setHeaders(response);
      storeAuthToken(response);
      storeUserName(body.UserName);

      return response;
    } catch (error) {
      throw error;
    }
  },
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (body: UserModel) => {
    try {
      const url = body.interpreter
        ? `${AUTH_BASE_URL}register`
        : `${AUTH_BASE_URL}register-customer`;
      let response: any = await axios.post(url, body);

      if (!response.data?.token) {
        return {message: 'error', error: true};
      }
      // get server token

      let serverResponse = await getServerToken(
        body.Email,
        response.data?.token,
      );

      if (!serverResponse) return {message: 'error', error: true};

      await setHeaders(serverResponse);

      await storeUserName(body.Email);

      const roleId = body.interpreter
        ? '1cf787b6-f0d6-499b-aabf-59f54fb43f13'
        : '68e81ba9-0899-40c4-b232-beeb4d60148b';

      addRole(response.data.user.id, roleId);
      return {message: 'successful', Id: response.data.user.id, error: false};
    } catch (error) {
      throw {message: 'error', error: true};
    }
  },
);

// Generates pending, fulfilled and rejected action types
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  try {
    const response = await axios.get(`${BASE_URL}${suffix}users`);
    return response.data;
  } catch (error) {
    if (error) throw error;
    else {
      return null;
    }
  }
});

// get Auth token
export const getAuthToken = createAsyncThunk('user/getAuthToken', async () => {
  const jsonValue = await AsyncStorage.getItem('authTokens');

  if (jsonValue !== null) {
    let authTokens = JSON.parse(jsonValue + '');
    // set axios header
    await setHeaders(authTokens);
    return authTokens;
  } else {
    return null;
  }
});

// chnage profile picture

export const changeProfilePicture = createAsyncThunk(
  'user/profilePicture',
  async (formData: any) => {
    try {
      let options = {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };
      let response = await fetch(`${AUTH_BASE_URL}upload`, options);
      let result = await response.json();
      return result;
    } catch (error) {
      throw 'error';
    }
  },
);

// verify password

export const verifyPassword = createAsyncThunk(
  'user/verifyPassword',
  async (body: LoginModel) => {
    const response = await axios.post(`${AUTH_BASE_URL}login`, body);
    return response.data;
  },
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (body: LoginModel) => {
    const response = await axios.post(`${AUTH_BASE_URL}forgotpassword`, body);
    return response.data;
  },
);

export const updateUserRecord = createAsyncThunk(
  'user/updateUserRecord',
  async (body: RegisterModel) => {
    try {
      const response = await axios.put(`${BASE_URL}${suffix}users/`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const sendOTP = createAsyncThunk(
  'user/sendOTP',
  async (body: OTPModel) => {
    try {
      let response = await axios.post(`${BASE_URL}mails/`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

export const sendPasswordResetOTP = createAsyncThunk(
  'user/sendPasswordResetOTP',
  async (body: OTPModel) => {
    try {
      let response = await axios.post(`${BASE_URL}mails/resetpassword`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },

    setGigState: (state, action) => {
      state.gigState = action.payload;
    },

    changeRoute: (state, action: PayloadAction<string>) => {
      state.currentRoute = action.payload;
    },

    setDefaultLanguage: (state, action: PayloadAction<any>) => {
      state.defaultLanguage = action.payload;
    },

    logoutUser: state => {
      AsyncStorage.removeItem('authTokens');
      state.user = initialState.user;
      state.token = initialState.token;
      state.authenticated = initialState.authenticated;
    },
  },
  extraReducers: builder => {
    builder.addCase(getAuthToken.fulfilled, (state, action) => {
      if (action?.payload?.token && action?.payload?.secret) {
        state.token = action.payload;
      }

      state.loading = false;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      //   state.loadingUI = false;
      state.token = action.payload;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      //   state.loadingUI = false;
      // console.log(action.error, 'from slice');
    });

    // register user state case

    // fetch user state cases
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<UserModel>) => {
        state.user = action.payload;
        state.error = '';
        state.authenticated = true;
        state.loading = false;
      },
    );

    builder.addCase(fetchUser.pending, (state, action) => {
      state.error = '';
      if (!state.authenticated) state.loading = true;
    });

    builder.addCase(fetchUser.rejected, (state, action) => {
      state.error = action.error.message || 'Something went wrong';

      state.loading = false;
    });
  },
});

export default userSlice.reducer;
export const {changeRoute, logoutUser, setGigState, setDefaultLanguage} =
  userSlice.actions;

export const storeAuthToken = async (value: TokenModel) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('authTokens', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const setHeaders = (authToken: any) => {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken.token;
  axios.defaults.headers.common['secret'] = authToken.secret;
};

export const storeUserName = async (value: string) => {
  try {
    await AsyncStorage.setItem('userName', value);
  } catch (e) {
    console.log(e);
  }
};

export const getUserName = async () => {
  try {
    const value = await AsyncStorage.getItem('userName');
    if (value !== null) {
      return value;
    }
    return '';
  } catch (e) {
    console.log(e);
    return '';
  }
};

export const getServerToken = async (email: string, secret: string) => {
  try {
    const data = {
      id: new Date().toISOString(),
      email: email,
    };

    const options = {
      method: 'POST',
      headers: {
        secret,
      },
      data,
      url: `${BASE_URL}${authSuffix}/login`,
    };

    const response = await axios(options); // wrap in async function

    //  save the tokens
    const authTokens = {
      secret,
      token: response.data.token,
      user: response.data.user,
    };

    return authTokens;
  } catch (err) {
    console.log(err, 'From server token');
    return null;
  }
};

export const getUserDetails = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${suffix}users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteMyAccount = async (id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}${suffix}users/${id}`);

    return response.data.msg;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getMinimalUserDetails = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}${suffix}users/details/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const addRole = async (userId: string, roleId: string) => {
  const data = {
    UserId: userId,
    RoleId: roleId,
  };

  let res;
  try {
    res = await axios.post(`${BASE_URL}${suffix}users/roles`, data);
    console.log(res.data.msg);
    return res.data.msg;
  } catch (err) {
    console.log(err, 'from role adding');
    return 'error';
  }
};

export const getClientSecretKey = async (body: any) => {
  try {
    console.log(body);
    const res = await axios.post(`${BASE_URL}${suffix}/payment`, body);

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log('stripe error', error);
    return 'error';
  }
};

export const checkAvailability = async (st: any, et: any, id: any) => {
  try {
    let res = await axios.get(
      `${BASE_URL}${suffix}/order/available/${st}/${et}/${id}`,
    );
    return res.data.isFree;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const registerDevice = createAsyncThunk(
  'user/registerToken',
  async (body: any) => {
    try {
      const response = await axios.post(`${BASE_URL}${suffix}tokens/`, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);
