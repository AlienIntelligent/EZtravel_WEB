# Sprint 1 - Authentication Discovery Report

Tài liệu này tổng hợp kết quả phân tích khám phá (Discovery) về nghiệp vụ và kiến trúc xác thực (Authentication & Identity) trong dự án EZTravel, đối chiếu trực tiếp giữa tài liệu thiết kế (CRD, SRS), Schema Cơ sở dữ liệu và mã nguồn hiện tại của Backend.

---

## 1. User Types (Vai trò người dùng)

Hệ thống định nghĩa 6 vai trò chính ở phía Frontend, đồng bộ với phân quyền cơ sở dữ liệu:

1. **GUEST**: Khách vãng lai chưa đăng nhập. Chỉ có quyền đọc thông tin công khai (địa điểm, bài viết, dịch vụ, lịch trình public).
2. **TRAVELER (Free)**: Tài khoản đã đăng ký và xác thực email thành công. Đây là người dùng cơ bản, có toàn quyền lập lịch trình, tương tác cộng đồng.
3. **PREMIUM_TRAVELER**: Người dùng trả phí dịch vụ Premium để mở khóa các tính năng Trợ lý AI nâng cao.
4. **PROVIDER_PENDING**: Người dùng đã gửi đơn đăng ký Nhà cung cấp dịch vụ (NCC) lên hệ thống và đang chờ Admin xét duyệt hồ sơ trong vòng 48h.
5. **PROVIDER_APPROVED**: Nhà cung cấp dịch vụ đã được Admin phê duyệt đơn. Có quyền quản lý 4 loại hình dịch vụ du lịch (Khách sạn, Nhà hàng, Phương tiện, Hoạt động) và xem biểu đồ thống kê lượt xem/quảng bá.
6. **ADMIN**: Quản trị viên hệ thống có quyền cao nhất. Chịu trách nhiệm kiểm duyệt nội dung, duyệt tài khoản NCC, quản lý danh mục và xem báo cáo thống kê vận hành toàn hệ thống.

---

## 2. Registration Flows (Luồng đăng ký)

Hệ thống hỗ trợ 2 luồng đăng ký độc lập:

### a. Luồng đăng ký Traveler (Khách du lịch)
- **Thông tin đầu vào**: Họ tên (`hoTen`), Email (`email`), Mật khẩu (`matKhau` - tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, chữ số).
- **Quy trình thực tế**: 
  1. Người dùng nhập form đăng ký ở Frontend.
  2. Frontend gửi yêu cầu lên endpoint `POST /api/auth/register`.
  3. Backend kiểm tra tính duy nhất của Email. Nếu chưa tồn tại, mã hóa mật khẩu bằng thuật toán Bcrypt (work factor = 12) và ghi nhận bản ghi vào bảng `NGUOI_DUNG` ở trạng thái kích hoạt mặc định.
  4. Hệ thống gửi mã OTP 6 chữ số qua email (qua SendGrid/Mailjet) hiệu lực 10 phút.
  5. Người dùng thực hiện xác thực OTP để kích hoạt vai trò **Traveler – Free**.

### b. Luồng đăng ký Provider (Nhà cung cấp dịch vụ)
- **Tiền điều kiện**: Phải là một tài khoản Traveler đã đăng nhập.
- **Thông tin đầu vào**: Tên doanh nghiệp/cá nhân (`ten_doanh_nghiep`), loại hình kinh doanh, số điện thoại, địa chỉ, giấy phép kinh doanh (ảnh hoặc tài liệu đính kèm tải lên Cloudinary).
- **Quy trình thực tế**:
  1. Traveler điền thông tin đăng ký tại trang `/provider/registration` và gửi.
  2. Tạo bản ghi mới trong bảng `NHA_CUNG_CAP` với trạng thái mặc định là `PENDING`.
  3. Admin nhận thông báo, xem xét hồ sơ và quyết định Phê duyệt (nâng vai trò người dùng lên `PROVIDER` với trạng thái approved, cho phép đăng dịch vụ) hoặc Từ chối (người dùng giữ nguyên vai trò Traveler, nhận email thông báo lý do từ chối).

---

## 3. Verification Flows (Xác thực OTP)

- **Hình thức xác thực**: Gửi mã OTP 6 chữ số qua **Email** (không sử dụng SMS để tiết kiệm chi phí và hạ tầng).
- **Thời gian hết hạn**: Có hiệu lực trong vòng **10 phút** (được lưu trong cột `ngay_het_han` của bảng `OTP_XAC_THUC` hoặc TTL của Redis).
- **Cơ chế chống brute-force (Spam/Tấn công dò mật khẩu)**:
  - Nếu người dùng nhập sai mã OTP **quá 5 lần liên tiếp** (`so_lan_sai` trong bảng `OTP_XAC_THUC` vượt quá 5), tài khoản sẽ bị tạm khóa **15 phút**.
