# FEED DETAIL AUDIT

## Xác minh Phương thức Triển khai
Quá trình audit mã nguồn `FeedCard.jsx` (được tạo ra trong đợt triển khai Sprint 02) cho thấy tính năng xem chi tiết Feed (Feed Detail) được triển khai theo mô hình: **Expand Card**.

### Cách hoạt động:
1. **Không có Dedicated Route:** Giao diện không điều hướng sang URL mới (như `/community/feed/123`).
2. **Không dùng Modal / Drawer:** Giao diện không bật popup chắn ngang màn hình.
3. **Sử dụng Expand Card (Mở rộng thẻ):** 
   - Trên mỗi đối tượng `FeedCard`, khi User click vào biểu tượng Bình luận (MessageCircle button).
   - Component sẽ đổi state `setShowComments(true)`.
   - Phần không gian phía dưới của Card sẽ mở rộng (expand) để tải và hiển thị danh sách `comments` tương ứng thông qua API `useGetTripCommentsQuery`.
   - Form nhập bình luận (Input + Submit Button) xuất hiện ngay bên dưới danh sách.

### Đánh giá Ưu nhược điểm:
- **Ưu điểm:** Giữ trải nghiệm người dùng liền mạch (seamless), User không bị mất ngữ cảnh (context) khi xem bảng tin. Họ có thể vừa đọc comment bài viết này vừa lướt các bài viết khác.
- **Nhược điểm:** Không có URL chia sẻ cụ thể cho từng bài viết đơn lẻ. 

**TỔNG KẾT:** Quyết định dùng **Expand Card** là hợp lý cho một trang Community Feed mang tính chất bảng tin lướt nhanh. Đạt chuẩn yêu cầu của Sprint 02.
