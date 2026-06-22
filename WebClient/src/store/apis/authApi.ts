import { baseApi } from "../../api/baseApi";
import { User } from "../../shared/types/user";

export interface LoginRequest {
  email: string;
  matKhau: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  matKhau: string;
  hoTen: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: any) => {
        const data = response.data || response;
        return {
          token: data.token,
          user: {
            id: data.userId?.toString(),
            fullName: data.name || "",
            email: data.email,
            role: data.role ? data.role.toUpperCase() : "TRAVELER",
            avatarUrl: data.avatar || "",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
    }),
    register: builder.mutation<any, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    verifyOtp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    resendOtp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.query<any, void>({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    refreshSession: builder.mutation<LoginResponse, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      transformResponse: (response: any) => {
        const data = response.data || response;
        return {
          token: data.token,
          user: {
            id: data.userId?.toString(),
            fullName: data.name || "",
            email: data.email,
            role: data.role ? data.role.toUpperCase() : "TRAVELER",
            avatarUrl: data.avatar || "",
            status: "ACTIVE",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
    }),
    logoutSession: builder.mutation<any, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    updateProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/profile/password",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    updateAvatar: builder.mutation<any, any>({
      query: (body) => ({
        url: "/profile/avatar",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRefreshSessionMutation,
  useLogoutSessionMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
} = authApi;
