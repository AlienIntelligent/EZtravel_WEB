# CRD GAP ANALYSIS V2

Tài liệu này đánh giá khoảng cách giữa yêu cầu trong tài liệu CRD và thực trạng hệ thống ở thời điểm hiện tại.

## 1. Traveler Core (Tài khoản & Hồ sơ)

| Requirement | Database | Backend | Frontend | Status | Nguyên nhân & Đề xuất |
|---|---|---|---|---|---|
| **Đăng ký / Đăng nhập / OTP / Quên MK** | ✅ Có | ✅ Có | ✅ Có | **DONE** | Hoạt động tốt. |
| **Quản lý hồ sơ cá nhân** | ✅ Có | ⚠️ Thiếu update API | ⚠️ UI nháp | **PARTIAL** | Backend có `GET /auth/me` nhưng thiếu `PUT` sửa profile. Đề xuất: Bổ sung Update Profile API & UI. |
| **Mô hình Freemium (Gói Traveler)** | ✅ Có bảng | ❌ Thiếu API | ❌ Thiếu UI | **DEPRECATED/DEFERRED** | Chưa ưu tiên mảng thu phí từ người dùng cuối. Đề xuất: Tạm ẩn, tập trung thu phí từ Provider. |

## 2. Planner Core (Lịch trình & Khám phá)

| Requirement | Database | Backend | Frontend | Status | Nguyên nhân & Đề xuất |
|---|---|---|---|---|---|
| **Tạo / Sắp xếp Drag & Drop / Ngân sách** | ✅ Có | ✅ Có | ✅ Có | **DONE** | Workspace mạnh mẽ, đã xử lý tốt. |
| **Cộng tác Realtime (SignalR)** | ✅ Có quyền | ❌ Chưa có Hub | ❌ Chưa có UI | **MISSING** | Chưa cấu hình WebSockets/SignalR trên ApiGateway. Đề xuất: Thêm vào Roadmap V2. |
| **Tìm kiếm đa tiêu chí** | ✅ Có | ✅ Có | ✅ Có | **DONE** | Cần tinh chỉnh bộ lọc nâng cao. |
| **Trang chi tiết địa điểm/dịch vụ** | ⚠️ Thiếu rating chi tiết | ✅ Có API | ⚠️ UI cơ bản | **PARTIAL** | UI cần làm đẹp và hiển thị đủ ảnh, review. |
| **Xu hướng và gợi ý** | ❌ Không có logic | ⚠️ API mockup | ⚠️ UI mockup | **PARTIAL** | Đề xuất: Viết lại Recommendation logic dựa vào AI hoặc Ranking. |

## 3. Community (Blog & Review)

| Requirement | Database | Backend | Frontend | Status | Nguyên nhân & Đề xuất |
|---|---|---|---|---|---|
| **Chia sẻ lịch trình (Public)** | ✅ Có | ❌ Thiếu API Share | ❌ Không có nút Share | **MISSING** | Bắt buộc phải có để lan tỏa nội dung. Đề xuất: Ưu tiên Sprint tới. |
| **Like / Save / Comment** | ✅ Có | ⚠️ API chưa đủ | ⚠️ UI chưa wire | **PARTIAL** | Đã có Entity, thiếu logic Controller hoàn chỉnh. |
| **Đánh giá (Review 5 sao)** | ✅ Có | ⚠️ API chưa gom | ⚠️ UI thiếu form | **PARTIAL** | Cần gom luồng tạo review cho Place, Service và Trip. |
| **Blog du lịch (Feed)** | ✅ Có | ⚠️ Chỉ có API GET | ⚠️ UI mockup | **PARTIAL** | Cần làm luồng CMS cho user tự viết blog. |

## 4. Provider Platform (Quảng bá NCC)

| Requirement | Database | Backend | Frontend | Status | Nguyên nhân & Đề xuất |
|---|---|---|---|---|---|
| **Đăng ký NCC** | ✅ Có | ✅ Có | ⚠️ UI cũ | **PARTIAL** | Hoạt động nhưng UX cần cải thiện. |
| **Quản lý Dịch vụ NCC** | ✅ Có | ✅ Có API CRUD | ❌ UI Stub | **MISSING** | Provider không thể tự đăng dịch vụ qua UI. Đề xuất: Khẩn cấp làm trang quản lý dịch vụ cho NCC. |
| **Dashboard & Analytics** | ❌ Thiếu log | ⚠️ API lấy số liệu ảo | ⚠️ UI ảo | **PARTIAL** | Cần thiết kế bảng log views/clicks cho dịch vụ để xuất báo cáo thật. |
| **Đăng ký & Thanh toán gói NCC** | ✅ Có | ✅ Có | ✅ Có | **DONE** | Đã có luồng thanh toán VNPay/Mock. |

## 5. Admin Platform

| Requirement | Database | Backend | Frontend | Status | Nguyên nhân & Đề xuất |
|---|---|---|---|---|---|
| **Duyệt NCC** | ✅ Có | ⚠️ Sai endpoint | ⚠️ Gọi sai API | **PARTIAL** | Cần map lại UI với Backend đúng route. |
| **Duyệt Dịch vụ / Review / Blog** | ✅ Có | ❌ Thiếu API Duyệt | ❌ UI Stub | **MISSING** | Admin chưa có công cụ kiểm duyệt nội dung do User/Provider tạo. Đề xuất: Xây dựng Moderation Service. |
| **Quản lý Users & Danh mục** | ✅ Có | ✅ Có | ⚠️ UI lỗi | **PARTIAL** | Cần fix table binding trên Frontend. |
| **Quản lý Gói NCC (Admin cấp/hủy)** | ✅ Có | ✅ Có 8 endpoints | ❌ UI Stub | **MISSING** | API đã sẵn sàng, UI chưa móc API. |

## 6. AI Assistant

| Requirement | Database | Backend | Frontend | Status | Nguyên nhân & Đề xuất |
|---|---|---|---|---|---|
| **AI Trip Generator / Chat / Budget** | ✅ Bảng Log | ❌ Chưa có logic | ⚠️ UI Skeleton | **MISSING** | Chưa chọn LLM Provider. Đề xuất: Tích hợp Azure OpenAI hoặc Gemini. |
