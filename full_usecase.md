# EZTravel – Phân tích nghiệp vụ & Full Use Case hệ thống

> Tài liệu tổng hợp và phân tích nghiệp vụ hệ thống hỗ trợ du lịch tự túc EZTravel dựa trên các source được cung cấp.

---

# 1. Tổng quan hệ thống

## 1.1 Giới thiệu

EZTravel là hệ thống hỗ trợ du lịch tự túc giúp người dùng:

* Lập kế hoạch du lịch trực quan.
* Tìm kiếm địa điểm và dịch vụ.
* Tính toán chi phí realtime.
* Đặt dịch vụ trực tiếp.
* Quản lý lịch trình tập trung.
* Chia sẻ trải nghiệm với cộng đồng.

Hệ thống được xây dựng theo định hướng:

* Frontend: ReactJS + Vite + TypeScript + Tailwind + shadcn/ui
* Backend: ASP.NET Core Web API (.NET 8/10)
* Database: SQL Server 2022
* Kiến trúc: Clean Architecture + Monolith + API Gateway

---

# 2. Bài toán nghiệp vụ

## 2.1 Các vấn đề hiện tại

Người dùng du lịch tự túc hiện gặp nhiều vấn đề:

### Phân mảnh dữ liệu

Người dùng phải:

* Xem Google Maps.
* Đặt phòng ở Booking/Agoda.
* Xem review trên Facebook/TikTok.
* Tự ghi chú bằng Excel/Notion.

=> Thiếu một nền tảng tập trung.

### Quản lý lịch trình thủ công

* Không có drag & drop.
* Không tự tính chi phí.
* Không tối ưu tuyến đường.
* Khó chỉnh sửa khi thay đổi kế hoạch.

### Tách biệt giữa kế hoạch và thực tế

* Lịch trình không liên kết booking.
* Không quản lý thanh toán tập trung.
* Không đồng bộ trạng thái dịch vụ.

---

# 3. Mục tiêu hệ thống

## 3.1 Mục tiêu tổng quát

Xây dựng hệ sinh thái số hỗ trợ toàn bộ hành trình du lịch tự túc:

* Khơi nguồn cảm hứng.
* Thiết kế lịch trình.
* Quản lý chi phí.
* Đặt dịch vụ.
* Theo dõi hành trình.
* Chia sẻ cộng đồng.

## 3.2 Mục tiêu cụ thể

### Số hóa lịch trình

* Drag & Drop theo ngày.
* Quản lý điểm đến trực quan.
* Điều hướng realtime.

### Tích hợp bản đồ

* Hiển thị địa điểm.
* Gợi ý tuyến đường.
* Geocoding + Routing.

### Hỗ trợ ra quyết định

* So sánh dịch vụ.
* Tính tổng chi phí.
* Đánh giá & review.

### Kết nối hệ sinh thái

* Booking.
* Thanh toán.
* Email thông báo.

### Cộng đồng hóa

* Clone lịch trình.
* Chia sẻ review.
* Blogger/Content Creator.

---

# 4. Actor hệ thống

| Actor            | Vai trò              |
| ---------------- | -------------------- |
| Guest            | Khách chưa đăng nhập |
| Traveler         | Người dùng chính     |
| Service Provider | Nhà cung cấp dịch vụ |
| Content Creator  | Blogger / Reviewer   |
| Admin            | Quản trị hệ thống    |

---

# 5. Kiến trúc nghiệp vụ

## 5.1 7 nghiệp vụ chính

1. Quản lý tài khoản
2. Lập kế hoạch du lịch
3. Tìm kiếm & khám phá
4. Đặt dịch vụ
5. Quản lý lịch trình
6. Chia sẻ & cộng đồng
7. Quản trị hệ thống

---

# 6. Phân tích Database nghiệp vụ

## 6.1 Các bảng chính

