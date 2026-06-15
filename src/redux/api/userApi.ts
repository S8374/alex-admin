import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserStats: builder.query({
      query: () => "/admin/user-management/stats",
      providesTags: ["users"],
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/admin/user-management",
        params,
      }),
      providesTags: ["users"],
    }),
    getUserById: builder.query({
      query: (id) => `/admin/user-management/${id}`,
      providesTags: (result, error, id) => [{ type: "users", id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/user-management/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
    toggleUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/user-management/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/user-management/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetUserStatsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
} = userApi;
