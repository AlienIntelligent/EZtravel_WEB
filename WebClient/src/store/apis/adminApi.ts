import { baseApi } from "../../api/baseApi";

export interface AdminProviderPackage {
  id: number;
  name: string;
  description?: string | null;
  monthlyPrice: number;
  annualPrice: number;
  priorityCoefficient: number;
  searchPriority: boolean;
  aiPriority: boolean;
  homePriority: boolean;
  partnerBadge: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProviderPackageInput = Omit<
  AdminProviderPackage,
  "id" | "isActive" | "createdAt" | "updatedAt"
>;

export interface AdminDashboardDto {
  totalUsers: number;
  totalTrips: number;
  totalBookings: number;
  totalRevenue: number;
}

export interface AdminUserDto {
  id: number;
  hoTen: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface LockUserResponse {
  success?: boolean;
  message?: string;
}

// NOTE: apiClient already has baseURL='/api', so endpoints use /admin/... NOT /api/admin/...
export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUsers: builder.query<AdminUserDto[], void>({
      query: () => ({
        url: "/admin/users",
        method: "GET",
      }),
      providesTags: ["User", "Admin"],
    }),
    updateUserStatus: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}/status`,
        method: "PUT",
        body,
      }),
    }),
    updateUserRole: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}/role`,
        method: "PUT",
        body,
      }),
    }),
    getAdminStats: builder.query<any, void>({
      query: () => ({
        url: "/admin/stats",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getAdminAlerts: builder.query<any, void>({
      query: () => ({
        url: "/admin/alerts",
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),
    getPendingProviders: builder.query<any, void>({
      query: () => ({
        url: "/admin/providers/pending",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Admin", "Provider"],
    }),
    updateProviderStatus: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/providers/${id}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin", "Provider", "User"],
    }),
    getAdminProviderPackages: builder.query<AdminProviderPackage[], void>({
      query: () => ({
        url: "/admin/provider-packages",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Admin", "Provider"],
    }),
    createAdminProviderPackage: builder.mutation<any, ProviderPackageInput>({
      query: (body) => ({
        url: "/admin/provider-packages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin", "Provider"],
    }),
    updateAdminProviderPackage: builder.mutation<
      any,
      { id: number; body: ProviderPackageInput }
    >({
      query: ({ id, body }) => ({
        url: `/admin/provider-packages/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin", "Provider"],
    }),
    updateAdminProviderPackageStatus: builder.mutation<
      any,
      { id: number; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/admin/provider-packages/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["Admin", "Provider"],
    }),
    getModerationItems: builder.query<any, void>({
      query: () => ({
        url: "/admin/moderation",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Admin"],
    }),
    resolveModerationItem: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/moderation/${id}/resolve`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    getCategories: builder.query<any, void>({
      query: () => ({
        url: "/admin/categories",
        method: "GET",
      }),
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Admin"],
    }),
    createCategory: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateCategory: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/categories/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteCategory: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    getAdminPlaces: builder.query<any, void>({
      query: () => ({ url: "/admin/destinations" }),
      providesTags: ["Admin"],
    }),
    createAdminPlace: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/destinations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateAdminPlace: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/destinations/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteAdminPlace: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/destinations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    getAdminBlogs: builder.query<any, void>({
      query: () => ({ url: "/admin/blogs" }),
      providesTags: ["Admin"],
    }),
    createAdminBlog: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/blogs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateAdminBlog: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/blogs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    updateAdminBlogStatus: builder.mutation<any, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/blogs/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteAdminBlog: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    getAdminServices: builder.query<any, void>({
      query: () => ({ url: "/admin/services" }),
      providesTags: ["Admin"],
    }),
    updateAdminServiceStatus: builder.mutation<any, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/services/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Admin"],
    }),
    updateAdminService: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({
        url: `/admin/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
    deleteAdminService: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
    uploadAdminImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "/admin/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useGetAdminStatsQuery,
  useGetAdminAlertsQuery,
  useGetPendingProvidersQuery,
  useGetAllProvidersQuery,
  useUpdateProviderStatusMutation,
  useUpdateProviderMutation,
  useDeleteProviderMutation,
  useGetAdminProviderPackagesQuery,
  useCreateAdminProviderPackageMutation,
  useUpdateAdminProviderPackageMutation,
  useUpdateAdminProviderPackageStatusMutation,
  useGetModerationItemsQuery,
  useResolveModerationItemMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAdminPlacesQuery,
  useCreateAdminPlaceMutation,
  useUpdateAdminPlaceMutation,
  useDeleteAdminPlaceMutation,
  useGetAdminBlogsQuery,
  useCreateAdminBlogMutation,
  useUpdateAdminBlogMutation,
  useUpdateAdminBlogStatusMutation,
  useDeleteAdminBlogMutation,
  useGetAdminServicesQuery,
  useUpdateAdminServiceStatusMutation,
  useUpdateAdminServiceMutation,
  useDeleteAdminServiceMutation,
  useUploadAdminImageMutation,
} = adminApi;
