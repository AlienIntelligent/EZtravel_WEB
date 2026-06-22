# SPRINT 6 API MAPPING

**Nguồn chân lý**: Backend DTOs (`ezTravel.DTO`) và `adminApi.ts`.

## 1. Admin Provider Packages
Các API của Admin xử lý gói cước NCC (Controller: `AdminProviderPackageController`).

| Chức năng | RTK Query Hook | API Endpoint | Method | DTO Request | DTO Response |
|---|---|---|---|---|---|
| Danh sách NCC | `useGetAdminProvidersQuery` | `/api/admin/provider-packages/providers` | GET | - | `AdminProviderPackageDto[]` |
| Chi tiết NCC | `useGetAdminProviderDetailQuery` | `/api/admin/provider-packages/providers/{id}` | GET | - | `AdminProviderDetailDto` |
| Danh sách gói cước | `useGetAdminPackagesQuery` | `/api/admin/provider-packages/packages` | GET | - | `PackageDto[]` |
| Thống kê gói | `useGetAdminStatisticsQuery` | `/api/admin/provider-packages/statistics` | GET | - | `PackageStatisticsDto` |
| Cấp gói | `useAssignPackageMutation` | `/api/admin/provider-packages/assign` | POST | `AssignPackageRequest` | `{ message }` |
| Gia hạn gói | `useExtendPackageMutation` | `/api/admin/provider-packages/extend` | POST | `ExtendPackageRequest` | `{ message }` |
| Hủy/Hết hạn gói | `useExpirePackageMutation` | `/api/admin/provider-packages/expire` | POST | `ExpirePackageRequest` | `{ message }` |
| Promotion Preview | `useGetAdminPromotionsPreviewQuery` | `/api/admin/provider-packages/promotions-preview` | GET | - | `ProviderPromotionDto[]` |

## 2. Quy tắc áp dụng
- Không tạo thêm API endpoint nào mới.
- Nếu Backend thiếu field, Frontend sẽ hiển thị field đó bằng "—" hoặc ẩn đi.
- Toàn bộ kết nối sử dụng qua API Gateway hoặc Backend URL đã cấu hình (với YARP đang bị dead route một số chỗ thì cần tránh).
