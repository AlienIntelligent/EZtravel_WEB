# SPRINT 02 IMPLEMENTATION PLAN

Tài liệu kế hoạch triển khai Frontend cho Domain Community & Review Core.

## 1. User Stories
- **US1 (Feed):** Là người dùng, tôi muốn xem danh sách các bài đăng (Feed) từ cộng đồng để tham khảo lịch trình của người khác.
- **US2 (Like/Comment):** Là người dùng đăng nhập, tôi muốn Like và Bình luận vào các chuyến đi (Trip Feeds).
- **US3 (Review):** Là người dùng, tôi muốn xem Đánh giá của một địa điểm/dịch vụ, và tôi có thể viết Đánh giá của riêng mình nếu đã trải nghiệm.
- **US4 (Notification):** Là người dùng, tôi muốn nhận thông báo khi có người tương tác với bài của tôi và đánh dấu đã đọc.

## 2. Acceptance Criteria
- Hiển thị danh sách Feed không báo lỗi mạng, render đủ thông tin (người đăng, like, comment).
- Gọi thành công API Like và cập nhật số Like lập tức (Optimistic UI).
- Gửi Comment thành công, comment mới xuất hiện dưới bài viết.
- Modal/Phần Đánh giá hiển thị số sao trung bình và danh sách nhận xét. Gửi review trả về `200 OK`.
- Dropdown thông báo ở Topbar hiển thị đúng số lượng Unread. Click vào Notification sẽ gọi hàm `MarkAsRead`.

## 3. API Mapping
- `useGetFeedsQuery` -> `GET /api/feeds`
- `useLikeTripMutation` -> `POST /api/feeds/{tripId}/like`
- `useCommentTripMutation` -> `POST /api/feeds/{tripId}/comment`
- `useGetTripCommentsQuery` -> `GET /api/feeds/{tripId}/comments`
- `usePostReviewMutation` -> `POST /api/reviews`
- `useGetReviewsQuery` -> `GET /api/reviews/place/{id}` hoặc `GET /api/reviews/service/{id}`
- `useGetNotificationsQuery` -> `GET /api/notifications`
- `useMarkNotificationReadMutation` -> `POST /api/notifications/{id}/read`

## 4. DTO Mapping
- **Review:** Yêu cầu Frontend tạo form tương ứng với DTO `CreateReviewRequest` (cần mapping rõ `PlaceId`, `ServiceId`, `Rating`, `Content`).
- **Comment:** Payload gửi đi chỉ là 1 chuỗi string `content` đơn giản lấy từ input field.

## 5. Risks
- Các API như Like/Comment chỉ trả về `true/false`, do đó Frontend phải tự manage state nội bộ (Optimistic Update) hoặc gọi Refetch để làm mới giao diện, rủi ro delay mạng làm giảm trải nghiệm.

## 6. Dependencies
- Phụ thuộc hoàn toàn vào hệ thống Authentication (JWT Token) để lấy `userId` truyền lên Header cho các Mutation như Review, Comment, Like.
