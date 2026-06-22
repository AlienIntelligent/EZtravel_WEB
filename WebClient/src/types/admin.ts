import { PackageHistoryDto, PaymentHistoryDto } from "./provider";

export interface ProviderPackageStatistics {
  totalProviders: number;
  activePackages: number;
  expiredPackages: number;
  freeProviders: number;
  standardProviders: number;
  premiumProviders: number;
}

export interface PromotionPreview {
  providerId: number;
  providerName: string;
  packageName?: string;
  badge: string;
  promotionScore: number;
  appearsOnHomepage: boolean;
  appearsOnExplore: boolean;
}

export interface AssignPackageRequest {
  providerId: number;
  maGoiNcc: number;
  durationType: "MONTH" | "YEAR" | string;
}

export interface ExtendPackageRequest {
  providerId: number;
  newEndDate: string;
}

export interface ExpirePackageRequest {
  providerId: number;
}

export interface AdminProviderPackageDto {
  maNhaCungCap: number;
  tenDoanhNghiep: string;
  maGoiNccHienTai?: number;
  tenGoiHienTai?: string;
  trangThaiGoi?: string; // "ACTIVE", "EXPIRED", "NONE"
  ngayBatDau?: string;
  ngayKetThuc?: string;
}

export interface AdminProviderDetailDto {
  maNhaCungCap: number;
  tenDoanhNghiep: string;
  emailLienHe: string;
  soDienThoai: string;
  diaChi?: string;
  trangThaiProvider: string;
  packageHistory: PackageHistoryDto[];
  paymentHistory: PaymentHistoryDto[];
}
