# ROADMAP V2 (REVISED)

Dựa trên phân tích toàn diện, Roadmap V2 sẽ tái cấu trúc lại các ưu tiên, loại bỏ những Sprint cũ không hiệu quả.

---

## Sprint 1: Architecture Fixes & Core Stabilization
**Goal:** Sửa chữa các lỗ hổng kiến trúc, đổi tên service, và chuẩn hóa lại UI System trên Frontend.

*   **US1.1:** Đổi tên `BookingService` thành `ProviderService` và cấu trúc lại route API.
*   **US1.2:** Tích hợp Redis Caching cho các API tĩnh (Tỉnh/Thành phố, Tags).
*   **US1.3:** Chuẩn hóa Frontend UI Components (Button, Form, Table, Modal) dùng chung cho toàn hệ thống.
*   **US1.4:** Thiết lập RabbitMQ/EventBus cơ bản cho luồng Gửi Email/Thông báo.

## Sprint 2: Provider Platform (Gấp rút)
**Goal:** Hoàn thiện luồng cho phép Nhà Cung Cấp tự đăng và quản lý dịch vụ (Khách sạn, Nhà hàng...).

*   **US2.1:** API & UI - NCC thêm, sửa, xóa dịch vụ của mình.
*   **US2.2:** API & UI - Upload và quản lý thư viện Ảnh Dịch Vụ.
*   **US2.3:** Backend Validation - Ngăn chặn Provider sửa dịch vụ của Provider khác (Row-level security).
*   **US2.4:** Frontend - Dashboard hiển thị chỉ số ảo (Views, Clicks) kết nối với hệ thống thống kê thật.

## Sprint 3: Social & Community Features
**Goal:** Kích hoạt tính Viral bằng cách mở khóa các tính năng Mạng xã hội cho Lịch trình.

*   **US3.1:** API & UI - Chia sẻ Lịch trình ra dạng Public (Tạo Public Link).
*   **US3.2:** Cộng đồng - Tính năng Like, Save Lịch trình người khác.
*   **US3.3:** Tính năng Review 5 sao: Gom chung form review cho Địa điểm, Dịch vụ, Lịch trình.
*   **US3.4:** Luồng phản hồi: Cho phép NCC trả lời (reply) đánh giá của khách hàng.

## Sprint 4: Moderation Center (Admin)
**Goal:** Xây dựng công cụ kiểm duyệt tập trung cho Admin để quản lý nội dung người dùng tạo ra.

*   **US4.1:** API & UI - Màn hình kiểm duyệt Dịch vụ mới do NCC đăng.
*   **US4.2:** API & UI - Màn hình duyệt Review và Blog post.
*   **US4.3:** Xử lý Report (Báo cáo nội dung xấu): Từ Frontend gửi lên bảng `BAO_CAO_NOI_DUNG`, Admin xử lý.
*   **US4.4:** Quản lý User: Fix lỗi table binding, thêm tính năng Khóa/Mở Khóa Account thật.

## Sprint 5: Realtime Collaboration
**Goal:** Đưa tính năng Trip Planner lên một tầm cao mới với khả năng cùng chỉnh sửa lịch trình (Co-editing).

*   **US5.1:** Cấu hình SignalR Hub trên .NET và YARP.
*   **US5.2:** Phân quyền Viewer/Editor cho `CHIA_SE_LICH_TRINH`.
*   **US5.3:** Frontend - Đồng bộ State Drag & Drop lịch trình qua WebSocket.
*   **US5.4:** In-app Notification realtime khi có người comment/like.

## Sprint 6: Provider Revenue & Promotion
**Goal:** Áp dụng logic Kinh doanh, kích hoạt luồng trả phí của Provider.

*   **US6.1:** Áp dụng thuật toán SearchRanking thật sự (Hiển thị dịch vụ ưu tiên theo Gói Premium của NCC).
*   **US6.2:** Quản lý Vòng đời Subscription: Cảnh báo hết hạn gói, tự động giáng cấp.
*   **US6.3:** Admin - Quản lý khiếu nại và tra cứu lịch sử `THANH_TOAN_NCC`.

## Sprint 7: AI Travel Assistant Core
**Goal:** Thổi hồn cho AI, biến Skeleton UI thành trợ lý ảo thông minh.

*   **US7.1:** Tích hợp Provider LLM (OpenAI/Gemini).
*   **US7.2:** Prompt Engineering: Thiết kế system prompt để AI trả về file JSON đúng cấu trúc Lịch trình.
*   **US7.3:** "1-Click Magic Trip": Nhập thông tin, AI tự sinh lịch trình và chèn thẳng vào Database.
*   **US7.4:** AI Chatbot: Trả lời câu hỏi du lịch dựa trên Database nội bộ (RAG cơ bản).

## Sprint 8: Polish & Performance Optimization
**Goal:** Đóng băng tính năng, tập trung làm mượt, tối ưu SEO và Load time.

*   **US8.1:** Frontend Code Splitting (Lazy Load routes).
*   **US8.2:** Fix N+1 Query issues trên toàn bộ Backend (đặc biệt module Trips).
*   **US8.3:** Skeleton Loaders & Micro-animations cho UX mượt mà.
*   **US8.4:** Audit bảo mật & Load testing.
