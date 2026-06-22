import { baseApi } from "../../api/baseApi";

export const travelerPackageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTravelerPackages: builder.query<any, void>({
      query: () => ({
        url: "/packages/traveler",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Subscription"],
    }),
    getCurrentTravelerPackage: builder.query<any, void>({
      query: () => ({
        url: "/packages/traveler/current",
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? response ?? null,
      providesTags: ["Subscription"],
    }),
    getTravelerPackageHistory: builder.query<any, void>({
      query: () => ({
        url: "/packages/traveler/history",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Subscription"],
    }),
    subscribeTravelerPackage: builder.mutation<any, { packageId: number }>({
      query: (body) => ({
        url: "/packages/traveler/subscribe-simulated",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription", "User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTravelerPackagesQuery,
  useGetCurrentTravelerPackageQuery,
  useGetTravelerPackageHistoryQuery,
  useSubscribeTravelerPackageMutation,
} = travelerPackageApi;