| Bảng                | Ý nghĩa                   |
| ------------------- | ------------------------- |
| NGUOI_DUNG          | Quản lý người dùng        |
| LICH_TRINH          | Chuyến đi                 |
| CHI_TIET_LICH_TRINH | Các điểm trong lịch trình |
| DIA_DIEM            | Địa điểm du lịch          |
| DICH_VU             | Dịch vụ                   |
| DANH_MUC_DICH_VU    | Danh mục dịch vụ          |
| DON_DAT             | Đơn đặt dịch vụ           |
| CHI_TIET_DON_DAT    | Chi tiết đơn đặt          |
| THANH_TOAN          | Thanh toán                |
| DANH_GIA            | Đánh giá                  |
| HINH_ANH            | Ảnh địa điểm/dịch vụ      |
| MA_GIAM_GIA         | Voucher                   |

---

# 7. Full Use Case hệ thống

# 7.1 Nhóm Use Case Authentication

---

## UC001 – Đăng ký

### Actor

* Guest

### Mục tiêu

Tạo tài khoản mới.

### Flow chính

1. Nhập họ tên.
2. Nhập email.
3. Nhập mật khẩu.
4. Nhập số điện thoại.
5. Hệ thống validate.
6. Gửi OTP email.
7. Người dùng nhập OTP.
8. Tạo tài khoản.
9. Sinh JWT token.
10. Redirect Dashboard.

### Validate nghiệp vụ

| Điều kiện | Rule                 |
| --------- | -------------------- |
| Email     | Không trùng          |
| Password  | >= 8 ký tự           |
| Password  | Có hoa + thường + số |
| SĐT       | 10 số                |

### Exception

* OTP hết hạn.
* Email tồn tại.
* OTP sai.
* Spam resend OTP.

### API gợi ý

```http
POST /api/auth/register
POST /api/auth/verify-otp
```

---

## UC002 – Đăng nhập

### Actor

* Traveler
* Admin

### Flow

1. Nhập email.
2. Nhập password.
3. Validate.
4. Check password hash.
5. Sinh JWT.
6. Trả access token + refresh token.

### Rule

* Sai quá 5 lần => khóa tạm 5 phút.
* JWT phải có role claim.
* Refresh token lưu DB/Redis.

### API

```http
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout
```

---

## UC003 – Quên mật khẩu

### Flow

1. Nhập email.
2. Gửi reset token.
3. Click link.
4. Nhập password mới.
5. Update password hash.

### Security

* Token hết hạn 15 phút.
* One-time token.
* Không expose email tồn tại.

---

## UC004 – Cập nhật hồ sơ

### Chức năng

* Update avatar.
* Update profile.
* Update phone.
* Update birthday.

### Rule

* Avatar <= 5MB.
* Chỉ jpg/png/jpeg.

### API

```http
PUT /api/users/profile
POST /api/users/avatar
```

---

# 7.2 Nhóm Use Case Trip Planning (Core Business)

---

## UC005 – Tạo chuyến đi mới

### Actor

* Traveler

### Flow

1. Nhập tên lịch trình.
2. Chọn điểm đến.
3. Chọn ngày bắt đầu.
4. Chọn ngày kết thúc.
5. Nhập số người.
6. Nhập ngân sách.
7. Tạo lịch trình.

### Database liên quan

* LICH_TRINH

### Rule nghiệp vụ

| Rule                 | Mô tả    |
| -------------------- | -------- |
| StartDate <= EndDate | Bắt buộc |
| Không tạo quá khứ    | Validate |
| Budget > 0           | Optional |

### API

```http
POST /api/trips
GET /api/trips/{id}
```

---

## UC006 – Thêm địa điểm theo ngày

### Flow

1. Search địa điểm.
2. Chọn địa điểm.
3. Chọn ngày.
4. Add vào timeline.
5. Tự tính thứ tự.
6. Cập nhật map.
7. Tính lại chi phí.

### Database

