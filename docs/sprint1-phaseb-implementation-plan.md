# Sprint 1 - Phase B Implementation Plan

Tài liệu này xác định chi tiết kế hoạch thực thi kỹ thuật (Implementation Plan) cho Phase B của Sprint 1 (Authentication & Identity). Việc triển khai sẽ bắt đầu ngay sau khi tài liệu này được xác nhận.

---

## 1. Danh sách các File được tác động (Files Inventory)

### a. Các file được tạo mới (Files Create)
Các file này sẽ đóng vai trò là Page components trong cấu trúc Route, gọi các chức năng tương ứng từ Features/Modules.

- `src/pages/auth/LoginPage.jsx`: Trang Đăng nhập hệ thống.
- `src/pages/auth/RegisterPage.jsx`: Trang Đăng ký Traveler mới.
- `src/pages/auth/OtpVerificationPage.jsx`: Trang Xác thực OTP.
- `src/pages/auth/ForgotPasswordPage.jsx`: Trang Yêu cầu đặt lại mật khẩu (Quên mật khẩu).
- `src/pages/auth/ResetPasswordPage.jsx`: Trang Thiết lập lại mật khẩu mới.

### b. Các file được chỉnh sửa (Files Modify)
- `src/router/routes.js`: Cập nhật hằng số tuyến đường (Route Constants), bao gồm bổ sung `/auth/verify-otp`.
- `src/router/index.jsx`: Cập nhật cấu hình router để nạp các trang Page mới tạo từ `pages/auth/...` thay vì import trực tiếp từ `modules/auth/...`.
- `src/contexts/AuthContext.jsx`: Đồng bộ hoá trạng thái tài khoản và cơ chế phân quyền dựa trên kết quả trả về của API `/profile`.
- `src/store/apis/authApi.ts`: Cập nhật định nghĩa RTK Query và DTO mappings cho phù hợp với API contract thực tế.
- `src/modules/auth/Login.jsx`: Sửa giao diện, validation, toast thông báo và điều hướng sau đăng nhập.
- `src/modules/auth/Register.jsx`: Điều hướng sang trang OTP cùng query parameter `?email=...` sau đăng ký thành công.
- `src/modules/auth/OtpVerification.jsx`: Xây dựng form OTP 6 số, đếm ngược cooldown 60s trên UI (không hardcode nghiệp vụ OTP TTL từ CSDL), gọi API `/auth/verify-otp` (stub), hiển thị Toast thành công, điều hướng về `/auth/login`.
- `src/modules/auth/ForgotPassword.jsx`: Form nhập email, gửi API `/auth/forgot-password` (stub) và hiển thị thông báo.
- `src/modules/auth/ResetPassword.jsx`: Form nhập mã xác thực và mật khẩu mới, kiểm tra trùng khớp, gửi API `/auth/reset-password` (stub), redirect về `/auth/login`.

---

## 2. Bản đồ ánh xạ API (API Mapping)

Dưới đây là ánh xạ các API thật từ Backend vào từng màn hình của ứng dụng:

| Màn hình (Page) | Endpoint Backend gọi | Method | DTO Dữ liệu gửi (Request Payload) | Dữ liệu nhận (Response Payload) |
| :--- | :--- | :---: | :--- | :--- |
| **LoginPage** | `/api/auth/login` | `POST` | `LoginRequest` (email, matKhau) | `BaseResponse<AuthResponse>` (token, user: { userId, name, email, role }) |
| **RegisterPage** | `/api/auth/register` | `POST` | `RegisterRequest` (hoTen, email, matKhau, vaiTro: "TRAVELER") | `BaseResponse<AuthResponse>` |
| **OtpVerificationPage** | `/api/auth/verify-otp` | `POST` | `VerifyOtpRequest` (email, code) | `Object` (stub trả về `{}`) |
| | `/api/auth/resend-otp` | `POST` | `ResendOtpRequest` (email) | `Object` (stub trả về `{}`) |
| **ForgotPasswordPage** | `/api/auth/forgot-password` | `POST` | `ForgotPasswordRequest` (email) | `Object` (stub trả về `{}`) |
| **ResetPasswordPage** | `/api/auth/reset-password` | `POST` | `ResetPasswordRequest` (email, code, newPassword) | `Object` (stub trả về `{}`) |
| **AuthContext / App** | `/api/profile` | `GET` | *(None - gửi JWT qua Bearer Header)* | `Object` (stub trả về `{}` hoặc Mock User profile) |

---

## 3. Quy tắc Ràng buộc Dữ liệu (Form Validation Rules)

Tuân thủ nghiêm ngặt theo đặc tả yêu cầu trong tài liệu thiết kế hệ thống (SRS):

### a. Form Đăng nhập (Login)
- **Email**: Bắt buộc nhập, phải đúng định dạng email hợp lệ.
- **Mật khẩu**: Bắt buộc nhập, không được để trống.

### b. Form Đăng ký (Register)
- **Họ tên**: Bắt buộc nhập, chỉ được nhập chữ cái tiếng Việt/tiếng Anh và dấu cách (regex: `/^[a-zA-ZÀ-ỹ\s]+$/`).
- **Email**: Bắt buộc nhập, đúng định dạng email.
- **Mật khẩu**: Bắt buộc nhập, tối thiểu 8 ký tự, phải bao gồm ít nhất: 1 chữ cái viết hoa, 1 chữ cái viết thường, và 1 chữ số.
- **Mật khẩu xác nhận**: Bắt buộc nhập, phải khớp chính xác với Mật khẩu.

### c. Form Xác thực OTP (OtpVerification)
- **Mã OTP**: Bắt buộc nhập, phải là chuỗi số có độ dài **đúng 6 ký tự**.

### d. Form Quên mật khẩu (ForgotPassword)
- **Email**: Bắt buộc nhập, đúng định dạng email.

### e. Form Thiết lập lại mật khẩu (ResetPassword)
- **Mã xác nhận (OTP)**: Bắt buộc nhập, đúng 6 ký tự.
- **Mật khẩu mới**: Bắt buộc nhập, tối thiểu 8 ký tự, bao gồm ít nhất 1 chữ viết hoa, 1 chữ viết thường, và 1 chữ số.
- **Mật khẩu xác nhận**: Bắt buộc nhập, khớp với Mật khẩu mới.
