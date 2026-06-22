# SPRINT 01 IMPLEMENTATION PLAN

## 1. Tasks (Các công việc cần thực hiện)

### 1.1 Tối ưu hóa ServicesManager.jsx
- Bổ sung UI Feedback cho hành động Create/Update thành công (Sử dụng thư viện Notification/Toast có sẵn trong dự án hoặc SweetAlert2).
- Thay thế `alert("Có lỗi xảy ra. Vui lòng thử lại.");` bằng giao diện Error Notification chuyên nghiệp, hiển thị rõ error message từ Backend nếu có.
- Tối ưu lại trạng thái Delete (hiện tại đang dùng `window.confirm`). Sẽ chuyển sang dùng Modal Xác nhận thân thiện hơn hoặc SweetAlert2.

### 1.2 Hoàn thiện ServiceFormModal.jsx
- Thêm Loading State cụ thể trên nút Submit ("Đang lưu..." kèm spinner nếu có).
- Bổ sung Regex validation cho trường Ảnh Đại Diện (đảm bảo là URL hợp lệ).
- Đảm bảo form xử lý tốt các số liệu (parse Int/Float chuẩn xác trước khi đẩy lên `onSubmit` payload) -> *Đã có logic convert cơ bản, cần check kỹ để tránh lỗi NaN khi submit ô trống đối với các trường optional*.

## 2. Dependencies
- Bắt buộc phải có `sweetalert2` hoặc hệ thống Toast component (`src/components/ui/toast.jsx`) đã hoạt động.
- Không phụ thuộc vào bất kỳ cập nhật Backend/DB nào.

## 3. Risks
- Các API endpoints có thể ném lỗi 400 Bad Request nếu Payload thiếu trường bắt buộc mà Frontend chưa validate. Rủi ro này sẽ được giảm thiểu bằng việc bổ sung Validation Rules chặt chẽ ở form React Hook Form.

## 4. Acceptance Criteria
- [x] AC-01: Provider thấy danh sách dịch vụ của mình (Đã có sẵn).
- [x] AC-02: Nhấn "Thêm dịch vụ" mở form.
- [ ] AC-03: Tạo mới thành công (Kèm theo thông báo Success rõ ràng).
- [x] AC-04: Nhấn "Sửa" mở form.
- [ ] AC-05: Cập nhật thành công (Kèm thông báo Success rõ ràng).
- [ ] AC-06: Xóa vẫn hoạt động (Xác nhận an toàn, không bị alert thô của browser).
- [x] AC-07: Không thấy dữ liệu NCC khác.
- [x] AC-08: Không phát sinh API mới.
- [x] AC-09: Không sửa Backend.
- [x] AC-10: Không sửa Database.
