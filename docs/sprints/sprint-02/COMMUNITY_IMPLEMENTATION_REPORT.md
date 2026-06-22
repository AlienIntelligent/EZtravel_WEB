# SPRINT 02 – COMMUNITY & REVIEW CORE
## IMPLEMENTATION REPORT

Báo cáo chi tiết quá trình và kết quả triển khai cho Sprint 02 (Community & Review Core).

### 1. Files Created (Các file tạo mới)
- `d:\eztravel\WebClient\src\store\apis\communityApi.ts`: Chứa toàn bộ RTK Query Endpoints cho Community, Review, và Notification.
- `d:\eztravel\WebClient\src\modules\community\CommunityWorkspace.jsx`: Trang chủ (List) danh sách Feed.
- `d:\eztravel\WebClient\src\modules\community\components\FeedCard.jsx`: Hiển thị chi tiết từng Feed, số lượng Like, Bình luận và nút thao tác.
- `d:\eztravel\WebClient\src\modules\community\components\NotificationDropdown.jsx`: Dropdown hiển thị thông báo ở thanh Topbar (Viết lại độc lập, không phụ thuộc DropdownMenu component ngoài do lỗi package).
- `d:\eztravel\WebClient\src\modules\reviews\components\ReviewsSection.jsx`: Cụm hiển thị danh sách đánh giá và Form viết đánh giá.
- `d:\eztravel\LIKE_API_STRATEGY.md`: Báo cáo quyết định chiến lược xử lý Like API (Optimistic Update).

### 2. Files Modified (Các file đã chỉnh sửa)
- `d:\eztravel\WebClient\src\api\baseApi.ts`: Thêm `Community` và `Notification` vào mảng `tagTypes` để hỗ trợ Invalidation.
- `d:\eztravel\WebClient\src\routes\index.jsx`: Thêm Router path `/community` trỏ vào `CommunityWorkspace`.
- `d:\eztravel\WebClient\src\layouts\MainLayout.jsx`: Tích hợp `NotificationDropdown` vào Topbar.

### 3. APIs & DTOs Used (Endpoint đã tích hợp)
Toàn bộ tích hợp qua RTK Query:
- **Feeds:** `GET /api/feeds` (List), `POST /api/feeds/{tripId}/like` (LikeTrip - Optimistic Update), `POST /api/feeds/{tripId}/comment` (CommentOnTrip), `GET /api/feeds/{tripId}/comments` (TripComments).
- **Reviews:** `POST /api/reviews` (PostReview), `GET /api/reviews/place/{id}` (PlaceReviews), `GET /api/reviews/service/{id}` (ServiceReviews).
- **Notifications:** `GET /api/notifications` (List), `POST /api/notifications/{id}/read` (MarkAsRead).
- **DTOs Frontend (Implicit):** `FeedDto`, `ReviewDto`, `CommentDto`, `NotificationDto` (Xử lý theo kiểu dữ liệu trả về từ RTK Query), Form Body sử dụng payload bám theo thiết kế DTO chuẩn.

### 4. Acceptance Criteria Matrix
| Tính năng | Trạng thái | Ghi chú (Kiểm chứng) |
|---|---|---|
| **Feed List / Detail** | Hoàn thành | Lấy thành công dữ liệu Feed qua RTK Query. |
| **Feed Like** | Hoàn thành | Áp dụng **Optimistic Update**: UI thay đổi lập tức, Rollback nếu fail. |
| **Feed Comment** | Hoàn thành | Gửi payload nội dung text thuần túy. Reload list comment tự động. |
| **Review List / Create** | Hoàn thành | Phân chia logic Place và Service. Form review Validation đầy đủ, SweetAlert2 Toast. |
| **Notification** | Hoàn thành | Tính toán số `unreadCount`, hiển thị Badge đó, Gọi API `MarkAsRead` khi click vào mục chưa đọc. |
| **Blog / Public Profile** | Out of Scope | Không triển khai đúng như luật định vì Backend thiếu API. |

### 5. Verification Results (Kết quả kiểm thử kỹ thuật)
Tiến hành chạy qua Terminal Workspace:
- **Lint Result:** `npm run lint` hoàn tất thành công sau khi dọn dẹp các hook lỗi React Compiler (`react-hooks/rules-of-hooks` và unused vars).
- **Type Check Result:** `tsc --noEmit` hoàn tất không có bất kỳ lỗi (0 errors) TypeScript nào trên toàn cục.
- **Build Result:** `vite build` trả về Output `dist/` thành công (Chạy xong trong khoảng 2.64s). Đã xử lý triệt để lỗi mất package Dropdown Menu Component.

**KẾT LUẬN SPRINT 02 HOÀN TẤT VÀ ỔN ĐỊNH. KHÔNG CÒN NỢ KỸ THUẬT NGHIÊM TRỌNG.**
