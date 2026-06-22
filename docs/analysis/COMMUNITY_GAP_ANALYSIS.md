# COMMUNITY GAP ANALYSIS

Đối chiếu CRD vs Database vs Backend vs Frontend để đánh giá mức độ khả thi triển khai Sprint 02.

## 1. Mức độ READY (Sẵn sàng 100%)
Các nghiệp vụ sau đây được Backend hỗ trợ hoàn toàn, cấu trúc CSDL đã có, Frontend có thể móc nối API ngay lập tức:

### Review (Đánh giá)
- **Trạng thái:** `READY`
- **Lý do:** API `/api/reviews` (POST, GET by Place, GET by Service) đã tồn tại. Frontend có thể dựng UI sao cho User gửi được Đánh giá và xem Đánh giá.

### Comment (Bình luận)
- **Trạng thái:** `READY`
- **Lý do:** API `/api/feeds/{tripId}/comment` đã tồn tại.

### Community Feed (Bảng tin cộng đồng)
- **Trạng thái:** `READY`
- **Lý do:** API `/api/feeds` và chức năng Like (`/api/feeds/{tripId}/like`) đã tồn tại.

### Notifications (Thông báo)
- **Trạng thái:** `READY`
- **Lý do:** API `/api/notifications` và chức năng Đọc (`/api/notifications/{id}/read`) đã được hỗ trợ.

## 2. Mức độ MISSING / BLOCKED (Thiếu / Bị chặn)
Các nghiệp vụ này KHÔNG THỂ thực hiện do thiếu hụt Backend Core, Frontend buộc phải dừng code theo đúng quy tắc (Database > Backend > Frontend).

### Blog (Bài viết)
- **Trạng thái:** `BLOCKED` (hoặc `MISSING` từ phía Backend).
- **Lý do:** Không có `BlogsController` hay bất kỳ API nào quản lý CRUD cho Blog.

### User Profile (Hồ sơ người dùng Public)
- **Trạng thái:** `BLOCKED`.
- **Lý do:** Thiếu Endpoint để fetch public profile của người dùng khác (chỉ có Admin/Auth nội bộ).

**Kết luận Phase 2:** Sprint 02 sẽ chỉ giới hạn (Scope) trong Review, Comment, Feed, và Notification. Bỏ qua Blog và User Profile.
