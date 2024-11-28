import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * This is for fetchBaseQuery
 * @returns function
 */
export const getBaseQuery = () => {
  return fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json');
      return headers;
    }
  });
};
