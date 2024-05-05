// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from '../../utils';
import {store} from '..';
import {suffix} from '../../environment';
import {SelectOptionType} from '../../types';

// Define a service using a base URL and expected endpoints
export const languageApi = createApi({
  reducerPath: 'languageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL + suffix,
    prepareHeaders: headers => {
      const token = store.getState().user.token;

      headers.set('Authorization', `Bearer ${token.token}`);
      headers.set('secret', `${token.secret}`);

      return headers;
    },
  }),
  tagTypes: ['Language', ''],
  endpoints: builder => ({
    getLanguages: builder.query<SelectOptionType[], string>({
      query: () => `/languages`,
    }),
    getTranlatorLanguages: builder.query<
      any[],
      {userId: string; email: string}
    >({
      query: ({userId, email}) => `/languages/${userId}/${email}`,
      providesTags: ['Language'],
    }),

    addLanguage: builder.mutation({
      query: (newLanguage: SelectOptionType) => ({
        url: 'languages/',
        method: 'POST',
        body: newLanguage,
      }),
      invalidatesTags: ['Language'],
    }),

    deleteLanguage: builder.mutation({
      query: (languageId: number) => ({
        url: `languages/${languageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Language'],
    }),

    // services section
    addService: builder.mutation({
      query: (newService: SelectOptionType) => ({
        url: 'services/',
        method: 'POST',
        body: newService,
      }),
    }),

    // get services
    getServices: builder.query<any[], {}>({
      query: () => `/services`,
    }),

    //get interpretr services
    getInterpreterServices: builder.query<any[], {}>({
      query: () => `/services/myservices`,
    }),
    // get sub services
    getSubServices: builder.query<any[], {serviceId: any}>({
      query: serviceId => `/services/subservices?serviceId=${serviceId}`,
    }),
    // skill section
    getTranlatorSkills: builder.query<
      SelectOptionType[],
      {userId: string; email: string}
    >({
      query: ({userId, email}) => `/skills/${userId}/${email}`,
    }),

    // get

    //get interpretr services
    getServiceCharge: builder.query<any, {}>({
      query: () => `/services/servicecharge`,
    }),

    // translation hanf=dbook private policy

    getHandbook: builder.query<SelectOptionType[], {column: string}>({
      query: column => `/news/rules/${column}`,
    }),
  }),
});

export const {
  useGetLanguagesQuery,
  useAddLanguageMutation,
  useGetTranlatorLanguagesQuery,
  useAddServiceMutation,
  useGetTranlatorSkillsQuery,
  useDeleteLanguageMutation,
  useGetSubServicesQuery,
  useGetServicesQuery,
  useGetInterpreterServicesQuery,
  useGetHandbookQuery,
  useGetServiceChargeQuery,
} = languageApi;

// export const getInterpreterSkill = async (userId, email) => {
//   var languages = [];
//   try {
//     // console.log('languages');
//     let res = await axios.get(`/skills/${userId}/${email}`);

//     if (res.data.msg === 'success') {
//       // quick sort language
//       var languages = res.data.result;
//     }
//     return languages;
//   } catch (err) {
//     console.log(err);
//     return [];
//   }
//};
