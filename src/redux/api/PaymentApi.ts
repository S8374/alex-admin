import { baseApi } from "./baseApi";

export const PaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPayments: builder.query({
      query: (params) => ({
        url: "/admin/payments",
        params,
      }),
      providesTags: ["Payment"],
    }),
    getPaymentStats: builder.query({
      query: () => "/admin/payments/stats",
      providesTags: ["Payment"],
    }),
  }),
});

export const { 
  useGetAllPaymentsQuery, 
  useGetPaymentStatsQuery 
} = PaymentApi;
