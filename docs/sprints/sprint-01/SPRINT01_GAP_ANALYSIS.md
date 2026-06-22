# SPRINT 01 GAP ANALYSIS

So sánh đối chiếu toàn diện (Database vs Backend vs Frontend vs CRD) dành riêng cho phạm vi "Provider Service UI Completion".

## 1. READY (Sẵn sàng)
- **Database Schema**: Bảng `KhachSan`, `NhaHang`, `HoatDong`, `PhuongTien` có đầy đủ trường thông tin.
- **Backend APIs**: Controllers đã xây dựng đầy đủ `POST` (Create) và `PUT` (Update) endpoints cho cả 4 loại dịch vụ.
- **Frontend State Management**: Redux/RTK Query mutations (`useCreateProviderServiceMutation`, `useUpdateProviderServiceMutation`) đã được khai báo và xuất sẵn sàng tại `serviceApi.ts`.
- **Frontend Foundation**: File Component Container (`ServicesManager.jsx`) và Form Modal (`ServiceFormModal.jsx`) đã tồn tại trên thư mục.

## 2. BLOCKED (Bị chặn)
- **0 Blockers.** Không có bất kỳ sự thiếu hụt nào từ Backend, Database, hay Design System có khả năng cản trở tiến độ của Sprint này.

## 3. MISSING (Còn thiếu / Cần code)
- **UI Interaction**: Nút "Thêm dịch vụ" và Nút "Sửa" trên `ServicesManager.jsx` cần gỡ bỏ trạng thái `disabled` (hoặc các logic ngăn chặn) để kích hoạt Modal.
- **Form Data Logic**: Hàm `handleSubmitModal` tại `ServicesManager.jsx` và hàm xử lý `onSubmit` bên trong `ServiceFormModal.jsx` cần bắt lỗi (Error Catching), hiển thị Loading State UI (thay đổi text/màu nút bấm), và feedback cho người dùng khi tạo/sửa thành công (Success Toast/Alert).
- **Validation**: Bổ sung validation hiển thị lỗi ngay trên Form dựa trên Payload DTO Contracts của Backend (ví dụ: required fields, giới hạn min/max).

## 4. TECHNICAL DEBT (Nợ kỹ thuật)
- Code tại `ServiceFormModal.jsx` đang sử dụng `eslint-disable no-unused-vars, react-hooks/set-state-in-effect`. Trong tương lai cần xử lý useEffect gọn gàng hơn.
- Cấu trúc file tách biệt Form cho 4 loại dịch vụ vào cùng 1 file `ServiceFormModal.jsx` khiến code có xu hướng phình to. (Lưu ý: Sprint này sẽ không refactor, chỉ tiếp tục trên nền code sẵn có).

**Kết luận chung:**
- READY = TRUE
- BLOCKED = 0
Đủ điều kiện chuyển tiếp sang Phase 5 (Implementation Plan).
