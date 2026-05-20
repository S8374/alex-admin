import { baseApi } from "./baseApi";

export const agreementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all agreement documents
    getAllAgreementDocs: builder.query({
      query: () => ({
        url: "/admin/agreement-document",
        method: "GET",
      }),
      providesTags: ["Agreement"],
    }),

    // CREATE a new agreement document
    createAgreementDoc: builder.mutation({
      query: (data) => ({
        url: "/admin/agreement-document",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agreement"],
    }),

    // UPDATE an existing agreement document
    updateAgreementDoc: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/agreement-document/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Agreement"],
    }),

    // DELETE an agreement document
    deleteAgreementDoc: builder.mutation({
      query: (id: string) => ({
        url: `/admin/agreement-document/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Agreement"],
    }),
  }),
});

export const {
  useGetAllAgreementDocsQuery,
  useCreateAgreementDocMutation,
  useUpdateAgreementDocMutation,
  useDeleteAgreementDocMutation,
} = agreementApi;
