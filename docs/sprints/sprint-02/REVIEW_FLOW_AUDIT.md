# REVIEW FLOW AUDIT

## 1. Xác minh: Review Create
- Tính năng đăng bài đánh giá (Review Create) đã được hiện thực hóa qua Component `ReviewsSection.jsx`.
- Flow: User chọn số sao (1-5) bằng cách click vào icon Star, nhập nội dung text vào Input, và nhấn Gửi.
- Chặn bảo mật: Component kiểm tra state `isAuthenticated`, sử dụng thư viện `SweetAlert2` để bật Toast/Popup cảnh báo nếu chưa Login hoặc chưa nhập nội dung. 

## 2. Xác minh: Review List
- Danh sách Đánh giá (Review List) được render ngay bên dưới Form nhập.
- Sử dụng Avatar giả lập chữ cái đầu (`review.userName?.charAt(0)`).
- Hiển thị trực quan số sao bằng Component `<Star>`.

## 3. Kiểm tra Mapping: Place Review vs Service Review
Component `ReviewsSection` nhận một prop linh hoạt là `type = "place" | "service"` và `targetId`. Dựa vào logic này:

```javascript
  const placeReviewsQuery = useGetPlaceReviewsQuery(targetId, { skip: type !== "place" });
  const serviceReviewsQuery = useGetServiceReviewsQuery(targetId, { skip: type !== "service" });
```
- Nếu truyền vào `type="place"`, RTK Query sẽ gọi API `GET /api/reviews/place/{id}`.
- Nếu truyền vào `type="service"`, RTK Query sẽ gọi API `GET /api/reviews/service/{id}`.

=> Việc tái sử dụng (Re-use) Component này cho cả 2 thực thể (Địa điểm và Dịch vụ) là chính xác và tiết kiệm mã nguồn.

## 4. Xác minh Payload gửi lên Backend (Review Validation)
Khi Submit Form, payload được đóng gói như sau:
```javascript
  const payload = {
    rating,
    content,
  };
  if (type === "place") payload.placeId = targetId;
  else payload.serviceId = targetId;
```
Payload này khớp hoàn toàn với cấu trúc DTO `CreateReviewRequest` của Backend (yêu cầu các trường `Rating`, `Content`, và Nullable `PlaceId` / `ServiceId`).
Endpoint nhận payload là `POST /api/reviews`.

**TỔNG KẾT:** Review Flow hoạt động 100% khớp với API Contract và đảm bảo tính tái sử dụng cao. Đạt chuẩn.
