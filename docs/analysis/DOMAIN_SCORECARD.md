# ROADMAP V2 VALIDATION & DOMAIN SCORECARD

## 1. Đối chiếu Roadmap V2 với CRD

*   **Độ phủ yêu cầu (Coverage):** Roadmap V2 bám sát 100% các Phase bắt buộc trong CRD, bao gồm cả những hạng mục bị bỏ quên ở Roadmap cũ như (1) Quản lý dịch vụ cho NCC, (2) Chia sẻ lịch trình, và (3) Hệ thống kiểm duyệt tập trung của Admin.
*   **Điểm điều chỉnh:** Các yêu cầu "Excluded" trong CRD §7.2 (Booking Engine, Hoa hồng, Payment Gateway cho OTA) được cam kết loại bỏ triệt để. Tuy nhiên, tính năng AI Assistant (Phase 3) được dời trọng tâm sang Sprint 7 để đảm bảo các Core Domain (Planner, Provider) hoạt động trơn tru trước khi ráp LLM.

## 2. Đối chiếu Roadmap V2 với Database

*   **Tính khả thi (Feasibility):** Database hiện tại đã có tới 90% schema (bảng, cột, quan hệ) cần thiết để chạy Roadmap V2. Các Entity như `DICH_VU`, `BAI_VIET`, `DANH_GIA`, `DUYET_NOI_DUNG`, `CHIA_SE_LICH_TRINH` đã sẵn sàng.
*   **Hành động theo Roadmap:**
    *   *Sprint 2, 3, 4:* Tập trung kích hoạt các Controller/UI để tương tác với các bảng chưa có data (VD: `DICH_VU` cho NCC tự nhập, `DUYET_NOI_DUNG` cho Admin duyệt).
    *   *Sprint 5 (Realtime):* Database chỉ bổ sung thêm quyền truy cập cho cột `Quyen` trong `CHIA_SE_LICH_TRINH`.

## 3. Đối chiếu Roadmap V2 với Backend hiện tại

*   **Sự sai lệch (Mismatch):** Backend hiện tại có một số lỗ hổng nghiêm trọng so với CRD như tên service gây nhầm lẫn (`BookingService`), thiếu Realtime API (SignalR), và các điểm nghẽn N+1 Query.
*   **Giải pháp từ Roadmap V2:**
    *   *Sprint 1:* Đổi tên Service, chuẩn hóa Route (Giải quyết "Tech Debt" rườm rà).
    *   *Sprint 5:* Bổ sung SignalR để đáp ứng tính năng Cộng tác.
    *   *Sprint 8:* Dành hẳn 1 Sprint để Refactor N+1 và optimize performance, điều cực kỳ cần thiết trước khi Go-live.

---

## 4. DOMAIN SCORECARD (Đánh giá mức độ hoàn thiện)

Dưới đây là điểm số thực tế dựa trên tiến độ tổng hợp (Database + API + UI + Logic) của từng Domain ở thời điểm hiện tại:

### 1. Traveler Domain: 65/100 (Trung bình khá)
*   **Điểm mạnh:** Flow Đăng ký, Đăng nhập, Quên mật khẩu, OTP xử lý rất tốt. Backend và UI đều map với nhau.
*   **Điểm yếu:** Trang Profile cá nhân chỉ có mockup, thiếu API Update. Gói Traveler Premium (Freemium) đang bị đóng băng.

### 2. Planner Domain: 75/100 (Khá)
*   **Điểm mạnh:** UI Drag & Drop xuất sắc, API quản lý điểm đến và tính toán ngân sách hoạt động mượt mà. Đây là trái tim của hệ thống hiện tại.
*   **Điểm yếu:** CRD yêu cầu "Cộng tác realtime" và "Chia sẻ Public", nhưng Backend hiện chưa có WebSocket và chưa có endpoint share. Thiếu yếu tố lan tỏa nội dung.

### 3. Community Domain: 35/100 (Yếu)
*   **Điểm mạnh:** Database schema hỗ trợ hoàn hảo (Bài viết, Bình luận, Review đa chiều, Gallery ảnh).
*   **Điểm yếu:** Frontend hoàn toàn là đồ "Mockup/Stub". Chưa có Form nào hoạt động cho việc viết Blog hoặc submit Đánh giá đa chiều (Chat lượng, Dịch vụ, Giá trị, Vị trí).

### 4. Provider Domain: 50/100 (Trung bình)
*   **Điểm mạnh:** Quy trình đăng ký Gói quảng bá và mockup Thanh toán đã chạy.
*   **Điểm yếu chí mạng:** NCC không có UI để thêm/sửa/xóa dịch vụ (Phòng khách sạn, món ăn nhà hàng...). Không có dịch vụ thì gói quảng bá trở nên vô dụng. Analytics Dashboard là số liệu giả.

### 5. Admin Domain: 40/100 (Yếu)
*   **Điểm mạnh:** Đã có hệ thống quản lý Danh mục (Tỉnh thành, Categories, Tags) hoạt động chuẩn xác.
*   **Điểm yếu:** Mọi luồng kiểm duyệt (Duyệt NCC, Duyệt Bài, Duyệt Review) đều gọi sai API hoặc chưa có API. Table UI bị lỗi binding dữ liệu, không lock được user.

### 6. AI Domain: 10/100 (Rất yếu / Mới Khởi Động)
*   **Điểm mạnh:** Đã có Layout và UI Component khung. Đã có bảng lưu lịch sử `LICH_SU_AI`.
*   **Điểm yếu:** 0% Logic LLM (Chưa gọi OpenAI/Gemini), 0% Logic Prompt Engineering.

---

## TỔNG KẾT TÌNH TRẠNG SỨC KHỎE (OVERALL HEALTH)
> **Trạng thái:** 🟠 CẢNH BÁO (WARNING) - Điểm trung bình toàn hệ thống: ~45/100
> **Nhận xét:** Hệ thống có nền móng (Database) và bộ khung (Base Services) cực kỳ vững chắc. Tuy nhiên, các lớp tính năng quan trọng để tạo ra dòng tiền (Provider Services) và người dùng mới (Community Viral) đang bị bỏ ngỏ hoặc làm dạng Stub UI. Roadmap V2 với các Sprint 2-3-4 sẽ dồn lực vá các lỗ hổng này.