- **Cơ chế gửi lại (Resend OTP)**: Cho phép yêu cầu gửi lại OTP sau khi kết thúc bộ đếm ngược cooldown (thường là 60 giây).

---

## 4. Password Flows (Luồng mật khẩu)

Hệ thống hỗ trợ đầy đủ các luồng mật khẩu chuẩn doanh nghiệp:

1. **Quên mật khẩu (Forgot Password)**: Người dùng nhập email -> Hệ thống gửi một liên kết chứa mã token bảo mật duy nhất qua email. Token này có thời gian sống (TTL) là **15 phút**.
2. **Đặt lại mật khẩu (Reset Password)**: Khi người dùng kích vào liên kết bảo mật trong email -> hiển thị form nhập mật khẩu mới và xác nhận mật khẩu -> cập nhật mật khẩu mới vào CSDL, vô hiệu hóa mã token cũ lập tức.
3. **Đổi mật khẩu (Change Password)**: Thực hiện bên trong giao diện quản lý hồ sơ cá nhân. Người dùng bắt buộc phải nhập đúng mật khẩu hiện tại (Old Password) trước khi cập nhật mật khẩu mới (New Password).

---

## 5. JWT Payload Structure (Cấu trúc Token)

Khi đăng nhập thành công, máy chủ cấp Access Token dạng JWT có cấu trúc payload như sau (đối chiếu trực tiếp file `JwtService.cs` dòng 24-30):

```json
{
  "sub": "ma_nguoi_dung",
  "email": "email_nguoi_dung",
  "role": "vai_tro_nguoi_dung",
  "status": "trang_thai_nguoi_dung",
  "exp": 1718324500,
  "iss": "ezTravel",
  "aud": "ezTravelClients"
}
```

> [!IMPORTANT]
> **Lưu ý đặc biệt về Quyền hạn (Permissions)**:
> Token JWT trả về từ server **không chứa danh sách permissions**. 
> Phía Frontend thực hiện phân giải danh sách quyền dựa trên ánh xạ tĩnh `ROLE_PERMISSION_MAP` nằm tại [auth.ts](file:///d:/eztravel/WebClient/src/constants/auth.ts) để tối ưu dung lượng của Token JWT truyền tải qua HTTP Header.

---

## 6. API Inventory (Danh mục API Xác thực thực tế)

Dưới đây là danh mục API xác thực thực tế đang được khai báo trong `AuthController` và `ProfileController` của Backend.

> [!WARNING]
> **Cảnh báo về trạng thái của Backend (Backend Stubbing)**:
> Một số nghiệp vụ như OTP xác thực và cập nhật hồ sơ hiện tại chỉ được viết dưới dạng **stub** (trả về đối tượng trống `{}` ở lớp dịch vụ của Backend). Frontend cần xử lý dữ liệu trả về này một cách khôn ngoan hoặc giả lập dữ liệu (mocking) tương ứng trong quá trình chạy thử nghiệm tự động.

| # | Endpoint | Method | Trạng thái Backend | Vai trò / Nghiệp vụ |
| :--- | :--- | :---: | :--- | :--- |
| 1 | `/api/auth/register` | `POST` | ✅ Hoạt động thực tế | Đăng ký tài khoản Traveler mới. |
| 2 | `/api/auth/login` | `POST` | ✅ Hoạt động thực tế | Đăng nhập hệ thống, trả về Token JWT và thông tin User. |
| 3 | `/api/auth/verify-otp` | `POST` | ⚠️ Stub (trả về `{}`) | Xác thực mã OTP kích hoạt tài khoản. |
| 4 | `/api/auth/resend-otp` | `POST` | ⚠️ Stub (trả về `{}`) | Yêu cầu gửi lại mã OTP kích hoạt. |
| 5 | `/api/auth/forgot-password` | `POST` | ⚠️ Stub (trả về `{}`) | Yêu cầu khôi phục mật khẩu qua Email. |
| 6 | `/api/auth/reset-password` | `POST` | ⚠️ Stub (trả về `{}`) | Đặt lại mật khẩu mới thông qua mã xác thực OTP. |
| 7 | `/api/profile` | `GET` | ⚠️ Stub (trả về `{}`) | Lấy thông tin chi tiết hồ sơ cá nhân người dùng hiện tại. |
| 8 | `/api/profile` | `PUT` | ⚠️ Stub (trả về `{}`) | Cập nhật họ tên và số điện thoại của người dùng. |
| 9 | `/api/profile/password` | `PUT` | ⚠️ Stub (trả về `{}`) | Đổi mật khẩu cá nhân (yêu cầu mật khẩu cũ). |
| 10 | `/api/profile/avatar` | `POST` | ⚠️ Stub (trả về `{}`) | Cập nhật link ảnh đại diện của tài khoản. |
