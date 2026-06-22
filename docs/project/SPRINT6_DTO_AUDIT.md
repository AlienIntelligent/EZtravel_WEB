# SPRINT 6 DTO AUDIT

**Thời gian audit**: Hiện tại
**Nguồn**: Source code Backend (`ezTravel.DTO/Providers/PackageDtos.cs`) vs Source code Frontend (`src/types/admin.ts`, `src/types/provider.ts`).

## 1. DTO Backend
Các DTO từ Backend:
- `AdminProviderPackageDto` (MaNhaCungCap, TenDoanhNghiep, MaGoiNccHienTai, TenGoiHienTai, TrangThaiGoi, NgayBatDau, NgayKetThuc)
- `AdminProviderDetailDto` (MaNhaCungCap, TenDoanhNghiep, EmailLienHe, SoDienThoai, DiaChi, TrangThaiProvider, PackageHistory, PaymentHistory)
- `PackageDto` (MaGoiNcc, TenGoi, MoTa, GiaThang, GiaNam, HeSoUuTien, UuTienTimKiem, UuTienAi, UuTienTrangChu, CoBadgeDoiTac, TrangThai, NgayTao, NgayCapNhat)
- `PackageStatisticsDto` (TotalProviders, ActivePackages, ExpiredPackages, FreeProviders, StandardProviders, PremiumProviders)
- `AdminPromotionPreviewDto` (ProviderId, ProviderName, PackageName, Badge, PromotionScore, AppearsOnHomepage, AppearsOnExplore)
- `AssignPackageRequest` (ProviderId, MaGoiNcc, DurationType)
- `ExtendPackageRequest` (ProviderId, NewEndDate)
- `ExpirePackageRequest` (ProviderId)

## 2. DTO Frontend
Các interface trong Frontend (`src/types/admin.ts` và `src/types/provider.ts`):
- `AdminProviderPackageDto`: Khớp 100% với backend.
- `AdminProviderDetailDto`: Khớp 100% với backend.
- `PackageDto`: Khớp 100% với backend.
- `ProviderPackageStatistics`: Tên interface thay đổi nhưng cấu trúc field (totalProviders, v.v.) khớp 100% với `PackageStatisticsDto`.
- `PromotionPreview`: Tên interface thay đổi nhưng cấu trúc field (providerId, providerName, packageName, badge, promotionScore, appearsOnHomepage, appearsOnExplore) khớp 100% với `AdminPromotionPreviewDto`.
- `AssignPackageRequest`, `ExtendPackageRequest`, `ExpirePackageRequest`: Khớp 100% với backend.

## 3. Chênh lệch
- **Cấu trúc dữ liệu (Fields)**: Không có chênh lệch. (100% Matched).
- **Tên interface**: Frontend dùng tên gọn hơn (`ProviderPackageStatistics` thay vì `PackageStatisticsDto`, `PromotionPreview` thay vì `AdminPromotionPreviewDto`). Điều này KHÔNG ảnh hưởng vì RTK Query hoạt động dựa trên JSON payload.
- **Tài liệu API (10_BACKEND_API_CATALOG.md) có sai sót**: Mô tả API `GET /admin/provider-packages/promotions-preview` trả về `List<ProviderPromotionDto>`, nhưng trong mã nguồn thực tế trả về `List<AdminPromotionPreviewDto>`. Frontend đã tuân thủ mã nguồn Backend (chân lý).

## 4. File cần sửa
- **KHÔNG CẦN SỬA**. Cấu trúc DTO hiện tại ở Frontend đã được define đầy đủ và chính xác 100%.

## 5. Rủi ro
- Hoàn toàn KHÔNG CÓ RỦI RO về mặt cấu trúc dữ liệu. Frontend sẵn sàng để bind data trực tiếp từ API trả về.