* CHI_TIET_LICH_TRINH
* DIA_DIEM
* DICH_VU

### Logic quan trọng

* Auto sort.
* Realtime cost.
* Sync map.
* Avoid duplicate.

### API

```http
POST /api/trips/{id}/locations
```

---

## UC007 – Drag & Drop lịch trình

### Flow

1. Kéo địa điểm.
2. Drop sang vị trí mới.
3. Update thứ tự.
4. Update ngày.
5. Tính lại route.
6. Realtime update UI.

### Rule kỹ thuật

* Transaction DB.
* Optimistic update frontend.
* Rollback nếu lỗi.

### API

```http
PUT /api/trips/{id}/reorder
```

---

## UC008 – Xóa địa điểm khỏi lịch trình

### Flow

1. Chọn item.
2. Confirm delete.
3. Remove item.
4. Reindex thứ tự.
5. Recalculate cost.

### API

```http
DELETE /api/trips/{tripId}/locations/{locationId}
```

---

## UC009 – Clone lịch trình mẫu

### Flow

1. Xem lịch trình công khai.
2. Chọn clone.
3. Copy toàn bộ timeline.
4. Tạo lịch trình mới.

### Rule

* Deep copy.
* Không ảnh hưởng bản gốc.

---

## UC010 – Tính chi phí realtime

### Logic

Tổng chi phí:

```text
Chi phí = Tổng dịch vụ + Vé + Khách sạn + Di chuyển - Voucher
```

### Trigger cập nhật

* Add service.
* Remove service.
* Change quantity.
* Apply voucher.

### Kỹ thuật

* Cache.
* Event-driven.
* Realtime websocket (optional).

---

# 7.3 Nhóm Use Case Search & Discovery

---

## UC011 – Tìm kiếm địa điểm

### Flow

1. Nhập keyword.
2. Filter tỉnh thành.
3. Filter loại hình.
4. Sort.
5. Trả kết quả.

### Search fields

* ten_dia_diem
* mo_ta
* tinh_thanh

### API

```http
GET /api/locations
```

---

## UC012 – Xem chi tiết địa điểm

### Nội dung

* Ảnh.
* Mô tả.
* Map.
* Review.
* Dịch vụ liên quan.

### Database

* DIA_DIEM
* HINH_ANH
* DANH_GIA

---

## UC013 – Tìm kiếm dịch vụ

### Filter

* Giá.
* Rating.
* Danh mục.
* Tỉnh thành.

### Database

* DICH_VU
* DANH_MUC_DICH_VU

---

# 7.4 Nhóm Use Case Booking

---

## UC014 – Đặt dịch vụ

### Flow

1. Chọn dịch vụ.
2. Chọn số lượng.
3. Chọn thời gian.
4. Confirm booking.
5. Tạo đơn.
6. Thanh toán.

### Database

* DON_DAT
* CHI_TIET_DON_DAT
* THANH_TOAN

### Rule

* Check availability.
* Lock slot.
* Timeout payment.

### API

```http
POST /api/bookings
```

---

## UC015 – Thanh toán

### Payment methods

* VNPay.
* MoMo.
* Mock payment.

### Flow

1. Redirect payment gateway.
2. Callback payment.
3. Verify signature.
4. Update payment status.
5. Update booking status.

### Security

* Verify callback.
* Idempotency.
* Log transaction.

### API

```http
POST /api/payments/create
POST /api/payments/callback
```

---

## UC016 – Áp mã giảm giá

### Rule

* Kiểm tra hạn.
* Kiểm tra số lượng.
* Không dùng trùng.

### Database

* MA_GIAM_GIA

---

# 7.5 Nhóm Use Case Community

---

## UC017 – Đăng review

### Flow

1. Chọn địa điểm/dịch vụ.
2. Chọn số sao.
3. Nhập bình luận.
4. Đăng bài.

### Database

* DANH_GIA

### Rule

* 1 user nhiều review được.
* Chống spam.
* Filter toxic content.

