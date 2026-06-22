import { baseApi } from "../../api/baseApi";

export const plannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrips: builder.query<any, void>({
      query: () => ({
        url: "/trips",
        method: "GET",
      }),
      providesTags: ["Trip"],
    }),
    getTripById: builder.query<any, number>({
      query: (id) => ({
        url: `/trips/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Trip", id }],
    }),
    createTrip: builder.mutation<any, any>({
      query: (body) => ({
        url: "/trips",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Trip"],
    }),
    updateTrip: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/trips/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Trip", id }],
    }),
    cloneTrip: builder.mutation<any, number>({
      query: (id) => ({
        url: `/trips/${id}/clone`,
        method: "POST",
      }),
      invalidatesTags: ["Trip"],
    }),
    deleteTrip: builder.mutation<any, number>({
      query: (id) => ({
        url: `/trips/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Trip"],
    }),
    getTripTimeline: builder.query<any, number>({
      query: (id) => ({
        url: `/trips/${id}/timeline`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Trip", id }],
    }),
    updateTripTimeline: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/trips/${id}/timeline`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Trip", id }],
    }),
    getCollaborators: builder.query<any, number>({
      query: (id) => ({
        url: `/trips/${id}/collaborators`,
        method: "GET",
      }),
    }),
    addCollaborator: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/trips/${id}/collaborators`,
        method: "POST",
        body,
      }),
    }),
    getDashboardStats: builder.query<any, void>({
      query: () => ({
        url: "/traveler/dashboard/stats",
        method: "GET",
      }),
    }),
    getUpcomingTrips: builder.query<any, void>({
      query: () => ({
        url: "/trips/upcoming",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTripsQuery,
  useGetTripByIdQuery,
  useCreateTripMutation,
  useUpdateTripMutation,
  useCloneTripMutation,
  useDeleteTripMutation,
  useGetTripTimelineQuery,
  useUpdateTripTimelineMutation,
  useGetCollaboratorsQuery,
  useAddCollaboratorMutation,
  useGetDashboardStatsQuery,
  useGetUpcomingTripsQuery,
} = plannerApi;
