import { baseApi } from "../../api/baseApi";

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<any, void>({
      query: () => ({ url: "/notifications" }),
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation<any, number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    getCommunityFeed: builder.query<any, void>({
      query: () => ({ url: "/community/feed" }),
    }),
    likeTrip: builder.mutation<any, number>({
      query: (tripId) => ({
        url: `/trips/${tripId}/like`,
        method: "POST",
      }),
      // Optimistic update
      async onQueryStarted(tripId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          communityApi.util.updateQueryData("getCommunityFeed", undefined, (draft: any) => {
            const feed = draft.find((f: any) => f.id === tripId);
            if (feed) {
              feed.isLiked = !feed.isLiked;
              feed.likeCount += feed.isLiked ? 1 : -1;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    getTripComments: builder.query<any[], number>({
      query: (tripId) => ({ url: `/trips/${tripId}/comments` }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: (_result, _error, tripId) => [
        { type: "Community", id: `trip-comments-${tripId}` },
      ],
    }),
    createTripComment: builder.mutation<any, { tripId: number; content: string }>({
      query: ({ tripId, content }) => ({
        url: `/trips/${tripId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (_result, _error, { tripId }) => [
        { type: "Community", id: `trip-comments-${tripId}` },
      ],
    }),
    cloneTrip: builder.mutation<any, number>({
      query: (tripId) => ({
        url: `/trips/${tripId}/clone`,
        method: "POST",
      }),
    }),
    getBlogs: builder.query<any, void>({
      query: () => ({ url: "/blogs" }),
      providesTags: ["Blog"],
    }),
    getBlogDetails: builder.query<any, number>({
      query: (id) => ({ url: `/blogs/${id}` }),
      providesTags: ["Blog"],
    }),
    createBlog: builder.mutation<any, any>({
      query: (body) => ({
        url: "/blogs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blog"],
    }),
    getBlogComments: builder.query<any, number>({
      query: (id) => ({ url: `/blogs/${id}/comments` }),
      providesTags: ["Blog"],
    }),
    createBlogComment: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/blogs/${id}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blog"],
    }),
    getTopBloggers: builder.query<any, void>({
      query: () => ({ url: "/community/top-bloggers" }),
    }),
    followUser: builder.mutation<any, number>({
      query: (id) => ({
        url: `/users/${id}/follow`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useGetCommunityFeedQuery,
  useLikeTripMutation,
  useGetTripCommentsQuery,
  useCreateTripCommentMutation,
  useCloneTripMutation,
  useGetBlogsQuery,
  useGetBlogDetailsQuery,
  useCreateBlogMutation,
  useGetBlogCommentsQuery,
  useCreateBlogCommentMutation,
  useGetTopBloggersQuery,
  useFollowUserMutation,
} = communityApi;
