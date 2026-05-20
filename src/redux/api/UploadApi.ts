import { baseApi } from "./baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadDocuments: builder.mutation<{ data: { urls: string[] } }, FormData>({
      query: (formData) => ({
        url: "/upload/documents",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadDocumentsMutation } = uploadApi;
