# Tài liệu Các Workflow Cốt lõi của hệ thống ezTravel

Dựa trên quá trình chạy thử nghiệm trên trình duyệt (qua cổng 3000) và kiểm tra mã nguồn 라out (`routes.js`), dưới đây là toàn bộ các luồng công việc (workflows) khả dụng trên hệ thống ezTravel, được phân chia theo các nhóm quyền (Roles) tương ứng với các tài khoản kiểm thử được cung cấp.

## 1. Khách vãng lai (Guest) & Xác thực (Authentication)
*Người dùng chưa đăng nhập có thể khám phá các thông tin chung và thực hiện đăng nhập.*

- **Khám phá (Explore):**
  - Xem danh sách các điểm đến (`/explore/destinations`).
  - Xem chi tiết một điểm đến cụ thể.
  - Xem danh sách các dịch vụ du lịch (`/explore/services`).
  - Xem chi tiết dịch vụ.
- **Cộng đồng (Community):**
  - Xem danh sách các bài viết/blog chia sẻ kinh nghiệm (`/community/blogs`).
  - Đọc chi tiết blog.
- **Xác thực & Tài khoản:**
  - Đăng nhập (Login).
  - Đăng ký tài khoản (Register).
  - Xác thực OTP.
  - Quên mật khẩu & Đặt lại mật khẩu.

---

## 2. Người dùng - Traveler (`traveler@eztravel.com`)
*Sau khi đăng nhập, Traveler có toàn quyền quản lý chuyến đi cá nhân và tương tác cộng đồng.*

- **Quản lý chuyến đi (Trip Management):**
  - Xem danh sách các chuyến đi của mình (`/trips`).
  - Tạo chuyến đi mới (`/trips/create`).
  - Xem chi tiết chuyến đi.
  - **Lập kế hoạch (Trip Planner):** Kéo thả các điểm đến, dịch vụ vào lịch trình từng ngày (`/trips/:id/planner`).
  - **Lên kế hoạch AI (AI Planner):** Sử dụng AI để tự động tối ưu hóa lịch trình chuyến đi (`/ai/planner`, `/ai/chat` - *Premium*).
- **Tương tác Cộng đồng:**
  - Tạo và đăng bài blog chia sẻ kinh nghiệm (`/community/blogs/create`).
- **Quản lý Hồ sơ (Profile):**
  - Xem và cập nhật thông tin cá nhân.
  - Đổi mật khẩu.
  - Xem thông báo (`/notifications`).
- **Nâng cấp & Trở thành Nhà cung cấp:**
  - Nâng cấp tài khoản (`/upgrade`).
  - Đăng ký trở thành Nhà cung cấp dịch vụ (`/provider/registration`).

---

## 3. Nhà cung cấp dịch vụ - Provider (`provider@eztravel.com`)
*Tài khoản sau khi được cấp quyền Provider sẽ có không gian làm việc riêng để quản lý dịch vụ kinh doanh của họ.*

- **Dashboard:**
  - Xem tổng quan các chỉ số hoạt động, thống kê (lượt xem, doanh thu, đặt chỗ).
- **Quản lý Dịch vụ (Services Management):**
  - Xem danh sách dịch vụ đang cung cấp (`/provider/services`).
  - Thêm mới dịch vụ (`/provider/services/create`).
  - Chỉnh sửa và cập nhật dịch vụ hiện tại.
- **Quản lý Đặt chỗ (Bookings Management):**
  - Xem, xác nhận hoặc hủy các đơn đặt chỗ từ khách du lịch (`/provider/bookings`).
- **Tài chính & Gói dịch vụ (Finance & Packages):**
  - Xem chi tiết tài chính và doanh thu (`/provider/finance`).
  - Xem lịch sử thanh toán (`/provider/payment-history`).
  - Mua, gia hạn các gói dịch vụ dành cho Provider (`/provider/packages`, `/provider/current-package`).
- **Tương tác Khách hàng:**
  - Quản lý và phản hồi đánh giá của khách hàng (`/provider/reviews`).
- **Cài đặt:**
  - Thiết lập các cấu hình liên quan đến dịch vụ và cửa hàng của Provider.

---

## 4. Quản trị viên - Admin (`admin@eztravel.com`)
*Tài khoản Admin có quyền quản lý toàn bộ hệ thống từ người dùng, đối tác đến nội dung.*

- **Admin Dashboard:**
  - Theo dõi tổng quan toàn hệ thống (số lượng user, provider, doanh thu hệ thống).
- **Quản lý Người dùng (User Management):**
  - Xem, khóa hoặc quản lý tài khoản người dùng (`/admin/users`).
- **Quản lý Nội dung & Hệ thống:**
  - Kiểm duyệt nội dung (Moderation) do người dùng tải lên (`/admin/moderation`).
  - Quản lý danh mục (Categories) cho các dịch vụ (`/admin/categories`).
  - Quản lý các Địa điểm/Tỉnh thành (`/admin/locations`).
  - Quản lý nội dung Cộng đồng (Blog/Reviews) (`/admin/community`).
- **Quản lý Nhà cung cấp (Provider Packages):**
  - Quản lý các gói đăng ký dành cho Provider (`/admin/provider-packages`).
- **Báo cáo & Hệ thống:**
  - Xem và xuất các báo cáo hệ thống (`/admin/reports`).
  - Cấu hình các thông số hệ thống chung (`/admin/system`).

---
*Ghi chú: Quá trình chạy browser đã ghi nhận việc truy cập thành công vào các module cốt lõi như Lập kế hoạch chuyến đi (Planner kéo-thả), Khám phá Điểm đến (Explore), Cộng đồng (Community), và xác thực đăng nhập.*
