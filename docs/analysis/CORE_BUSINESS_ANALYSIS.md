# CORE BUSINESS ANALYSIS

Tài liệu này mổ xẻ nghiệp vụ cốt lõi của EZTravel dựa trên CRD và thực tiễn để định hướng Roadmap V2.

---

## 1. Traveler Domain (Khách du lịch)

Đây là đối tượng tạo ra Data và Traffic cho hệ thống.

*   **Giá trị cốt lõi**: Trải nghiệm lập kế hoạch chuyến đi (Trip Planner) dễ dàng, trực quan.
*   **Vấn đề hiện tại**:
    *   Tính năng Planner đã chạy tốt (kéo thả, ngân sách) nhưng bị "cô lập".
    *   Tính năng Mạng xã hội (Share, Like, Comment lịch trình) **CHƯA CÓ**. Điều này cản trở hiệu ứng Viral (Network Effect).
    *   Người dùng không có động lực tạo tài khoản nếu chỉ để xếp lịch một mình.
*   **Hướng giải quyết**: Ưu tiên cao nhất cho việc hoàn thiện tính năng Share Public và Community Feed. Biến EZTravel thành "Pinterest của dân du lịch".

## 2. Provider Domain (Nhà cung cấp dịch vụ)

Đây là đối tượng tạo ra Doanh thu (Revenue) cho hệ thống thông qua việc mua gói Quảng bá.

*   **Giá trị cốt lõi**: Khả năng tiếp cận tệp khách hàng Traveler chất lượng cao.
*   **Vấn đề hiện tại**:
    *   Hệ thống Đăng ký Gói Quảng Bá đã có API/UI, nhưng tính năng **Tự Đăng Dịch Vụ** lại chưa hoàn thiện. (Họ mua gói nhưng không đăng được phòng/tour thì gói quảng bá vô nghĩa).
    *   Thuật toán tính điểm xếp hạng `PromotionService` đã có, nhưng Frontend chưa làm phần Dashboard cho NCC xem báo cáo click/view.
*   **Hướng giải quyết**: Tập trung làm tính năng CRUD Dịch vụ cho Provider. Thêm biểu đồ Analytics thật để họ thấy giá trị khi mua gói.

## 3. Admin Domain (Quản trị viên)

Đối tượng duy trì sự "Sạch - Đẹp - Công bằng" cho hệ thống.

*   **Giá trị cốt lõi**: Kiểm soát nội dung (Moderation) và phê duyệt gói.
*   **Vấn đề hiện tại**:
    *   Tính năng duyệt Provider rườm rà.
    *   Chưa có tool duyệt Review/Blog.
    *   Hệ thống Quản lý Gói (Admin cấp gói thủ công hoặc giải quyết khiếu nại thanh toán) chưa lên UI.
*   **Hướng giải quyết**: Xây dựng Moderation Center gom tất cả (Duyệt NCC, Duyệt Bài, Duyệt Review) về một màn hình. Hoàn thiện luồng kiểm soát Subscription của NCC.

## 4. AI Domain (Trợ lý thông minh)

Điểm nhấn (USP) của hệ thống so với đối thủ.

*   **Vấn đề hiện tại**: Mới chỉ làm vỏ (UI). Cốt lõi (Logic LLM) đang thiếu.
*   **Hướng giải quyết**:
    *   Cần một dịch vụ riêng biệt (hoặc Python microservice) xử lý logic Prompt và RAG.
    *   AI không nên chỉ là chatbot. Cần có tính năng "1-click Magic": Tự sinh lộ trình 3 ngày 2 đêm dựa theo budget và gửi thẳng vào Workspace.
