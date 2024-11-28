import { createApi } from '@reduxjs/toolkit/query/react';
import { getBaseQuery } from 'common/helpers';
import {
  ICertificatesChangeImage,
  ICertificatesCopyTemp,
  ICertificatesCreateTemp,
  ICertificatesEditTemp,
  ICertificatesGenerate,
  ICertificatesImageId,
  ICertificatesTempId,
  ICertificatesTempList,
  ICertificationList,
  ICertificationPreview,
  IDeleteFileCertificate,
  IGetCheckNameCertificate,
  IGetUsersCourse,
  IUploadFileCertificate
} from 'types/tempCertificates.api';

export const tempCertificatesApi = createApi({
  reducerPath: 'tempCertificatesApi',
  baseQuery: getBaseQuery(),
  tagTypes: ['tempCertificates', 'certificatesList'],
  endpoints: ({ query, mutation }) => ({
    getListTempCertificates: query<ICertificatesTempList.Response, ICertificatesTempList.Params>({
      query: ({ currentPage = 1, pageSize = 10, search, onlyMine, isReady }) => {
        const params: any = {
          currentPage,
          pageSize
        };

        if (search) {
          params.search = search;
        }

        if (onlyMine !== undefined) {
          params.onlyMine = onlyMine;
        }

        if (isReady !== undefined) {
          params.isReady = isReady;
        }

        return {
          url: `/api/test/xxx`,
          params,
          keepUnusedDataFor: 0
        };
      },
      providesTags: ['tempCertificates']
    }),
    getTempCertificateId: query<ICertificatesTempId.Response, ICertificatesTempId.Params>({
      query: ({ id }) => ({
        url: `/api/test/xxx/${id}`,
        keepUnusedDataFor: 0
      })
    }),
    editTempCertificate: mutation<ICertificatesEditTemp.Response, ICertificatesEditTemp.Params>({
      query: (body) => ({
        url: `/api/test/xxx`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['tempCertificates']
    }),
    createTempCertificates: mutation<ICertificatesCreateTemp.Response, ICertificatesCreateTemp.Params>({
      query: (body) => ({
        url: `/api/test/xxx`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['tempCertificates']
    }),
    deleteTempCertificates: mutation<ICertificatesTempId.Response, ICertificatesTempId.Params>({
      query: ({ id }) => ({
        url: `/api/test/xxx/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['tempCertificates']
    }),
    copyTempCertificates: mutation<ICertificatesCopyTemp.Response, ICertificatesCopyTemp.Params>({
      query: ({ id, title }) => ({
        url: `/api/test/xxx`,
        method: 'POST',
        body: { id, title }
      }),
      invalidatesTags: ['tempCertificates']
    }),
    getTempCertificateImageId: query<ICertificatesImageId.Response, ICertificatesImageId.Params>({
      query: ({ id }) => ({
        url: `/api/test/xxx/${id}`
      })
    }),
    addTempCertificateImage: mutation<ICertificatesChangeImage.Response, ICertificatesChangeImage.Params>({
      query: ({ file }) => ({
        url: '/api/test/xxx',
        method: 'POST',
        body: file
      })
    }),
    deleteTempCertificateImage: mutation<ICertificatesImageId.Response, ICertificatesImageId.Params>({
      query: ({ id }) => ({
        url: `/api/test/xxx/${id}`,
        method: 'DELETE'
      })
    }),
    postPreviewTempCertificates: mutation<ICertificationPreview.Response, ICertificationPreview.Params>({
      query: (body) => ({
        url: '/api/test/xxx',
        method: 'POST',
        body,
        responseHandler: (response) => response.blob()
      })
    }),
    getCertificateList: query<ICertificationList.Response, ICertificationList.Params>({
      query: ({ trainingId, order = 0, currentPage = 1, pageSize = 10, search }) => {
        const params: any = {
          trainingId,
          order,
          currentPage,
          pageSize
        };

        if (search) {
          params.search = search;
        }

        return {
          url: '/api/test/xxx',
          params,
          keepUnusedDataFor: 0
        };
      },
      providesTags: ['certificatesList']
    }),
    getCheckNameCertificate: query<IGetCheckNameCertificate.Response, IGetCheckNameCertificate.Params>({
      query: ({ title }: { title: string }) => ({
        url: '/api/test/xxx',
        params: { title }
      })
    }),
    postFileCertificate: mutation<IUploadFileCertificate.Response, IUploadFileCertificate.Params>({
      query: (body) => ({
        url: '/api/test/xxx',
        method: 'POST',
        body
      }),
      invalidatesTags: ['certificatesList']
    }),
    deleteFileCertificate: mutation<IDeleteFileCertificate.Response, IDeleteFileCertificate.Params>({
      query: ({ id }) => ({
        url: `/api/test/xxx/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['certificatesList']
    }),
    postCertificatesGenerate: mutation<ICertificatesGenerate.Response, ICertificatesGenerate.Params>({
      query: (body) => ({
        url: '/api/test/xxx',
        method: 'POST',
        body
      }),
      invalidatesTags: ['certificatesList']
    }),
    getUsersCourse: mutation<IGetUsersCourse.Response, IGetUsersCourse.Params>({
      query: ({ id }) => ({
        url: `/api/test/xxx/${id}/list`,
        method: 'POST'
      })
    })
  })
});

export const {
  useGetListTempCertificatesQuery,
  useGetTempCertificateIdQuery,
  useCreateTempCertificatesMutation,
  useDeleteTempCertificatesMutation,
  useCopyTempCertificatesMutation,
  useGetTempCertificateImageIdQuery,
  useAddTempCertificateImageMutation,
  useDeleteTempCertificateImageMutation,
  useEditTempCertificateMutation,
  usePostPreviewTempCertificatesMutation,
  useGetCertificateListQuery,
  usePostFileCertificateMutation,
  useDeleteFileCertificateMutation,
  usePostCertificatesGenerateMutation,
  useGetUsersCourseMutation,
  useLazyGetCheckNameCertificateQuery
} = tempCertificatesApi;
