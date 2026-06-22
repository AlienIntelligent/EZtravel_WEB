# SYSTEM REDESIGN PROPOSAL

## 1. Kiến trúc hiện tại

Hệ thống đang chạy theo mô hình Microservices (.NET 10) phía Backend và Monolithic React SPA phía Frontend.
*   **Database**: SQL Server (Monolithic DB, schema tập trung).
*   **Backend**: 6 Microservices (Auth, Admin, Booking, Community, Place, Trip) chạy đằng sau YARP API Gateway.
*   **Frontend**: 1 Frontend duy nhất (WebClient) chứa tất cả các Role.

## 2. Các điểm nghẽn kiến trúc (Bottlenecks)

1.  **Dữ liệu phân mảnh ảo**: Database dùng chung 1 connection string nhưng Backend lại chia Microservice. Điều này dẫn đến pattern "Distributed Monolith". Khi join dữ liệu (VD: lấy Tên User cho Bài Viết), các service phải gọi HTTP chéo hoặc query thẳng vào bảng của service khác, gây rủi ro toàn vẹn dữ liệu.
2.  **Thiếu Real-time Engine**: Cốt lõi của "Trip Planner" là tính năng tương tác, nhưng thiếu WebSocket/SignalR.
3.  **Tên Microservice gây nhầm lẫn**: `BookingService` không làm tính năng Booking (do CRD đã loại bỏ Booking thật), mà thực chất đang làm tính năng "Provider Subscription".

## 3. Kiến trúc Đề xuất (Architecture V2)

### A. Thay đổi Bắt buộc (Must-have)

1.  **Đổi tên và Cấu trúc lại Service**:
    *   Đổi `BookingService` thành `ProviderService` để phản ánh đúng nghiệp vụ quản lý gói quảng bá.
    *   Tách `Moderation` (Kiểm duyệt) thành logic rõ ràng trong `AdminService`.
2.  **Tích hợp SignalR Hub**:
    *   Thêm `RealtimeService` hoặc nhúng SignalR vào `TripService` và cấu hình WebSocket passthrough trên YARP để hỗ trợ Co-editing (Cộng tác) và Notifications.
3.  **Thay thế UI Logic**:
    *   Frontend: Xóa bỏ các Stub/Mockup page hiện tại của Admin/Provider. Xây dựng UI động dựa trên thư viện UI components tiêu chuẩn (Shadcn UI / Material).
4.  **Phát triển Caching Layer**:
    *   Cài đặt Redis để cache danh sách Tỉnh/Thành, Tag, và các điểm đến Hot nhằm giảm tải SQL Server.

### B. Thay đổi Nên làm (Should-have)

1.  **Kiến trúc Database**: Chuyển dần sang mô hình Schema-per-service (Mỗi Microservice quản lý 1 DB Schema riêng) nếu team đủ lực, hoặc duy trì Shared-DB nhưng cấm nghiêm ngặt việc Microservice này join trực tiếp bảng của Microservice khác (phải dùng HTTP gRPC/REST hoặc EventBus).
2.  **Event-Driven Architecture**: Đưa RabbitMQ hoặc Azure Service Bus vào hệ thống.
    *   *Ví dụ:* Khi User Đăng ký tài khoản, bắn event `UserCreated` để `NotificationService` gửi email chào mừng, thay vì gọi API đồng bộ.
3.  **AI Microservice**: Tách riêng một service (có thể viết bằng Python/FastAPI) chuyên xử lý LLM, RAG và Prompt Engineering để tránh làm nặng hệ thống .NET core.

### C. Thay đổi Tùy chọn (Nice-to-have)

1.  **Frontend Micro-frontends**: Tách WebClient thành `Admin Portal`, `Provider Portal` và `Traveler App` riêng biệt để tăng tốc độ build và giảm Bundle size. (Tuy nhiên sẽ tốn công setup CI/CD).
2.  **ElasticSearch**: Áp dụng ElasticSearch cho tính năng "Khám phá" để tăng tốc độ tìm kiếm text (full-text search cho tên địa điểm, review).
