import { baseApi } from "../../api/baseApi";
import { PackageDto, CurrentPackageDto, PackageHistoryDto, PaymentHistoryDto, RegisterPackageRequest } from "../../types/provider";

export const providerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerProvider: builder.mutation<any, any>({
      query: (body) => ({
        url: "/provider/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Provider", "User"],
    }),
    uploadDocs: builder.mutation<any, { documentType: string; file: File }>({
      query: ({ documentType, file }) => {
        const body = new FormData();
        body.append("documentType", documentType);
        body.append("file", file);
        return {
        url: "/provider/upload-docs",
        method: "POST",
        body,
        };
      },
      invalidatesTags: ["Provider", "Admin"],
    }),
    getProviderStatus: builder.query<any, void>({
      query: () => ({
        url: "/provider/status",
        method: "GET",
      }),
      providesTags: ["Provider"],
    }),
    getProviderStats: builder.query<any, void>({
      query: () => ({
        url: "/provider/stats",
        method: "GET",
      }),
      providesTags: ["Provider"],
    }),
    getProviderServices: builder.query<any, void>({
      query: () => ({
        url: "/provider/services",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Service"],
    }),
    createProviderService: builder.mutation<any, any>({
      query: (body) => ({
        url: "/provider/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Service", "Provider"],
    }),
    updateProviderService: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/provider/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Service", "Provider"],
    }),
    getProviderReviews: builder.query<any, void>({
      query: () => ({
        url: "/provider/reviews",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
    }),
    replyToReview: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/provider/reviews/${id}/reply`,
        method: "POST",
        body,
      }),
    }),
    getProviderPackages: builder.query<any, void>({
      query: () => ({
        url: "/packages/provider",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Provider"],
    }),
    getCurrentProviderPackage: builder.query<any, void>({
      query: () => ({
        url: "/provider/packages/current",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? response ?? null,
      providesTags: ["Provider"],
    }),
    getPackageHistory: builder.query<any, void>({
      query: () => ({
        url: "/provider/packages/history",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Provider"],
    }),
    getPaymentHistory: builder.query<any, void>({
      query: () => ({
        url: "/provider/packages/payments",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Provider"],
    }),
    simulateSubscription: builder.mutation<any, any>({
      query: (body) => ({
        url: "/provider/packages/subscribe-simulated",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Provider"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterProviderMutation,
  useUploadDocsMutation,
  useGetProviderStatusQuery,
  useGetProviderStatsQuery,
  useGetProviderServicesQuery,
  useCreateProviderServiceMutation,
  useUpdateProviderServiceMutation,
  useGetProviderReviewsQuery,
  useReplyToReviewMutation,
  useGetProviderPackagesQuery,
  useGetCurrentProviderPackageQuery,
  useGetPackageHistoryQuery,
  useGetPaymentHistoryQuery,
  useSimulateSubscriptionMutation,
} = providerApi;
