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
    updatePetCharge: builder.mutation({
      query: ({ petId, newCharge }) => ({
        url: `/admin/payments/pets/${petId}/charge`,
        method: 'PATCH',
        body: { newCharge }
      }),
      invalidatesTags: ["Payment"],
    }),
    updateSubscriptionCharge: builder.mutation({
      query: ({ paymentId, newTotalCharge }) => ({
        url: `/admin/payments/${paymentId}/subscription-charge`,
        method: 'PATCH',
        body: { newTotalCharge }
      }),
      invalidatesTags: ["Payment"],
    })
  }),
});

export const { 
  useGetAllPaymentsQuery, 
  useGetPaymentStatsQuery,
  useUpdatePetChargeMutation,
  useUpdateSubscriptionChargeMutation
} = PaymentApi;
