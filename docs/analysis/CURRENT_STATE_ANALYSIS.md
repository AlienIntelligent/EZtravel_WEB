# CURRENT STATE ANALYSIS

## Audit Hiện Trạng Hệ Thống

Dựa trên kết quả phân tích mã nguồn (Project Intelligence) hiện tại:

### 1. Impacted Modules
- `src/modules/provider/ServicesManager.jsx`: Nơi liệt kê và quản lý các loại dịch vụ (Hotel, Restaurant, Activity, Vehicle). Đang có nút Thêm/Sửa bị vô hiệu hóa hoặc chưa có body hoàn chỉnh.
- `src/modules/provider/components/ServiceFormModal.jsx`: Form tạo và sửa thông tin dịch vụ. Đã có cấu trúc code cơ bản nhưng cần hoàn thiện Data Mapping, Submit Logic, Validation và Error Handling.

### 2. Impacted Routes
- `/provider/services`: Màn hình Quản lý Dịch vụ. Route này đã được bảo vệ bởi `RoleGuard` (PROVIDER). Không cần khai báo mới.

### 3. Impacted APIs
- `useSearchProviderServicesQuery` (Đang sử dụng để fetch list)
- `useCreateProviderServiceMutation` (Đã được hook trong `ServicesManager.jsx` nhưng cần được verify form data submit)
- `useUpdateProviderServiceMutation` (Tương tự)
- `useDeleteProviderServiceMutation` (Đang hoạt động)
*Lưu ý: Backend API đã có đủ CRUD cho cả 4 loại.*

### 4. Impacted DTOs
- `HotelCreateRequest`, `HotelUpdateRequest`
- `RestaurantCreateRequest`, `RestaurantUpdateRequest`
- `ActivityCreateRequest`, `ActivityUpdateRequest`
- `VehicleCreateRequest`, `VehicleUpdateRequest`
Các DTO này quy định payload đẩy lên Backend. Frontend phải map đúng các trường.

### 5. Impacted Components
- Component `ServiceFormModal.jsx` (Modal wrapper).
- Các thẻ input, select, validation labels bên trong Modal.

**Kết luận Phase 1:** Khu vực cần thực thi (Execution Area) được giới hạn tĩnh trong vùng `src/modules/provider/`. Không cần tạo mới API hay chỉnh sửa Global State/Routes.
