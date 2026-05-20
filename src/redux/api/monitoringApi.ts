import { baseApi } from "./baseApi";

export const monitoringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServerMonitoring: builder.query({
      query: () => ({
        url: "/health",
        method: "GET",
      }),
      providesTags: ["Activity"],
    }),
    deleteServerHistory: builder.mutation({
      query: (requestId) => ({
        url: `/health/history/${requestId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),
    deleteSpasicHistory: builder.mutation({
      query: () => ({
        url: `/health/history`,
        method: "DELETE",
      }),
      invalidatesTags: ["Activity"],
    }),
  }),
});

export const {
  useGetServerMonitoringQuery,
  useDeleteServerHistoryMutation,
  useDeleteSpasicHistoryMutation,
} = monitoringApi;
