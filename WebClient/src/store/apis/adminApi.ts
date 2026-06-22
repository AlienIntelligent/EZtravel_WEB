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
    deleteCategory: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
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
  useUpdateProviderStatusMutation,
  useGetAdminProviderPackagesQuery,
  useCreateAdminProviderPackageMutation,
  useUpdateAdminProviderPackageMutation,
  useUpdateAdminProviderPackageStatusMutation,
  useGetModerationItemsQuery,
  useResolveModerationItemMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} = adminApi;
