# BACKEND ANALYSIS V2

Đánh giá toàn diện kiến trúc Backend .NET Core 10.

## 1. Kiến trúc (Microservices + API Gateway)

*   **Điểm mạnh**: Chia tách rõ ràng các domain (Auth, Admin, Place, Trip, Booking, Community). Dễ dàng scale từng phần độc lập.
*   **Điểm yếu**: Setup CI/CD và chạy local nặng nề. Việc call chéo giữa các service (VD: Lấy thông tin User trong TripService) chưa được thể hiện rõ (Có thể đang dính gRPC/HTTP call bottleneck hoặc lạm dụng direct DB access).

## 2. API Design & Routing

*   **YARP (API Gateway)**: Là điểm cộng lớn, giúp Frontend chỉ cần gọi đến 1 endpoint duy nhất.
*   **Restful Standards**: Thiết kế URL tương đối chuẩn (`/api/trips`, `/api/places/hotels`).
*   **Vấn đề**: Một số endpoint Admin và Provider bị mix logic (VD: `BookingService` quản lý ProviderPackage). Cần đổi tên `BookingService` thành `ProviderService` cho chuẩn xác nghiệp vụ (do không có Booking Engine thực sự).

## 3. Service Layer & Repository Layer

*   **Repository Layer**: Sử dụng Generic Repository (`IGenericRepository`) và UnitOfWork. Điều này tốt cho CRUD cơ bản nhưng sẽ khó khăn khi cần các query phức tạp, JOIN nhiều bảng.
*   **Service Layer**: Logic đang phình to ở các file như `TripService` (Xử lý cả clone, budget, reorder). Nên tách nhỏ thành các UseCase/Command Handler (CQRS) nếu hệ thống lớn hơn.

## 4. DTO Layer

*   **Tình trạng**: Đang dùng chung project `ezTravel.DTO` cho mọi service.
*   **Vấn đề rủi ro**: Khi một Microservice thay đổi DTO, toàn bộ các service khác phải build lại. Làm mất tính độc lập của Microservices. Nên tách DTO về từng Service cụ thể hoặc dùng Shared Kernel hợp lý.

## 5. Security & Auth

*   Sử dụng JWT Bearer. Xử lý Token Refresh ổn.
*   **Vấn đề Authorization**: RBAC (Role-based) đang làm cứng. Chưa có Row-level security (Ví dụ: Provider A không được sửa Service của Provider B) - Cần verify lại trong logic code `PlaceService` xem đã check ID Provider chưa.

## 6. Performance & Tech Debt

*   **N+1 Query Issue**: Cần review lại việc dùng Entity Framework `Include()`. Ở những query lấy Lịch trình (bao gồm Ngày -> Địa Điểm -> Chi phí), nếu không cẩn thận sẽ dính N+1.
*   **Caching**: Chưa thấy dấu vết của Redis hoặc InMemory Caching cho các dữ liệu ít đổi (Danh sách Tỉnh/Thành, Danh mục Tag, Gói Quảng bá). Điều này làm tăng tải DB.
*   **Tech Debt**: SignalR chưa được triển khai cho tính năng Real-time collaboration.

## 7. Tổng kết Đề xuất
*   Đổi tên `BookingService` -> `ProviderService`.
*   Tích hợp Redis Caching cho API Read.
*   Thêm SignalR cho Trip Collaboration.
*   Kiểm tra toàn bộ phân quyền Row-level (Data ownership).
