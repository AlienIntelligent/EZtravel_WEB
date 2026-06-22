# SYSTEM INVENTORY REPORT

## 1. Database Inventory (Entity Framework Models)

### Account & User Domain
*   **NGUOI_DUNG**: Lưu trữ thông tin người dùng cơ bản (Traveller, Provider, Admin).
*   **OTP_XAC_THUC**: Quản lý mã OTP cho đăng ký, quên mật khẩu.
*   **REFRESH_TOKEN**: Quản lý phiên đăng nhập dài hạn.
*   **THEO_DOI_NGUOI_DUNG**: Quản lý quan hệ follower/following giữa các người dùng.

### Trip Planner Domain (Lịch trình)
*   **LICH_TRINH**: Cấu trúc chính của một chuyến đi.
*   **NGAY_LICH_TRINH**: Chi tiết từng ngày trong chuyến đi.
*   **DIA_DIEM_LICH_TRINH**: Các địa điểm ghé thăm trong ngày.
*   **DICH_VU_LICH_TRINH**: Các dịch vụ (khách sạn, nhà hàng) đặt trong lịch trình.
*   **CHI_PHI_DICH_VU_LICH_TRINH**: Quản lý ngân sách dự kiến/thực tế.
*   **CHIA_SE_LICH_TRINH**: Phân quyền cộng tác viên.
*   **LUU_LICH_TRINH**: Wishlist lịch trình.
*   **THICH_LICH_TRINH**: Lượt thích lịch trình công khai.
*   **LICH_SU_CLONE**: Lưu dấu vết nhân bản lịch trình.

### Provider & Service Domain
*   **NHA_CUNG_CAP**: Hồ sơ doanh nghiệp cung cấp dịch vụ.
*   **DICH_VU**: Các dịch vụ du lịch (Khách sạn, Nhà hàng, Hoạt động, Phương tiện).
*   **ANH_DICH_VU**: Thư viện ảnh dịch vụ.
*   **GOI_DICH_VU_NCC**: Danh mục các gói quảng bá (Free, Standard, Premium).
*   **DANG_KY_GOI_NCC**: Trạng thái subscription của NCC.
*   **THANH_TOAN_NCC**: Lịch sử giao dịch thanh toán gói.

### Location Domain (Địa điểm)
*   **DIA_DIEM**: Danh mục địa điểm du lịch chung.
*   **ANH_DIA_DIEM**: Thư viện ảnh địa điểm.
*   **TINH_THANH**: Danh mục tỉnh/thành phố hỗ trợ tìm kiếm.

### Community & Content Domain (Cộng đồng)
*   **BAI_VIET**: Blog du lịch do người dùng tạo.
*   **ANH_BAI_VIET**: Hình ảnh đính kèm bài viết.
*   **BINH_LUAN_BAI_VIET**: Bàn luận về bài viết/lịch trình.
*   **THICH_BAI_VIET**: Lượt thích bài viết.
*   **DANH_GIA**: Đánh giá 5 sao cho địa điểm, dịch vụ, lịch trình.
*   **ANH_DANH_GIA**: Ảnh đính kèm đánh giá.
*   **PHAN_HOI_DANH_GIA**: NCC trả lời đánh giá của khách.

### Admin & Moderation Domain
*   **BAO_CAO_NOI_DUNG**: User report nội dung xấu.
*   **DUYET_NOI_DUNG**: Nhật ký kiểm duyệt của Admin.

### Miscellaneous / AI Domain
*   **TAG**: Từ khóa phân loại.
*   **THONG_BAO**: Hệ thống thông báo in-app.
*   **GOI_DICH_VU**: Gói Premium cho Traveler (Freemium).
*   **DANG_KY_GOI**: Trạng thái subscription của Traveler.
*   **LICH_SU_AI**: Lưu trữ log chat với trợ lý ảo AI.

## 2. Backend Inventory (.NET 10 Microservices)

### Kiến trúc Microservices:
*   **ApiGateway** (YARP)
*   **AuthService**: Xử lý Identity, JWT, OTP.
*   **AdminService**: Admin panel, duyệt nội dung.
*   **BookingService**: Thực chất là quản lý Provider & Subscription (Gói quảng bá).
*   **CommunityService**: Blog, Review, Feed.
*   **PlaceService**: Địa điểm, Khách sạn, Nhà hàng, Hoạt động.
*   **TripService**: Lịch trình du lịch, Ngân sách.

### Services Layer:
*   `ActivityService`, `HotelService`, `RestaurantService`, `VehicleService`
*   `AdminService`
*   `AuthService`, `JwtService`
*   `CommunityService`
*   `NotificationService`
*   `PlaceService`
*   `PromotionService` (Xử lý thuật toán SearchRanking)
*   `NccPackageService`, `ProviderPackageValidationService`, `ProviderService`
*   `SearchRankingService`
*   `TripService`

## 3. Frontend Inventory (React + Vite + Redux RTK)

### Layouts:
*   `MainLayout`, `AuthLayout`, `AdminLayout`, `ProviderLayout`, `AILayout`

### Routes & Pages:
*   **Public**: `/` (Home), `/explore` (Khám phá), `/design-system`
*   **Auth**: `/login`, `/register`, `/forgot-password`, vv.
*   **Planner**: `/planner`, `/planner/:id`
*   **Admin**: `/admin`, `/admin/users`, `/admin/places`, `/admin/providers`, `/admin/services`, `/admin/provider-packages`, vv.
*   **Provider**: `/provider/dashboard`, `/provider/packages`, `/provider/services`, vv.
*   **AI Assistant**: `/ai`, `/ai/planner`, `/ai/history`

### State Management & API:
*   Sử dụng Redux Toolkit + RTK Query.
*   Các file cấu trúc theo dạng features/modules (Explore, Auth, Admin, Provider, AI).

## 4. AI Inventory

### Đã có:
*   **UI/UX**: Skeleton cho Layout `/ai`, Chatbot Assistant, AI Planner, AI History.
*   **Database**: Bảng `LICH_SU_AI` để lưu lịch sử chat.

### Chưa có:
*   **Backend Integration**: Chưa tích hợp LLM Provider (OpenAI/Gemini/Claude).
*   **Prompt Engineering**: Chưa có logic để AI generate cấu trúc JSON cho Trip Planner.
*   **Logic RAG**: Chưa nhúng dữ liệu địa điểm nội bộ vào AI prompt để đưa ra gợi ý chính xác.
