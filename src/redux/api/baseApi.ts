import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { getApiBaseUrl } from "@/lib/api-base-url";

const baseApiUrl = getApiBaseUrl();

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseApiUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["users", "Agreement", "Storage", "Payment", "Activity", "applications", "Questionnaire", "Conversations", "Messages", "quotes"],
  endpoints: () => ({}),
}); 
