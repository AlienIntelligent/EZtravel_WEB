import { baseApi } from "../../api/baseApi";

export type ProviderServiceCategory =
  | "hotels"
  | "restaurants"
  | "activities"
  | "vehicles";

export interface ProviderServiceSearchParams {
  category?: ProviderServiceCategory;
  providerId?: number;
  keyword?: string;
}

export interface ProviderServiceDto {
  id?: number;
  maDichVu?: number;
  maKhachSan?: number;
  maNhaHang?: number;
  maHoatDong?: number;
  maPhuongTien?: number;
  tenDichVu?: string;
  tenKhachSan?: string;
  tenNhaHang?: string;
  tenHoatDong?: string;
  tenPhuongTien?: string;
  name?: string;
  moTa?: string;
  description?: string;
  diaChi?: string;
  address?: string;
  giaThamKhao?: number;
  price?: number;
  trangThai?: string;
  status?: string;
  maNhaCungCap?: number;
  providerId?: number;
  ngayTao?: string;
  createdAt?: string;

  // Added specific fields
  maDiaDiem?: number;
  tenDiaDiem?: string;
  anhDaiDien?: string;
  soSao?: number;
  giaTu?: number;
  giaDen?: number;
  maLoaiAmThuc?: number;
  giaTrungBinh?: number;
  gia?: number;
  thoiLuong?: string;
  loaiPhuongTien?: string;
  hangXe?: string;
  soChoNgoi?: number;
  diemKhoiHanh?: string;
  diemDen?: string;
}

export type ProviderServicePayload = Record<string, unknown>;

export interface CreateProviderServiceArgs {
  category: ProviderServiceCategory;
  body: ProviderServicePayload;
}

export interface UpdateProviderServiceArgs {
  category: ProviderServiceCategory;
  id: number;
  body: ProviderServicePayload;
}

export interface DeleteProviderServiceArgs {
  category: ProviderServiceCategory;
  id: number;
}

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchProviderServices: builder.query<
      ProviderServiceDto[],
      ProviderServiceSearchParams
    >({
      query: ({ category, providerId, keyword }) => {
        const params = new URLSearchParams();
        if (category) {
          params.append("category", category);
        }

        if (providerId !== undefined) {
          params.append("maNhaCungCap", providerId.toString());
        }

        if (keyword && keyword.trim().length > 0) {
          params.append("keyword", keyword.trim());
        }

        const queryString = params.toString();

        return {
          url: `/provider/services${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response: any) =>
        Array.isArray(response) ? response : response?.items || response?.data || [],
      providesTags: ["Service"],
    }),

    createProviderService: builder.mutation<
      ProviderServiceDto,
      CreateProviderServiceArgs
    >({
      query: ({ category, body }) => ({
        url: "/provider/services",
        method: "POST",
        body: { ...body, category },
      }),
      invalidatesTags: ["Service", "Provider"],
    }),

    updateProviderService: builder.mutation<
      ProviderServiceDto,
      UpdateProviderServiceArgs
    >({
      query: ({ category, id, body }) => ({
        url: `/provider/services/${id}`,
        method: "PUT",
        body: { ...body, category },
      }),
      invalidatesTags: ["Service", "Provider"],
    }),

    deleteProviderService: builder.mutation<
      { success?: boolean; id?: number; maDichVu?: number; status?: string; trangThai?: string },
      DeleteProviderServiceArgs
    >({
      query: ({ id }) => ({
        url: `/provider/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service", "Provider"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSearchProviderServicesQuery,
  useCreateProviderServiceMutation,
  useUpdateProviderServiceMutation,
  useDeleteProviderServiceMutation,
} = serviceApi;
