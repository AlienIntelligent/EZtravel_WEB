# Auth Test Matrix (Ma trận Kịch bản Kiểm thử Xác thực)

Tài liệu này đặc tả chi tiết ma trận kịch bản kiểm thử (Test Cases Matrix) đối với toàn bộ các tính năng xác thực và định danh trong Sprint 1, làm cơ sở bàn giao cho QA/Tester thực thi kiểm thử và viết kịch bản Playwright Automation Test.

---

## 1. Ma trận Kịch bản kiểm thử

| Phân hệ (Module) | Mã Case | Tên Kịch bản (Scenario) | Điều kiện Đầu vào (Input Data) | Kết quả mong đợi (Expected Outcome) | Phương pháp kiểm thử (Method) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Login** | TC-LGN-01 | Đăng nhập thành công | Email: `traveler@eztravel.com`<br>Pass: `Password123!` | Lưu JWT Token & User Profile; chuyển hướng thành công tới `/dashboard`. | Automation / Manual |
| | TC-LGN-02 | Đăng nhập sai mật khẩu | Email: `traveler@eztravel.com`<br>Pass: `SaiMatKhau!` | Hiển thị thông báo lỗi: "Sai email hoặc mật khẩu". Không chuyển hướng. | Automation / Manual |
| | TC-LGN-03 | Đăng nhập tài khoản bị khóa | Email: `banned@eztravel.com` (Trạng thái DB: `BANNED`) | Hiển thị thông báo lỗi: "Tài khoản của bạn đã bị khóa.". | Automation / Manual |
| | TC-LGN-04 | Đăng nhập email không tồn tại | Email: `nouser@eztravel.com`<br>Pass: `Password123!` | Hiển thị thông báo lỗi: "Sai email hoặc mật khẩu". | Automation / Manual |
| | TC-LGN-05 | Chống brute-force đăng nhập | Sai mật khẩu 5 lần liên tiếp | Tài khoản tạm khóa 5 phút. Thông báo lỗi tài khoản bị khóa tạm thời. | Manual |
| **Register** | TC-REG-01 | Đăng ký tài khoản thành công | Email: `new@eztravel.com`<br>Họ tên: `Nguyen Van A`<br>Pass: `Password123!` | Tạo tài khoản trạng thái `ACTIVE` ở DB; hiển thị form xác thực OTP hoặc chuyển đến Dashboard (tuỳ luồng kích hoạt). | Automation / Manual |
| | TC-REG-02 | Đăng ký trùng Email | Email: `traveler@eztravel.com`<br>Pass: `Password123!` | Hiển thị thông báo lỗi: "Email đã tồn tại". Không lưu CSDL. | Automation / Manual |
| | TC-REG-03 | Đăng ký sai định dạng dữ liệu | Email: `new-email-invalid`<br>Pass: `123` (quá ngắn) | Hiển thị cảnh báo lỗi định dạng ngay tại form (Client-side validation). | Automation / Manual |
| **OTP** | TC-OTP-01 | Xác thực OTP thành công | OTP: Mã 6 chữ số khớp trong DB và chưa hết hạn. | Chuyển hướng người dùng vào Dashboard với thông báo kích hoạt tài khoản thành công. | Automation / Manual |
| | TC-OTP-02 | Xác thực OTP hết hạn | OTP: Hết hạn quá 10 phút. | Hiển thị thông báo lỗi: "Mã OTP đã hết hạn, vui lòng yêu cầu mã mới". | Automation / Manual |
| | TC-OTP-03 | Xác thực OTP sai mã | OTP: Nhập mã không khớp. | Hiển thị thông báo lỗi: "Mã OTP không chính xác". Tăng biến đếm `so_lan_sai`. | Automation / Manual |
| | TC-OTP-04 | Khóa tài khoản do brute-force OTP | Nhập sai OTP quá 5 lần | Hiển thị thông báo khóa tài khoản 15 phút. Không cho phép nhập OTP tiếp. | Manual |
| | TC-OTP-05 | Yêu cầu gửi lại OTP (Resend) | Kích nút "Resend OTP" sau 60s cooldown | Gửi mã OTP mới về email, reset thời hạn sử dụng 10 phút, đặt lại bộ đếm cooldown. | Automation / Manual |
| **Forgot Pass**| TC-FGP-01 | Yêu cầu khôi phục mật khẩu | Nhập đúng email đã đăng ký. | Hiển thị thông báo: "Liên kết khôi phục mật khẩu đã được gửi đến email". | Automation / Manual |
| | TC-FGP-02 | Khôi phục email không tồn tại | Nhập email chưa đăng ký. | Hiển thị thông báo lỗi: "Email không tồn tại trong hệ thống". | Automation / Manual |
| **Reset Pass** | TC-RST-01 | Đặt lại mật khẩu thành công | Nhấp vào link token hợp lệ (TTL < 15 phút) -> Nhập mật khẩu mới khớp nhau. | Cập nhật mật khẩu mới (hash Bcrypt) vào DB, hủy token cũ, chuyển hướng về trang Login. | Automation / Manual |
| | TC-RST-02 | Link đặt lại mật khẩu hết hạn | Nhấp vào link có token quá hạn 15 phút. | Hiển thị thông báo lỗi: "Đường dẫn khôi phục mật khẩu đã hết hạn hoặc không hợp lệ". | Automation / Manual |
| | TC-RST-03 | Đặt lại mật khẩu không khớp | Nhập mật khẩu mới và xác nhận mật khẩu không khớp nhau. | Hiển thị cảnh báo lỗi khớp mật khẩu ngay trên giao diện. | Automation / Manual |
