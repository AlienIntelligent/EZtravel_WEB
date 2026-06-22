# Auth Role Matrix (Bản đồ Phân quyền theo Vai trò)

Tài liệu này đặc tả chi tiết ma trận phân quyền (Role Matrix) dành cho 6 vai trò người dùng trong hệ thống EZTravel, khớp với cấu trúc `ROLE_PERMISSION_MAP` tĩnh tại [auth.ts](file:///d:/eztravel/WebClient/src/constants/auth.ts) và đặc tả nghiệp vụ phân quyền.

---

## 1. Ma trận Quyền hạn Tổng quát

| Vai trò (Role) | Mô tả | Mã Quyền hạn (Permissions) | Các Tính năng được phép thực hiện |
| :--- | :--- | :--- | :--- |
| **GUEST** | Khách chưa đăng nhập | *(Không có)* | Xem trang chủ, tìm kiếm địa điểm, xem danh mục dịch vụ, xem blog/review công khai, xem lịch trình công khai. |
| **TRAVELER** | Người dùng cơ bản (Free) | - `CREATE_TRIP`<br>- `EDIT_TRIP`<br>- `CLONE_TRIP`<br>- `CREATE_BLOG`<br>- `REGISTER_PROVIDER` | Lập và quản lý lịch trình cá nhân/nhóm, viết blog cá nhân, clone các lịch trình công khai về tài khoản, gửi đơn đăng ký làm Nhà cung cấp dịch vụ (NCC). |
| **PREMIUM_TRAVELER** | Người dùng trả phí (Premium) | - *Toàn bộ quyền Traveler*<br>- `USE_AI_PLANNER`<br>- `USE_AI_CHAT` | Sử dụng toàn bộ tính năng của gói Traveler Free + Trợ lý AI (tự động sinh lịch trình, tối ưu hóa hành trình trên bản đồ, chatbot tư vấn không giới hạn). |
| **PROVIDER_PENDING** | Đang chờ duyệt làm NCC | - `CREATE_TRIP`<br>- `EDIT_TRIP`<br>- `CLONE_TRIP`<br>- `CREATE_BLOG` | Sử dụng các tính năng cơ bản của Traveler. Truy cập màn hình chờ duyệt `/provider/pending` (không được phép gửi thêm đơn đăng ký mới). |
| **PROVIDER_APPROVED** | Nhà cung cấp được duyệt | - `CREATE_TRIP`<br>- `EDIT_TRIP`<br>- `CLONE_TRIP`<br>- `CREATE_BLOG`<br>- `MANAGE_SERVICES`<br>- `MANAGE_REVIEWS` | Sử dụng tính năng Traveler. Truy cập Dashboard NCC để quản lý dịch vụ (thêm/sửa/ẩn/hiển thị), phản hồi đánh giá khách hàng, và đăng ký gói quảng bá dịch vụ. |
| **ADMIN** | Quản trị viên hệ thống | - *Toàn bộ quyền Premium*<br>- `MANAGE_SERVICES`<br>- `MANAGE_REVIEWS`<br>- `VIEW_ADMIN_DASHBOARD`<br>- `MANAGE_USERS`<br>- `MODERATE_CONTENT`<br>- `MANAGE_CATEGORIES` | Truy cập trang quản trị Admin. Quản lý danh sách người dùng (khóa/mở khóa), duyệt NCC mới, duyệt dịch vụ và nội dung blog/review, quản lý mã giảm giá, xem thống kê vận hành. |

---

## 2. Chi tiết phân giải Quyền (Client-Side Resolving)

Quyền hạn của người dùng được xác định động tại Frontend dựa vào đối tượng `user` trả về từ API `/api/profile`:
- Nếu `user` rỗng -> Gán vai trò `GUEST`.
- Nếu `user.role === 'ADMIN'` -> Gán vai trò `ADMIN`.
- Nếu `user.role === 'PROVIDER'` và `user.providerStatus === 'PENDING'` -> Gán vai trò `PROVIDER_PENDING`.
- Nếu `user.role === 'PROVIDER'` và `user.providerStatus === 'APPROVED'` (hoặc khác PENDING) -> Gán vai trò `PROVIDER_APPROVED`.
- Nếu `user.isPremium === true` -> Gán vai trò `PREMIUM_TRAVELER`.
- Các trường hợp khác -> Gán vai trò `TRAVELER` (Free).
