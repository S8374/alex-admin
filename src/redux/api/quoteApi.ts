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
  }),
});

export const {
  useGetAllApplicationsQuery,
  useGetApplicationByIdQuery,
  useSendQuoteMutation,
  useUpdateApplicationStatusMutation,
} = quoteApi;
