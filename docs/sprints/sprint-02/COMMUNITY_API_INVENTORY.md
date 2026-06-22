# COMMUNITY API INVENTORY

Kiểm kê các Endpoints Backend hiện có phục vụ cho Domain Community & Review.

## 1. Feeds (Cộng đồng)
- **Method:** `GET` | **Route:** `/api/feeds` | **Auth:** No | **Status:** `EXISTS` | **Usage:** Lấy danh sách Feed.
- **Method:** `POST` | **Route:** `/api/feeds/{tripId}/like` | **Auth:** Yes (User) | **Status:** `EXISTS` | **Usage:** Thích bài viết/Trip.
- **Method:** `POST` | **Route:** `/api/feeds/{tripId}/comment` | **Auth:** Yes (User) | **Request:** `string` | **Status:** `EXISTS` | **Usage:** Bình luận.
- **Method:** `GET` | **Route:** `/api/feeds/{tripId}/comments` | **Auth:** No | **Status:** `EXISTS` | **Usage:** Xem bình luận.

## 2. Reviews (Đánh giá)
- **Method:** `POST` | **Route:** `/api/reviews` | **Auth:** Yes (User) | **Request:** `CreateReviewRequest` | **Status:** `EXISTS` | **Usage:** Viết đánh giá.
- **Method:** `GET` | **Route:** `/api/reviews/place/{id}` | **Auth:** No | **Status:** `EXISTS` | **Usage:** Xem đánh giá theo Địa điểm.
- **Method:** `GET` | **Route:** `/api/reviews/service/{id}` | **Auth:** No | **Status:** `EXISTS` | **Usage:** Xem đánh giá theo Dịch vụ.

## 3. Notifications (Thông báo)
- **Method:** `GET` | **Route:** `/api/notifications` | **Auth:** Yes (User) | **Status:** `EXISTS` | **Usage:** Lấy thông báo của user.
- **Method:** `POST` | **Route:** `/api/notifications/{id}/read` | **Auth:** Yes (User) | **Status:** `EXISTS` | **Usage:** Đánh dấu đã đọc.

## 4. Blogs (Bài viết)
- **Method:** `N/A` | **Route:** `N/A` | **Status:** `MISSING` | **Usage:** Backend không tồn tại Controller/Service xử lý CRUD cho Blog.

## 5. User Profile
- Không có Controller chuyên biệt cho User Profile Public (Chỉ có Auth/Admin Controller xử lý Account).