---

## UC018 – Chia sẻ lịch trình

### Chức năng

* Public itinerary.
* Share link.
* Community feed.

### Rule

* Owner only.
* Có thể private/public.

---

## UC019 – Blogger đăng bài

### Nội dung

* Review.
* Tips.
* Itinerary mẫu.
* Check-in.

### Mở rộng tương lai

* Markdown editor.
* Rich text.
* SEO.

---

# 7.6 Nhóm Use Case Admin

---

## UC020 – Quản lý người dùng

### Chức năng

* Xem danh sách.
* Khóa tài khoản.
* Phân quyền.
* Soft delete.

### Database

* NGUOI_DUNG

---

## UC021 – Kiểm duyệt nội dung

### Moderation

* Review.
* Blog.
* Hình ảnh.
* Dịch vụ.

### Rule

* Flag inappropriate.
* Audit log.

---

## UC022 – Quản lý địa điểm

### CRUD

* Create.
* Update.
* Delete.
* Upload ảnh.

### Database

* DIA_DIEM
* HINH_ANH

---

## UC023 – Quản lý dịch vụ

### CRUD

* Hotel.
* Restaurant.
* Tour.
* Vé.
* Homestay.

### Database

* DICH_VU
* DANH_MUC_DICH_VU

---

## UC024 – Dashboard thống kê

### Thống kê

* Người dùng.
* Doanh thu.
* Booking.
* Địa điểm hot.
* Tỷ lệ chuyển đổi.

### Kỹ thuật

* Aggregate query.
* Materialized cache.

---

# 8. Thiết kế Service Backend

# 8.1 Định hướng kiến trúc

## Clean Architecture

```text
Presentation Layer
    ↓
Application Layer
    ↓
Domain Layer
    ↓
Infrastructure Layer
```

---

# 8.2 Chia module backend

## Auth Service

### Chức năng

* Register
* Login
* JWT
* Refresh token
* OTP
* Forgot password

### Entity chính

* NGUOI_DUNG

---

## Trip Service

### Core business quan trọng nhất

### Chức năng

* Tạo lịch trình
* Add địa điểm
* Drag & drop
* Tính chi phí
* Clone lịch trình

### Entity

* LICH_TRINH
* CHI_TIET_LICH_TRINH

### Lưu ý cực kỳ quan trọng

* Không để frontend tự tính thứ tự.
* Backend phải validate toàn bộ reorder.
* Dùng transaction khi reorder.
* Tối ưu query vì timeline load rất nhiều.
* Có thể dùng Redis cache.

---

## Location Service

### Chức năng

* Search địa điểm
* Nearby search
* Detail địa điểm
* Image gallery

### Tích hợp

* Google Maps API
* Geocoding
* Directions API

### Lưu ý

* Cache kết quả maps.
* Rate limit Google API.
* Debounce frontend search.

---

## Booking Service

### Chức năng

* Tạo booking
* Quản lý trạng thái
* Cancel booking
* Booking history

### Trạng thái đề xuất

```text
Pending
Paid
Confirmed
Cancelled
Expired
```

### Lưu ý

* Không trust client price.
* Backend phải recalculate total.
* Payment callback phải idempotent.

---

## Payment Service

### Chức năng

* Tạo payment URL
* Verify callback
* Update transaction

### Lưu ý cực quan trọng

* Verify checksum/signature.
* Không update paid nhiều lần.
* Log toàn bộ callback.
* Retry-safe.

---

## Review Service

### Chức năng

* CRUD review
* Rating average
* Spam detection

### Lưu ý

* Chống XSS.
* Sanitize HTML.
* Rate limit comment.

---

## Admin Service

### Chức năng

* User management
* Moderation
* Analytics
* Audit log

---

# 9. Các lưu ý kỹ thuật quan trọng

# 9.1 Authentication & Security

## Password

* Dùng BCrypt.
* Không lưu plain text.

