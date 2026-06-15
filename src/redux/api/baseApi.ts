import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { getApiBaseUrl } from "@/lib/api-base-url";
import { logout as clearAuth } from "../features/authSlice";
import { toast } from "sonner";

const baseApiUrl = getApiBaseUrl();

const baseQuery = fetchBaseQuery({
  baseUrl: baseApiUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Token expired or unauthorized
    const state = api.getState() as RootState;
    if (state?.auth?.token) {
      toast.error("Your login session has expired. Please log in again.", { id: "session-expired" });
    }
    api.dispatch(clearAuth());
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["users", "Agreement", "Storage", "Payment", "Activity", "applications", "Questionnaire", "Conversations", "Messages", "quotes"],
  endpoints: () => ({}),
});
