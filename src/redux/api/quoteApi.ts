// Quote API for Admin Management
import { baseApi } from "./baseApi";

export const quoteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllApplications: builder.query({
      query: () => "/admin/quote-management/applications",
      providesTags: ["applications"],
    }),
    getApplicationById: builder.query({
      query: (id) => `/admin/quote-management/applications/${id}`,
      providesTags: (result, error, id) => [{ type: "applications", id }],
    }),
    sendQuote: builder.mutation({
      query: (data) => ({
        url: "/admin/quote-management/send",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["applications"],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/quote-management/applications/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["applications"],
    }),
    getSentQuotes: builder.query({
      query: () => "/admin/quote-management/quotes",
      providesTags: ["quotes"],
    }),
    deleteQuote: builder.mutation({
      query: (id) => ({
        url: `/admin/quote-management/quotes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["quotes", "applications"],
    }),
    deletePet: builder.mutation({
      query: (id) => ({
        url: `/admin/quote-management/pets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["applications"],
    }),
  }),
});

export const {
  useGetAllApplicationsQuery,
  useGetApplicationByIdQuery,
  useSendQuoteMutation,
  useUpdateApplicationStatusMutation,
  useGetSentQuotesQuery,
  useDeleteQuoteMutation,
  useDeletePetMutation,
} = quoteApi;