## JWT

* Access token ngắn hạn.
* Refresh token dài hạn.

## Authorization

Role-based access:

```text
Guest
Traveler
Admin
Provider
```

## Security headers

* CORS.
* CSP.
* Rate limit.
* Anti brute force.

---

# 9.2 Database

## Naming convention

* HOA_KHONG_DAU.
* snake_case.

## Soft delete

Dùng:

```sql
DA_XOA BIT
```

## Audit columns

Nên có:

```text
created_at
updated_at
created_by
updated_by
```

## Index quan trọng

### Search

```sql
TEN_DIA_DIEM
TEN_DICH_VU
TINH_THANH
```

### Booking

```sql
MA_NGUOI_DUNG
NGAY_DAT
TRANG_THAI
```

---

# 9.3 Frontend

## State management

Khuyến nghị:

* Zustand.
* TanStack Query.

## Drag & Drop

Khuyến nghị:

* @dnd-kit

## API

* Axios interceptor.
* Auto refresh token.

## UI

* Mobile first.
* Skeleton loading.
* Optimistic UI.

---

# 9.4 Realtime

## Nên dùng cho

* Cộng tác lịch trình.
* Sync timeline.
* Notification.

## Công nghệ

* SignalR.
* WebSocket.

---

# 9.5 Logging

## Backend

* Serilog.
* Request log.
* Exception log.

## Những thứ cần log

* Payment.
* Login.
* Booking.
* Admin action.

---

# 9.6 Testing

## Backend

* xUnit.
* Integration Test.

## Frontend

* Jest.
* React Testing Library.

## Flow bắt buộc test

* Register/Login.
* Create Trip.
* Drag & Drop.
* Booking.
* Payment callback.

---

# 10. API Design Guidelines

# 10.1 RESTful naming

## Good

```http
GET /api/trips
POST /api/trips
PUT /api/trips/1
DELETE /api/trips/1
```

## Bad

```http
POST /api/createTrip
```

---

# 10.2 Response format

```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

# 10.3 Error format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

# 11. Các rủi ro hệ thống

| Rủi ro               | Giải pháp               |
| -------------------- | ----------------------- |
| Google API quá quota | Cache + limit           |
| Payment callback lỗi | Retry + log             |
| Drag & Drop conflict | Transaction + version   |
| Search chậm          | Index + cache           |
| Upload ảnh nặng      | CDN + compression       |
| Spam review          | Rate limit + moderation |

---

# 12. Định hướng mở rộng tương lai

## AI Recommendation

* Gợi ý lịch trình.
* Gợi ý địa điểm.
* Dự đoán chi phí.

## Social features

* Follow.
* Like.
* Comment.
* Community ranking.

## Mobile app

* React Native.
* Flutter.

## Advanced Search

* ElasticSearch.
* Semantic search.

---

# 13. Kết luận

EZTravel là hệ thống có nghiệp vụ tương đối lớn với trọng tâm nằm ở:

* Trip Planning.
* Booking.
* Realtime itinerary.
* Community ecosystem.

Core business quan trọng nhất là:

```text
Lập kế hoạch du lịch trực quan + quản lý lịch trình realtime.
```

Do đó khi xây dựng backend cần ưu tiên:

1. Thiết kế Trip Service thật tốt.
2. Tối ưu Drag & Drop.
3. Đồng bộ chi phí realtime.
4. Tối ưu search & map.
5. Thiết kế authentication bảo mật.

---

# 14. Nguồn phân tích

Tài liệu được tổng hợp từ:

* Website hỗ trợ du lịch tự túc.
* SRS_ezTravel_v1.0.
* SQLScript database.
* Tài liệu phân công.
* Tài liệu thống nhất nội dung.

Nguồn tham khảo chính:

* SRS hệ thống EZTravel.
* SQL schema thực tế.
* Use case nghiệp vụ.
* Architecture định hướng.
