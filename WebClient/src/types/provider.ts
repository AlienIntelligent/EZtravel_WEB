export interface PackageDto {
  maGoiNcc: number;
  tenGoi: string;
  moTa?: string;
  giaThang: number;
  giaNam: number;
  heSoUuTien: number;
  uuTienTimKiem: boolean;
  uuTienAi: boolean;
  uuTienTrangChu: boolean;
  coBadgeDoiTac: boolean;
  trangThai: boolean;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface RegisterPackageRequest {
  maGoiNcc: number;
  durationType: "MONTH" | "YEAR" | string;
  phuongThucThanhToan?: string;
}

export interface CurrentPackageDto {
  maDangKyGoiNcc: number;
  maGoiNcc: number;
  tenGoi: string;
  moTa?: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai: string;
  heSoUuTien: number;
  uuTienTimKiem: boolean;
  uuTienAi: boolean;
  uuTienTrangChu: boolean;
  coBadgeDoiTac: boolean;
}

export interface PackageHistoryDto {
  maDangKyGoiNcc: number;
  maGoiNcc: number;
  tenGoi: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai: string;
  ngayTao: string;
  giaDaThanhToan: number;
}

export interface PaymentHistoryDto {
  maThanhToanNcc: number;
  maDangKyGoiNcc: number;
  tenGoi: string;
  soTien: number;
  phuongThucThanhToan: string;
  maGiaoDich?: string;
  trangThai: string;
  ngayThanhToan?: string;
  ngayTao: string;
}

export interface ProviderPromotionDto {
  providerId: number;
  providerName: string;
  currentPackage?: string;
  packagePriority: number;
  badgeType: string;
  rating: number;
  avatar?: string;
  coverImage?: string;
}
