import { baseApi } from "../../api/baseApi";
import { ProviderPromotionDto } from "../../types/provider";

export const exploreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getRegions: builder.query<any, void>({
      query: () => ({
        url: "/categories/regions",
        method: "GET",
      }),
    }),
    getTags: builder.query<any, void>({
      query: () => ({
        url: "/categories/tags",
        method: "GET",
      }),
    }),
    getExploreGrid: builder.query<any, any>({
      query: (params) => ({
        url: "/explore",
        method: "GET",
        params,
      }),
    }),
    getDestinationDetails: builder.query<any, number>({
      query: (id) => ({
        url: `/destinations/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Place", id }],
    }),
    getDestinationServices: builder.query<any, number>({
      query: (id) => ({
        url: `/destinations/${id}/services`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Service", id: `destination-${id}` }],
    }),
    getServiceDetails: builder.query<any, number>({
      query: (id) => ({
        url: `/services/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),
    getServiceReviews: builder.query<any, number>({
      query: (id) => ({
        url: `/services/${id}/reviews`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Review", id }],
    }),
    submitServiceReview: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/services/${id}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Service", id },
        { type: "Review", id },
      ],
    }),
    getTrendingDestinations: builder.query<any, void>({
      query: () => ({
        url: "/public/home/trending-destinations",
        method: "GET",
      }),
    }),
    getTrendingTrips: builder.query<any, void>({
      query: () => ({
        url: "/public/home/trending-trips",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRegionsQuery,
  useGetTagsQuery,
  useGetExploreGridQuery,
  useGetDestinationDetailsQuery,
  useGetDestinationServicesQuery,
  useGetServiceDetailsQuery,
  useGetServiceReviewsQuery,
  useSubmitServiceReviewMutation,
  useGetTrendingDestinationsQuery,
  useGetTrendingTripsQuery,
} = exploreApi;
