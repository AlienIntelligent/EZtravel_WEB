# ARCHITECTURE REVIEW

## Provider Domain Architecture

Dựa trên cấu trúc dự án (Project Structure) sau quá trình Migration sang JSX:

### 1. Presentation Layer
- **`ServicesManager.jsx`**: Đóng vai trò là Container Component (Smart Component). Nhiệm vụ fetch dữ liệu list dịch vụ thông qua `useSearchProviderServicesQuery`, kiểm soát State của Tabs (Hotel, Restaurant, Activity, Vehicle), filter local, và trigger Delete mutation.
- **`ProviderLayout.jsx`**: Cung cấp giao diện bộ khung (Sidebar, Topbar) dành riêng cho Provider. Không liên đới trực tiếp đến logic CRUD nhưng bảo đảm UI Flow ổn định.
- **`ServiceFormModal.jsx`**: Đóng vai trò là Presentation Component (Dumb Component / Controlled Form). Nhận data từ `ServicesManager` thông qua props `initialData`, sử dụng `react-hook-form` để validation, và gọi `onSubmit` đẩy payload về phía Manager.

### 2. API Integration Layer
- **`serviceApi.ts`**: Nơi khởi tạo các Endpoint definitions (RTK Query). Các API endpoints cho phép gọi CRUD lên Backend Microservice tương ứng (ví dụ: `POST /api/places/hotels`).
- Architecture pattern hiện tại: **Data Fetching via RTK Query Hooks**. Frontend đóng vai trò Consumer đơn thuần.

### 3. DTO Mapping
- Trong Frontend, DTO (Data Transfer Objects) không được định nghĩa bằng `class` hay `interface` (do đã sang JSX), tuy nhiên Payload truyền vào mutations phải map đúng 1-1 với tham số Backend mong đợi.
- Ví dụ: Thay vì `maDiaDiem`, Backend có thể cần mapping chuẩn (số nguyên), `giaTu`/`giaDen` phải là float/double, v.v. Việc chuyển đổi kiểu dữ liệu trước khi `onSubmit` (parse int, parse float) là bắt buộc tại Form Component.

**Đánh giá Kiến trúc:** Mô hình Component Tách biệt (Smart/Dumb) là tiêu chuẩn và dễ mở rộng. Không có thiết kế sai lệch. Cần giữ nguyên luồng data: `ServiceFormModal` (thu thập) -> `ServicesManager` (gọi Mutation) -> `serviceApi` (Network).
