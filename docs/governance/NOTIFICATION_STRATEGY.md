# NOTIFICATION STRATEGY

Dựa trên kết quả từ Phase 0 (Dependency Audit xác nhận `sweetalert2` đã được cài đặt sẵn), chiến lược hiển thị Notification cho Sprint 01 sẽ sử dụng SweetAlert2 để đảm bảo UX/UI đồng nhất.

## 1. Delete Confirmation
- **Phương thức:** `Swal.fire`
- **Giao diện:** Alert hộp thoại cảnh báo (Warning icon).
- **Behavior:** Hiển thị nút "Xác nhận xóa" và "Hủy". Dừng tiến trình gọi API nếu user chọn Hủy.

## 2. Success Notification (Create / Update / Delete)
- **Phương thức:** `Swal.fire`
- **Giao diện:** Icon Success.
- **Behavior:** Popup thông báo thành công (ví dụ: "Cập nhật dịch vụ thành công!"), có thể tự động đóng (timer) hoặc yêu cầu bấm OK để refresh data.

## 3. Error Notification
- **Phương thức:** `Swal.fire`
- **Giao diện:** Icon Error.
- **Behavior:** Hiển thị chi tiết Error Message trả về từ Backend (ưu tiên đọc `error.data.message` hoặc `error.message`), fallback về "Có lỗi xảy ra, vui lòng thử lại." nếu không bắt được lý do cụ thể.
