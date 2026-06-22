# SPRINT 6 EXECUTION PLAN

**Mục tiêu**: Hoàn thiện toàn bộ Admin Promotion Platform theo backend hiện có.

## 1. Phạm vi công việc
1. **Admin Package Manager** (US-6.1):
   - Quản lý gói cước NCC. 
   - Thao tác: Cấp gói (`/assign`), Gia hạn (`/extend`), Hủy/Hết hạn (`/expire`).
   - Thống kê gói (`/statistics`).
2. **Admin Promotions Preview** (US-6.2):
   - Preview danh sách NCC được promote trên Homepage và Explore (`/promotions-preview`).
3. **Moderation Coming Soon pages** (US-6.3):
   - Đã hoàn thành ở Sprint 4 (ServiceModeration, BlogModeration, Reports đã chuyển sang Coming Soon).

## 2. Các bước triển khai (Frontend Only)
- **Bước 1**: Cập nhật `src/types/admin.ts` và kiểm tra lại `adminApi.ts` để chắc chắn type khớp backend.
- **Bước 2**: Tạo / cập nhật các components UI cho `PackageManager`.
- **Bước 3**: Tích hợp các RTK hooks `useGetAdminProvidersQuery`, `useAssignPackageMutation`, v.v. vào UI.
- **Bước 4**: Tạo / cập nhật components UI cho `PromotionsPreview` và tích hợp `useGetAdminPromotionsPreviewQuery`.
- **Bước 5**: Kiểm tra toàn bộ UI: Responsive, Loading State, Error State, TypeScript check (`tsc --noEmit`), Lint.
