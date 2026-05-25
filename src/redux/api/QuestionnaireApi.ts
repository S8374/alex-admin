import { baseApi } from "./baseApi";

export const questionnaireApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET active questionnaire
    getActiveQuestionnaire: builder.query({
      query: () => ({
        url: "/admin/questionnaire/active",
        method: "GET",
      }),
      providesTags: ["Questionnaire"],
    }),

    // GET questionnaire by application ID
    getQuestionnaireByApplication: builder.query({
      query: (applicationId: string) => ({
        url: `/admin/questionnaire/application/${applicationId}`,
        method: "GET",
      }),
      providesTags: ["Questionnaire"],
    }),

    // CREATE/INIT questionnaire
    initQuestionnaire: builder.mutation({
      query: (data: { topicTitle: string; description: string; disclaimerText?: string; disclaimerLabel?: string }) => ({
        url: "/admin/questionnaire",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Questionnaire"],
    }),

    // UPDATE questionnaire
    updateQuestionnaire: builder.mutation({
      query: ({ id, ...data }: { id: string; topicTitle?: string; description?: string; disclaimerText?: string; disclaimerLabel?: string }) => ({
        url: `/admin/questionnaire/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Questionnaire"],
    }),

    // DELETE questionnaire
    deleteQuestionnaire: builder.mutation({
      query: (id: string) => ({
        url: `/admin/questionnaire/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questionnaire"],
    }),

    // ADD question to questionnaire
    addQuestion: builder.mutation({
      query: (data: { 
        questionnaireId: string; 
        questionText: string; 
        category: string; 
        isInputRequired: boolean; 
        isDocumentNeeded: boolean 
      }) => ({
        url: "/admin/questionnaire/question",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Questionnaire"],
    }),

    // UPDATE question
    updateQuestion: builder.mutation({
      query: ({ id, ...data }: { id: string; questionText?: string; category?: string; isInputRequired?: boolean; isDocumentNeeded?: boolean }) => ({
        url: `/admin/questionnaire/question/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Questionnaire"],
    }),

    // DELETE question
    deleteQuestion: builder.mutation({
      query: (id: string) => ({
        url: `/admin/questionnaire/question/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questionnaire"],
    }),

    // ADD nested question
    addNestedQuestion: builder.mutation({
      query: (data: { 
        questionId: string; 
        questionText: string; 
        inputLebleText: string; 
        isInputRequired: boolean; 
        isDocumentNeeded: boolean 
      }) => ({
        url: "/admin/questionnaire/nested-question",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Questionnaire"],
    }),

    // UPDATE nested question
    updateNestedQuestion: builder.mutation({
      query: ({ id, ...data }: { id: string; questionText?: string; inputLebleText?: string; isInputRequired?: boolean; isDocumentNeeded?: boolean }) => ({
        url: `/admin/questionnaire/nested-question/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Questionnaire"],
    }),

    // DELETE nested question
    deleteNestedQuestion: builder.mutation({
      query: (id: string) => ({
        url: `/admin/questionnaire/nested-question/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Questionnaire"],
    }),
  }),
});

export const {
  useGetActiveQuestionnaireQuery,
  useGetQuestionnaireByApplicationQuery,
  useInitQuestionnaireMutation,
  useUpdateQuestionnaireMutation,
  useDeleteQuestionnaireMutation,
  useAddQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useAddNestedQuestionMutation,
  useUpdateNestedQuestionMutation,
  useDeleteNestedQuestionMutation,
} = questionnaireApi;
