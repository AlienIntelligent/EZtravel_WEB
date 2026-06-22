# SPRINT 6 UI SPECIFICATION

## 1. Màn hình Quản lý Gói cước (Admin Package Manager)
**File**: `src/modules/admin/PackageManager.tsx`

### Layout
- Dùng `AdminLayout`.
- Tiêu đề trang: **Quản lý Gói cước Nhà Cung Cấp**.

### Header Statistics
Hiển thị 4 KPIs từ API `/statistics` (Component: Grid/Cards):
- **Total Providers**: Tổng NCC.
- **Active Packages**: Tổng gói đang hoạt động.
- **Expired Packages**: Tổng gói hết hạn.
- **Phân loại**: Free / Standard / Premium.

### Data Table
- Lấy từ `/providers`.
- Các cột:
  - Tên Doanh Nghiệp
  - Gói Hiện Tại (TenGoiHienTai)
  - Trạng Thái (TrangThaiGoi - ACTIVE/EXPIRED/NONE)
  - Ngày Hết Hạn
  - Thao Tác (Button Group)

### Actions (Modals/Dialogs)
- **Cấp gói**: Mở modal chọn gói cước (từ `/packages`) và chọn thời hạn (MONTH/YEAR). Gọi API `/assign`.
- **Gia hạn**: Mở modal chọn ngày hết hạn mới. Gọi API `/extend`.
- **Hủy/Hết hạn**: Dialog xác nhận. Gọi API `/expire`.
- **Chi tiết NCC**: Modal xem lịch sử gói cước và lịch sử thanh toán (`/providers/{id}`).

## 2. Màn hình Xem trước Quảng bá (Promotions Preview)
**File**: `src/modules/admin/PromotionsPreview.tsx`

### Layout
- Dùng `AdminLayout`.
- Tiêu đề: **Xem trước Hiển thị Quảng bá**.

### UI Component
- Hiển thị danh sách hoặc dạng grid các NCC có gói quảng bá (`/promotions-preview`).
- Hiển thị rõ các thông tin:
  - Tên NCC
  - Current Package
  - Badge Type (`VERIFIED_PARTNER`, `PREMIUM_PARTNER`, `NONE`)
  - Promotion Score (Package Priority)
- Component chỉ mang tính Read-only, không có action sửa/xóa ở màn hình này.

