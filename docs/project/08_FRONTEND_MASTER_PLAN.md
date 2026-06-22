# 08 – FRONTEND MASTER PLAN (Kiến Trúc Đích)

**Vai trò**: Lead Frontend Architect  
**Mục đích**: Mô tả Frontend hoàn chỉnh khi EZTravel triển khai đúng CRD  
**Nguồn chân lý**: CRD_EZtravel_v3.docx  
**Tính chất**: Target Architecture — không phân tích code hiện tại, không đề cập tiến độ

---

## 1. TỔNG QUAN FRONTEND ARCHITECTURE

### 1.1 Layout Architecture

EZTravel sử dụng kiến trúc Layout lồng ghép (Nested Layout), mỗi Layout phục vụ một nhóm tác nhân và ngữ cảnh sử dụng riêng.

```
┌─────────────────────────────────────────────┐
│                  App Shell                   │
├─────────┬───────────────────────────────────┤
│         │  PublicLayout                     │
│         │  ├─ Home                          │
│         │  ├─ Explore                       │
│         │  └─ Community Feed                │
│         ├───────────────────────────────────┤
│         │  AuthLayout                       │
│         │  ├─ Login                         │
│  Route  │  ├─ Register                     │
│  Switch │  ├─ ForgotPassword               │
│         │  └─ OTP / ResetPassword          │
│         ├───────────────────────────────────┤
│         │  TravelerLayout                   │
│         │  ├─ Dashboard                     │
│         │  ├─ My Trips                      │
│         │  ├─ Planner                       │
│         │  ├─ Saved                         │
│         │  └─ Profile                       │
│         ├───────────────────────────────────┤
│         │  AILayout                         │
│         │  ├─ Chat                          │
│         │  ├─ Planner                       │
│         │  ├─ Route Optimizer               │
│         │  ├─ Budget Advisor                │
│         │  └─ History                       │
│         ├───────────────────────────────────┤
│         │  ProviderLayout                   │
│         │  ├─ Dashboard                     │
│         │  ├─ Services                      │
│         │  ├─ Packages                      │
│         │  ├─ Promotions                    │
│         │  └─ Reviews                       │
│         ├───────────────────────────────────┤
│         │  AdminLayout                      │
│         │  ├─ Dashboard                     │
│         │  ├─ Users                         │
│         │  ├─ Moderation                    │
│         │  ├─ Categories                    │
│         │  ├─ Coupons                       │
│         │  ├─ Provider Packages             │
│         │  └─ Reports                       │
└─────────┴───────────────────────────────────┘
```

#### Đặc tả từng Layout

| Layout | Mục đích | Thành phần cố định | Guard |
|---|---|---|---|
| **PublicLayout** | Trang công khai cho mọi người dùng (Guest, Traveler) | Header (logo, nav, search, auth buttons), Footer | Không |
| **AuthLayout** | Luồng xác thực | Logo trung tâm, ảnh nền du lịch, form card | GuestGuard (chuyển đến Dashboard nếu đã đăng nhập) |
| **TravelerLayout** | Workspace cá nhân Traveler | Sidebar (Dashboard, My Trips, Saved, Profile), Header (avatar, notifications) | ProtectedRoute |
| **AILayout** | Workspace AI Assistant | Sidebar (Chat, Planner, Route, Budget, History), Chat panel | ProtectedRoute (kiểm tra gói Premium nếu cần) |
| **ProviderLayout** | Portal Nhà cung cấp | Sidebar (Dashboard, Services, Packages, Promotions, Reviews), Header NCC | ProtectedRoute + RoleGuard("PROVIDER") |
| **AdminLayout** | Panel quản trị | Sidebar (Dashboard, Users, Moderation, Categories, Coupons, Packages, Reports), Header Admin | ProtectedRoute + RoleGuard("ADMIN") |

### 1.2 Route Architecture

Kiến trúc route phân cấp theo domain, mỗi domain có prefix riêng biệt.

```
/                           → PublicLayout
/explore                    → PublicLayout
/explore/:id                → PublicLayout
/community                  → PublicLayout
/community/blog/:id         → PublicLayout

/login                      → AuthLayout
/register                   → AuthLayout
/forgot-password            → AuthLayout
/verify-otp                 → AuthLayout
/reset-password             → AuthLayout

/dashboard                  → TravelerLayout
/my-trips                   → TravelerLayout
/planner/:id                → TravelerLayout (full-screen variant)
/saved                      → TravelerLayout
/profile                    → TravelerLayout
/profile/:slug              → PublicLayout (hồ sơ công khai)

/ai                         → AILayout
/ai/planner                 → AILayout
/ai/route                   → AILayout
/ai/budget                  → AILayout
/ai/history                 → AILayout

/provider                   → ProviderLayout
/provider/dashboard         → ProviderLayout
/provider/services          → ProviderLayout
/provider/services/new      → ProviderLayout
/provider/packages          → ProviderLayout
/provider/promotions        → ProviderLayout
/provider/reviews           → ProviderLayout
/provider/profile           → ProviderLayout

/admin                      → AdminLayout
/admin/dashboard            → AdminLayout
/admin/users                → AdminLayout
/admin/moderation           → AdminLayout
/admin/moderation/providers → AdminLayout
/admin/moderation/services  → AdminLayout
/admin/moderation/reviews   → AdminLayout
/admin/moderation/blogs     → AdminLayout
/admin/moderation/trips     → AdminLayout
/admin/categories           → AdminLayout
/admin/coupons              → AdminLayout
/admin/packages             → AdminLayout
/admin/reports              → AdminLayout
```

### 1.3 Domain Architecture

```
┌────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Traveler │ │ Explore  │ │Community │ │    AI    │  │
│  │  Domain  │ │  Domain  │ │  Domain  │ │  Domain  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│  ┌────┴─────┐ ┌────┴─────┐                             │
│  │ Provider │ │  Admin   │                              │
│  │  Domain  │ │  Domain  │                              │
│  └────┬─────┘ └────┬─────┘                              │
│       │             │                                    │
├───────┴─────────────┴────────────────────────────────────┤
│                    STATE LAYER                           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Redux Store (RTK)                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐         │   │
│  │  │authSlice │ │tripSlice │ │ aiSlice  │  ...    │   │
│  │  └──────────┘ └──────────┘ └──────────┘         │   │
│  │  ┌──────────────────────────────────────┐        │   │
│  │  │          RTK Query APIs              │        │   │
│  │  │  auth | trip | place | provider |    │        │   │
│  │  │  admin | community | ai | service   │        │   │
│  │  └──────────────────────────────────────┘        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    DATA LAYER                           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Backend REST API (via API Gateway)        │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 2. ROUTE INVENTORY

### 2.1 Public Routes

| Route | Trang | Mô tả | CRD |
|---|---|---|---|
| `/` | Home | Trang chủ: trending, gợi ý, NCC nổi bật | §3.3.3 |
| `/explore` | ExploreWorkspace | Tìm kiếm địa điểm & dịch vụ (list + map) | §3.3.1 |
| `/explore/:id` | ExploreDetail | Chi tiết địa điểm/dịch vụ (gallery, giá, review) | §3.3.2 |
| `/community` | CommunityFeed | Lịch trình công khai, bài viết, xu hướng | §3.4.1 |
| `/community/blog/:id` | BlogDetail | Chi tiết bài viết blog | §3.4.3 |
| `/community/trip/:id` | TripDetail | Chi tiết lịch trình công khai (readonly) | §3.4.1 |
| `/profile/:slug` | PublicProfile | Hồ sơ công khai người dùng | §3.1.4 |

### 2.2 Auth Routes

| Route | Trang | Mô tả | CRD |
|---|---|---|---|
| `/login` | Login | Đăng nhập (email + password) | §3.1.2 |
| `/register` | Register | Đăng ký (email, password, tên, phone) | §3.1.1 |
| `/forgot-password` | ForgotPassword | Nhập email nhận link reset | §3.1.3 |
| `/verify-otp` | OtpVerification | Nhập mã OTP 6 số | §3.1.1 |
| `/reset-password` | ResetPassword | Đặt mật khẩu mới | §3.1.3 |

### 2.3 Traveler Routes

| Route | Trang | Mô tả | CRD |
|---|---|---|---|
| `/dashboard` | TravelerDashboard | Tổng quan: chuyến đi gần đây, gợi ý, thống kê nhanh | §3.2 |
| `/my-trips` | MyTrips | Danh sách lịch trình cá nhân (Nháp / Công khai) | §3.2.1 |
| `/planner/:id` | TripPlanner | Editor lịch trình: DnD, bản đồ, ngân sách | §3.2.2-3.2.4 |
| `/saved` | SavedItems | Lịch trình đã lưu (bookmark) | §3.4.4 |
| `/profile` | MyProfile | Hồ sơ cá nhân: avatar, tên, phone, slug, đổi MK | §3.1.4 |

### 2.4 AI Routes

| Route | Trang | Mô tả | CRD |
|---|---|---|---|
| `/ai` | AIChat | Chatbot du lịch tự nhiên | §3.5.4 |
| `/ai/planner` | AITripGenerator | Sinh lịch trình tự động từ input | §3.5.1 |
| `/ai/route` | AIRouteOptimizer | Tối ưu thứ tự địa điểm trong ngày | §3.5.2 |
| `/ai/budget` | AIBudgetAdvisor | Phân tích và tư vấn phân bổ ngân sách | §3.5.3 |
| `/ai/history` | AIHistory | Lịch sử hội thoại AI | §3.5 |

> **Lưu ý**: AI chưa triển khai do chưa chọn AI Provider. Các trang này thuộc phạm vi chính thức CRD Phase 3 và phải được giữ trong blueprint.

### 2.5 Provider Routes

| Route | Trang | Mô tả | CRD |
|---|---|---|---|
| `/provider/dashboard` | ProviderDashboard | Tổng quan: dịch vụ, gói quảng bá, thống kê | §3.6.3 |
| `/provider/services` | ServicesManager | Danh sách dịch vụ, trạng thái, ẩn/hiện | §3.6.2, §3.6.3 Tab Dịch vụ |
| `/provider/services/new` | ServiceForm | Form tạo dịch vụ theo loại (KS/NH/PT/HĐ) | §3.6.2 |
| `/provider/services/:id/edit` | ServiceForm | Form sửa dịch vụ | §3.6.2 |
| `/provider/packages` | ProviderPackages | Danh sách gói, đăng ký, so sánh | §3.6.3 Tab Gói quảng bá, §3.6.4 |
| `/provider/promotions` | ProviderPromotions | Hiệu quả quảng bá, badge, hiển thị | §3.6.3 Tab Analytics, SP012 |
| `/provider/reviews` | ProviderReviews | Đánh giá từ khách, phản hồi | SP008 |
| `/provider/profile` | ProviderProfile | Hồ sơ doanh nghiệp | SP002 |

### 2.6 Admin Routes

| Route | Trang | Mô tả | CRD |
|---|---|---|---|
| `/admin/dashboard` | AdminDashboard | KPI hệ thống: users, trips, AI, doanh thu | §3.7.5 |
| `/admin/users` | UserManager | Danh sách, tìm kiếm, khóa/mở khóa, reset MK | §3.7.2 |
| `/admin/moderation` | ModerationHub | Tổng quan kiểm duyệt (4 luồng) | §3.7.1 |
| `/admin/moderation/providers` | ProviderModeration | Duyệt đăng ký NCC | §3.7.1 |
| `/admin/moderation/services` | ServiceModeration | Duyệt dịch vụ NCC | §3.7.1 |
| `/admin/moderation/reviews` | ReviewModeration | Duyệt đánh giá | §3.7.1 |
| `/admin/moderation/blogs` | BlogModeration | Duyệt bài viết blog | §3.7.1 |
| `/admin/moderation/trips` | TripModeration | Duyệt lịch trình công khai | §3.7.1 |
| `/admin/categories` | CategoryManager | CRUD tỉnh/thành, tag, loại dịch vụ | §3.7.3 |
| `/admin/coupons` | CouponManager | CRUD mã giảm giá Premium Traveler | §3.7.4 |
| `/admin/packages` | AdminPackageManager | Quản lý gói NCC: cấp, gia hạn, hết hạn | §3.6.4 |
| `/admin/reports` | ReportsExport | Thống kê chi tiết, xuất Excel/PDF | §3.7.5 |

---

## 3. SCREEN INVENTORY

### 3.1 Màn hình Public (7 màn hình)

| # | Màn hình | Mục đích | CRD | SRS |
|---|---|---|---|---|
| P-01 | **Home** | Trang chủ: xu hướng, gợi ý, NCC nổi bật, CTA tạo chuyến đi | §3.3.3 | — |
| P-02 | **ExploreWorkspace** | Tìm kiếm đa tiêu chí, list+map đồng bộ | §3.3.1 | UC011 |
| P-03 | **ExploreDetail** | Chi tiết dịch vụ: gallery, giá, liên hệ, review, lịch trình liên quan | §3.3.2 | UC011 |
| P-04 | **CommunityFeed** | Lịch trình công khai, blog, xu hướng, tương tác | §3.4.1, §3.4.4 | UC014 |
| P-05 | **BlogDetail** | Chi tiết bài viết blog: nội dung, ảnh, bình luận, like | §3.4.3 | — |
| P-06 | **TripDetail** | Chi tiết lịch trình công khai: timeline, bản đồ, chi phí, like/clone | §3.4.1 | UC014, UC015 |
| P-07 | **PublicProfile** | Hồ sơ công khai: avatar, lịch trình đã chia sẻ, blog, thống kê | §3.1.4 | UC004 |

### 3.2 Màn hình Auth (5 màn hình)

| # | Màn hình | Mục đích | CRD | SRS |
|---|---|---|---|---|
| A-01 | **Login** | Đăng nhập bằng email/password | §3.1.2 | UC002 |
| A-02 | **Register** | Đăng ký tài khoản mới | §3.1.1 | UC001 |
| A-03 | **ForgotPassword** | Yêu cầu link đặt lại MK | §3.1.3 | UC003 |
| A-04 | **OtpVerification** | Nhập mã OTP 6 số từ email | §3.1.1 | UC001 |
| A-05 | **ResetPassword** | Đặt mật khẩu mới | §3.1.3 | UC003 |

### 3.3 Màn hình Traveler (5 màn hình)

| # | Màn hình | Mục đích | CRD | SRS |
|---|---|---|---|---|
| T-01 | **TravelerDashboard** | Tổng quan cá nhân: chuyến đi gần đây, gợi ý, thống kê | §3.2 | UC005 |
| T-02 | **MyTrips** | Danh sách lịch trình: Nháp/Công khai, filter, sort | §3.2.1 | UC009 |
| T-03 | **TripPlanner** | Editor DnD: thêm địa điểm, sắp xếp, ngân sách, bản đồ, cộng tác | §3.2.2-3.2.5 | UC005-UC010, UC017 |
| T-04 | **SavedItems** | Lịch trình đã lưu (bookmark) | §3.4.4 | — |
| T-05 | **MyProfile** | Hồ sơ cá nhân: chỉnh sửa, avatar, slug, đổi MK | §3.1.4 | UC004 |

### 3.4 Màn hình AI (5 màn hình)

| # | Màn hình | Mục đích | CRD | SRS |
|---|---|---|---|---|
| AI-01 | **AIChat** | Chatbot du lịch tự nhiên (20k token/ngày Free, unlimited Premium) | §3.5.4 | — |
| AI-02 | **AITripGenerator** | Sinh lịch trình từ: điểm đến, số ngày, ngân sách, đối tượng, phong cách | §3.5.1 | — |
| AI-03 | **AIRouteOptimizer** | Tối ưu thứ tự địa điểm trong một ngày theo địa lý + thời gian | §3.5.2 | — |
| AI-04 | **AIBudgetAdvisor** | Phân tích tỷ lệ phân bổ ngân sách, chỉ hạng mục vượt mức | §3.5.3 | — |
| AI-05 | **AIHistory** | Lịch sử hội thoại, lịch trình AI đã sinh | §3.5 | — |

### 3.5 Màn hình Provider (8 màn hình)

| # | Màn hình | Mục đích | CRD | SRS |
|---|---|---|---|---|
| SP-01 | **ProviderDashboard** | Tổng quan: KPI dịch vụ, gói quảng bá, rating, badge | §3.6.3 | SP009 |
| SP-02 | **ServicesManager** | Danh sách dịch vụ, trạng thái kiểm duyệt, ẩn/hiện | §3.6.2, §3.6.3 | SP003-SP005 |
| SP-03 | **ServiceForm** | Form tạo/sửa dịch vụ theo 4 loại | §3.6.2 | SP003, SP004 |
| SP-04 | **ProviderPackages** | Danh sách gói, so sánh, đăng ký, thanh toán | §3.6.4 | SP010, SP011 |
| SP-05 | **ProviderPromotions** | Hiệu quả quảng bá: Impressions, Bookmarks, Planner adds, AI, CTR | §3.6.3 Tab Analytics | SP012 |
| SP-06 | **ProviderReviews** | Đánh giá từ khách, phản hồi NCC | §3.4.2 | SP008 |
| SP-07 | **ProviderProfile** | Hồ sơ doanh nghiệp: tên, logo, mô tả, liên hệ | §3.6.1 | SP002 |
| SP-08 | **ProviderRegistration** | Form đăng ký NCC: thông tin DN, giấy phép, loại hình | §3.6.1 | SP001 |

### 3.6 Màn hình Admin (12 màn hình)

| # | Màn hình | Mục đích | CRD | SRS |
|---|---|---|---|---|
| AD-01 | **AdminDashboard** | KPI: users, trips, providers, services, AI, doanh thu | §3.7.5 | UC021 |
| AD-02 | **UserManager** | Danh sách user, tìm kiếm, khóa/mở khóa, reset MK | §3.7.2 | UC018 |
| AD-03 | **ModerationHub** | Tổng quan 4 luồng kiểm duyệt | §3.7.1 | UC019 |
| AD-04 | **ProviderModeration** | Duyệt đăng ký NCC: xem hồ sơ, tải giấy tờ, duyệt/từ chối + lý do | §3.7.1 | UC019 |
| AD-05 | **ServiceModeration** | Duyệt dịch vụ NCC mới: thông tin, ảnh, chất lượng | §3.7.1 | UC019 |
| AD-06 | **ReviewModeration** | Duyệt đánh giá: nội dung, ngôn từ | §3.7.1 | UC019 |
| AD-07 | **BlogModeration** | Duyệt bài viết: nội dung, spam | §3.7.1 | UC019 |
| AD-08 | **TripModeration** | Duyệt lịch trình công khai | §3.7.1 | UC019 |
| AD-09 | **CategoryManager** | CRUD: tỉnh/thành, tag, loại dịch vụ, địa điểm nổi bật | §3.7.3 | UC020 |
| AD-10 | **CouponManager** | CRUD mã giảm giá cho gói Premium Traveler | §3.7.4 | UC022 |
| AD-11 | **AdminPackageManager** | Quản lý gói NCC: cấp, gia hạn, hết hạn, thống kê | §3.6.4 | — |
| AD-12 | **ReportsExport** | Thống kê chi tiết, lọc thời gian, xuất Excel/PDF | §3.7.5 | UC021 |

**Tổng**: 42 màn hình

---

## 4. TRAVELER DOMAIN

### 4.1 TravelerDashboard

**Chức năng**:
- Hiển thị lịch trình gần đây (3-5 chuyến gần nhất)
- Gợi ý điểm đến nổi bật
- Thống kê nhanh (số chuyến đi, tổng chi tiêu)
- Nút nổi bật "**+ Tạo chuyến đi mới**"
- Quick links: My Trips, Saved, Profile

**Components**:
- `RecentTripsCarousel` — danh sách lịch trình gần đây dạng thẻ
- `SuggestedDestinations` — gợi ý địa điểm trending
- `QuickStatsCard` — thống kê cá nhân
- `CreateTripCTA` — nút tạo chuyến đi mới, mở modal `CreateTripForm`
- `CreateTripForm` — form nhập: tên, điểm đến, ngày bắt đầu/kết thúc, số người, ngân sách

**APIs**:
- `GET /trips` — lấy lịch trình của user
- `POST /trips/recommendations` — gợi ý
- `GET /providers/featured` — NCC nổi bật

**Database Mapping**:
- `LICH_TRINH` — danh sách lịch trình
- `DIA_DIEM` — gợi ý địa điểm
- `TINH_THANH` — tỉnh/thành phố

### 4.2 TripPlanner

**Chức năng** (CRD §3.2.2-3.2.5):
- Timeline chia theo từng ngày — mỗi tab ngày là một "canvas"
- Tìm kiếm địa điểm/dịch vụ và kéo-thả vào ngày
- Sắp xếp thứ tự trong ngày hoặc di chuyển giữa các ngày (DnD)
- Mỗi địa điểm: giờ dự kiến, ghi chú, chi phí theo danh mục
- Template dịch vụ thiết yếu: ăn, ở, đi lại, vui chơi
- Bản đồ nhúng hiển thị điểm đánh dấu + gợi ý đường đi
- Tổng chi phí realtime + cảnh báo vượt ngân sách (đỏ)
- Nút chia sẻ công khai / cộng tác nhóm
- Nút clone

**Components**:
- `TripHeader` — tên chuyến đi, ngày, ngân sách tổng, nút share/clone
- `DayTabBar` — tab ngày, có thể thêm/xóa ngày
- `DayCanvas` — canvas cho 1 ngày: danh sách địa điểm DnD
- `PlaceCard` — thẻ địa điểm trong canvas (giờ, ghi chú, chi phí)
- `ServiceSlot` — slot dịch vụ thiết yếu (ăn, ở, đi lại, vui chơi)
- `SearchPanel` — panel tìm kiếm bên phải, kết quả kéo-thả được
- `MapPanel` — bản đồ Leaflet/Google Maps hiển thị vị trí + route
- `BudgetPanel` — tổng chi phí, chi phí theo ngày, ngân sách còn lại
- `BudgetAlert` — cảnh báo đỏ khi vượt ngân sách
- `CollaborationBar` — thanh hiển thị thành viên online (SignalR)
- `InviteModal` — modal mời cộng tác (email + quyền View/Edit)

**APIs**:
- `GET /trips/{id}` — chi tiết lịch trình
- `PUT /trips/{id}` — cập nhật lịch trình
- `POST /trips/{id}/locations` — thêm địa điểm
- `DELETE /trips/{id}/items/{itemId}` — xóa địa điểm
- `PUT /trips/{id}/reorder` — sắp xếp lại
- `GET /trips/{id}/cost` — tính chi phí
- `POST /trips/{id}/clone` — clone
- `GET /places/search` — tìm kiếm địa điểm
- `GET /places/hotels/search` — tìm khách sạn
- `GET /places/restaurants/search` — tìm nhà hàng

**Database Mapping**:
- `LICH_TRINH` — lịch trình chính
- `NGAY_LICH_TRINH` — từng ngày
- `DIA_DIEM_LICH_TRINH` — địa điểm trong ngày
- `DICH_VU_LICH_TRINH` — dịch vụ trong ngày
- `CHI_PHI_DICH_VU_LICH_TRINH` — chi phí dịch vụ
- `CHIA_SE_LICH_TRINH` — chia sẻ/cộng tác
- `LICH_SU_CLONE` — lịch sử clone

### 4.3 MyTrips

**Chức năng**:
- Danh sách tất cả lịch trình cá nhân
- Filter: Nháp / Công khai / Tất cả
- Sort: mới nhất / cũ nhất / tên
- Menu hành động (...): Chỉnh sửa, Sao chép, Chia sẻ, Xóa
- Xóa: hộp thoại xác nhận

**Components**:
- `TripListFilter` — bộ lọc trạng thái
- `TripCard` — thẻ lịch trình (tên, ngày, điểm đến, thumbnail, trạng thái)
- `TripActionMenu` — menu dropdown (Edit, Clone, Share, Delete)
- `DeleteConfirmDialog` — hộp thoại xác nhận xóa
- `EmptyTripState` — trạng thái rỗng với CTA tạo mới

**APIs**:
- `GET /trips` — danh sách
- `DELETE /trips/{id}` — xóa
- `POST /trips/{id}/clone` — clone

**Database Mapping**: `LICH_TRINH`

### 4.4 SavedItems

**Chức năng**:
- Lịch trình đã bookmark (save)
- Địa điểm đã lưu

**Components**:
- `SavedTripsList` — danh sách lịch trình đã lưu
- `SavedPlacesList` — danh sách địa điểm đã lưu

**Database Mapping**: `LUU_LICH_TRINH`

### 4.5 MyProfile

**Chức năng** (CRD §3.1.4):
- Hiển thị và chỉnh sửa: ảnh đại diện, tên hiển thị, số điện thoại, slug
- Đổi mật khẩu (xác nhận MK cũ trước)

**Components**:
- `AvatarUpload` — upload ảnh đại diện (PNG/JPG/JPEG, ≤ 5MB)
- `ProfileForm` — form chỉnh sửa thông tin
- `ChangePasswordForm` — form đổi mật khẩu (MK cũ → MK mới → xác nhận)
- `SlugPreview` — preview URL hồ sơ công khai

**APIs**:
- `GET /auth/me` — lấy thông tin
- `PUT /auth/profile` — cập nhật

**Database Mapping**: `NGUOI_DUNG`

---

## 5. EXPLORE DOMAIN

### 5.1 ExploreWorkspace

**Chức năng** (CRD §3.3.1):
- Tìm kiếm kết hợp: từ khóa, tỉnh/thành, loại, khoảng giá, xếp hạng, tag
- Hai chế độ đồng bộ: list view + map view
- Nhấn điểm trên bản đồ → cuộn thẻ tương ứng
- Nhấn thẻ → highlight trên bản đồ

**Components**:
- `SearchBar` — ô tìm kiếm chính
- `FilterPanel` — bộ lọc: loại hình, tỉnh/thành, giá, rating, tag
- `ExploreGrid` — danh sách kết quả dạng grid
- `ExploreCard` — thẻ kết quả: ảnh, tên, rating, giá, badge NCC
- `ExploreMap` — bản đồ Leaflet với markers
- `ViewToggle` — nút chuyển list/map/split view
- `PromotedBanner` — banner NCC quảng bá (từ `GET /providers/featured`)
- `PartnerBadge` — hiển thị badge đối tác (từ `badgeType` backend)

**APIs**:
- `GET /places/search?keyword=...&province=...&rating=...&page=...`
- `GET /places/hotels/search?...`
- `GET /places/restaurants/search?...`
- `GET /places/activities/search?...`
- `GET /places/vehicles/search?...`
- `GET /providers/featured`
- `GET /providers/explore-promoted`

**Database Mapping**: `DIA_DIEM`, `DICH_VU`, `TINH_THANH`, `TAG`, `DIA_DIEM_TAG`, `NHA_CUNG_CAP`, `GOI_DICH_VU_NCC`

### 5.2 ExploreDetail

**Chức năng** (CRD §3.3.2):
- Mô tả đầy đủ dịch vụ/địa điểm
- Gallery ảnh
- Giá tham khảo
- Thông tin liên hệ NCC
- Đánh giá tổng hợp từ cộng đồng
- Lịch trình public có địa điểm này
- Nút "**Thêm vào lịch trình**"

**Components**:
- `DetailHeader` — tên, rating tổng, badge NCC
- `ImageGallery` — gallery ảnh swipeable
- `PriceInfo` — bảng giá tham khảo
- `ContactInfo` — thông tin liên hệ NCC
- `ReviewSummary` — điểm tổng hợp + breakdown (vị trí, chất lượng, dịch vụ, giá trị)
- `ReviewList` — danh sách review
- `WriteReviewForm` — form viết đánh giá mới
- `RelatedTrips` — lịch trình công khai có địa điểm này
- `AddToPlannerButton` — nút thêm vào lịch trình (mở selector chọn lịch trình + ngày)
- `MapEmbed` — bản đồ vị trí

**APIs**:
- `GET /places/{id}` hoặc `GET /places/hotels/{id}` etc.
- `GET /reviews/place/{id}` hoặc `GET /reviews/service/{id}`
- `POST /reviews` — gửi đánh giá

**Database Mapping**: `DIA_DIEM`, `ANH_DIA_DIEM`, `DICH_VU`, `ANH_DICH_VU`, `DANH_GIA`, `ANH_DANH_GIA`

### 5.3 Reviews

**Chức năng** (CRD §3.4.2):
- Traveler viết đánh giá: sao (1-5), điểm thành phần, text, ảnh
- NCC phản hồi đánh giá
- Kiểm duyệt tự động + Admin

**Components**:
- `StarRating` — chọn sao 1-5
- `SubRatings` — vị trí, chất lượng, dịch vụ, giá trị
- `ReviewTextInput` — textarea nội dung
- `ReviewImageUpload` — upload ảnh thực tế
- `ReviewItem` — một đánh giá: user, sao, nội dung, ảnh, ngày
- `ProviderReply` — phản hồi của NCC dưới review

**APIs**:
- `POST /reviews` — gửi
- `GET /reviews/place/{id}` — xem theo địa điểm
- `GET /reviews/service/{id}` — xem theo dịch vụ

**Database Mapping**: `DANH_GIA`, `ANH_DANH_GIA`, `PHAN_HOI_DANH_GIA`

---

## 6. COMMUNITY DOMAIN

### 6.1 CommunityFeed

**Chức năng** (CRD §3.4.1, §3.4.4):
- Lịch trình công khai từ cộng đồng
- Bài viết blog
- Like, save, bình luận
- Feed hoạt động

**Components**:
- `FeedTabs` — tab Lịch trình / Blog / Xu hướng
- `TripFeedCard` — thẻ lịch trình công khai (tên, user, like, clone count)
- `BlogFeedCard` — thẻ bài viết blog
- `LikeButton` — nút like
- `SaveButton` — nút bookmark
- `CloneButton` — nút clone lịch trình
- `CommentSection` — section bình luận

**APIs**:
- `GET /feeds` — feed cộng đồng
- `POST /feeds/{tripId}/like` — like
- `POST /feeds/{tripId}/comment` — bình luận
- `GET /feeds/{tripId}/comments` — xem bình luận

**Database Mapping**: `LICH_TRINH`, `THICH_LICH_TRINH`, `LUU_LICH_TRINH`, `BAI_VIET`

### 6.2 BlogDetail

**Chức năng** (CRD §3.4.3):
- Nội dung bài viết dạng rich text
- Ảnh đính kèm
- Liên kết đến lịch trình và địa điểm
- Bình luận, like

**Components**:
- `BlogContent` — nội dung rich text
- `BlogGallery` — ảnh bài viết
- `LinkedTrips` — lịch trình liên quan
- `LinkedPlaces` — địa điểm liên quan
- `BlogComments` — bình luận
- `BlogLikeButton` — like bài viết

**Database Mapping**: `BAI_VIET`, `ANH_BAI_VIET`, `BINH_LUAN_BAI_VIET`, `THICH_BAI_VIET`

### 6.3 TripDetail (Public)

**Chức năng** (CRD §3.4.1):
- Xem lịch trình công khai: timeline ngày, địa điểm, bản đồ tổng quan
- Tổng ngân sách ước tính
- Số lượt like, clone
- Nút clone

**Components**:
- `TripTimeline` — timeline read-only theo ngày
- `TripMapOverview` — bản đồ tổng quan tất cả điểm
- `TripBudgetSummary` — tóm tắt chi phí
- `TripStats` — like, clone, views
- `CloneTripButton` — nút clone về tài khoản cá nhân

**APIs**:
- `GET /trips/{id}` — chi tiết
- `POST /trips/{id}/clone` — clone
- `POST /feeds/{tripId}/like` — like

**Database Mapping**: `LICH_TRINH`, `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `LICH_SU_CLONE`, `THICH_LICH_TRINH`

---

## 7. AI DOMAIN

> **Trạng thái**: AI chưa triển khai do chưa chọn AI Provider. Toàn bộ domain này thuộc **phạm vi chính thức CRD Phase 3** và phải giữ trong blueprint.

### 7.1 AIChat (CRD §3.5.4)

**Chức năng**:
- Chat tự nhiên về du lịch
- AI trả lời theo ngữ cảnh lịch trình đang soạn
- Gói Free: 20.000 token/ngày
- Gói Premium: không giới hạn

**Components**:
- `ChatMessageList` — danh sách tin nhắn
- `ChatInput` — input gửi tin nhắn
- `ChatBubble` — bóng chat (user / AI)
- `QuotaIndicator` — hiển thị token còn lại (Free)
- `UpgradePremiumBanner` — banner nâng cấp Premium

**Database Mapping**: `LICH_SU_AI`, `GOI_DICH_VU`, `DANG_KY_GOI`

### 7.2 AITripGenerator (CRD §3.5.1)

**Chức năng**:
- Input: điểm đến, số ngày, ngân sách, số người, đối tượng, phong cách
- Output: lịch trình hoàn chỉnh với địa điểm, chi phí, sắp xếp theo ngày
- Traveler chỉnh sửa, lưu như lịch trình thường

**Components**:
- `AIInputForm` — form nhập thông tin đầu vào
- `DestinationPicker` — chọn điểm đến
- `StyleSelector` — chọn phong cách (nghỉ dưỡng, khám phá, ẩm thực)
- `TargetSelector` — chọn đối tượng (gia đình, cặp đôi, nhóm bạn)
- `GeneratingIndicator` — animation đang sinh lịch trình
- `AITripPreview` — preview lịch trình AI đã sinh
- `SaveAITripButton` — lưu thành lịch trình Draft

**Database Mapping**: `LICH_SU_AI`, `LICH_TRINH` (khi lưu)

### 7.3 AIRouteOptimizer (CRD §3.5.2)

**Chức năng**:
- Input: danh sách địa điểm trong một ngày
- Output: thứ tự tối ưu + giải thích lý do

**Components**:
- `DayPlacesList` — danh sách địa điểm trong ngày
- `OptimizeButton` — nút tối ưu
- `OptimizedRoute` — kết quả tối ưu với giải thích
- `RouteComparisonMap` — bản đồ so sánh trước/sau

### 7.4 AIBudgetAdvisor (CRD §3.5.3)

**Chức năng**:
- Input: ngân sách + chi phí đã nhập
- Output: phân tích tỷ lệ (lưu trú, ăn uống, di chuyển, tham quan), chỉ hạng mục vượt mức, đề xuất điều chỉnh

**Components**:
- `BudgetBreakdownChart` — biểu đồ tỷ lệ phân bổ
- `OverBudgetAlert` — cảnh báo hạng mục vượt
- `AIBudgetSuggestions` — đề xuất điều chỉnh

---

## 8. PROVIDER DOMAIN

### 8.1 ProviderDashboard (CRD §3.6.3)

**Chức năng**:
- Tổng quan 3 tab: Dịch vụ, Gói quảng bá, Analytics
- KPI: tổng dịch vụ, dịch vụ active, rating trung bình, lượt review
- Badge đối tác (từ `badgeType` backend)
- Gói hiện tại và ngày hết hạn

**Components**:
- `DashboardTabs` — 3 tab (Dịch vụ / Gói quảng bá / Analytics)
- `KPICardGrid` — grid thẻ KPI
- `PartnerBadge` — badge từ `ProviderPromotionDto.badgeType`
- `CurrentPackageCard` — thẻ gói hiện tại
- `QuickServiceList` — danh sách nhanh dịch vụ

**APIs**:
- `GET /providers/user/{userId}/dashboard`
- `GET /provider/current-package`

**Database Mapping**: `NHA_CUNG_CAP`, `DICH_VU`, `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`

### 8.2 ServicesManager (CRD §3.6.2, §3.6.3 Tab Dịch vụ)

**Chức năng**:
- Danh sách toàn bộ dịch vụ đã đăng
- Trạng thái kiểm duyệt: Chờ duyệt / Đã duyệt / Từ chối
- Nút Ẩn/Hiện từng dịch vụ
- Nút Chỉnh sửa
- Nút Thêm dịch vụ mới
- Filter theo loại (KS / NH / PT / HĐ)

**Components**:
- `ServiceTypeTabs` — tab 4 loại dịch vụ
- `ServiceTable` — bảng dịch vụ (tên, loại, trạng thái, ngày tạo, actions)
- `ServiceStatusBadge` — badge trạng thái (Pending / Approved / Rejected)
- `VisibilityToggle` — nút ẩn/hiện
- `AddServiceButton` — nút thêm mới → chuyển đến ServiceForm

**APIs**:
- `GET /places/hotels/search?providerId=...`
- `GET /places/restaurants/search?providerId=...`
- `GET /places/activities/search?providerId=...`
- `GET /places/vehicles/search?providerId=...`

**Database Mapping**: `DICH_VU`, `ANH_DICH_VU`

### 8.3 ServiceForm (CRD §3.6.2)

**Chức năng**:
- Form nhập liệu đặc thù theo loại:
  - **Khách sạn**: tên, địa chỉ, mô tả, ảnh, loại phòng, giá, tiện nghi
  - **Nhà hàng**: tên, địa chỉ, thực đơn mẫu, giờ mở cửa, sức chứa, giá
  - **Phương tiện**: loại xe, số chỗ, giá theo ngày/chuyến, khu vực
  - **Hoạt động**: mô tả, thời lượng, số người max, điều kiện, giá

**Components**:
- `ServiceTypeSelector` — chọn loại dịch vụ
- `HotelForm` / `RestaurantForm` / `VehicleForm` / `ActivityForm` — form đặc thù
- `ServiceImageUpload` — upload nhiều ảnh
- `ServiceLocationPicker` — chọn vị trí trên bản đồ
- `ServicePreview` — preview trước khi đăng

**APIs**:
- `POST /places/hotels` — tạo khách sạn
- `POST /places/restaurants` — tạo nhà hàng
- `POST /places/activities` — tạo hoạt động
- `POST /places/vehicles` — tạo phương tiện
- `PUT /places/hotels/{id}` — sửa (tương tự cho loại khác)

### 8.4 ProviderPackages (CRD §3.6.4)

**Chức năng**:
- Danh sách gói: Free / Standard / Premium
- So sánh quyền lợi
- Đăng ký hoặc nâng cấp gói
- Chọn chu kỳ (tháng / năm)
- Luồng thanh toán

**Components**:
- `PackageComparisonTable` — bảng so sánh 3 gói
- `PackageCard` — thẻ gói (tên, giá, features)
- `CycleSelector` — chọn tháng/năm
- `PaymentFlow` — luồng thanh toán (tóm tắt → phương thức → xác nhận)
- `CurrentPackageBanner` — banner gói hiện tại
- `PackageHistoryList` — lịch sử gói
- `PaymentHistoryList` — lịch sử thanh toán

**APIs**:
- `GET /provider/packages`
- `GET /provider/current-package`
- `GET /provider/package-history`
- `POST /provider/register-package`
- `GET /provider/payment-history`

**Database Mapping**: `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`

### 8.5 ProviderPromotions (CRD §3.6.3 Tab Analytics, SP012)

**Chức năng**:
- 5 chỉ số: Impressions, Bookmarks, Planner adds, AI Recommendation, CTR
- Biểu đồ đường theo khoảng thời gian
- Bảng số liệu chi tiết theo dịch vụ

**Components**:
- `DateRangePicker` — chọn khoảng thời gian
- `AnalyticsKPIRow` — 5 KPI cards
- `AnalyticsLineChart` — biểu đồ đường
- `ServiceBreakdownTable` — bảng chi tiết theo dịch vụ

### 8.6 ProviderReviews (SP008)

**Chức năng**:
- Xem đánh giá theo dịch vụ
- Phản hồi đánh giá

**Components**:
- `ReviewsByServiceList` — danh sách review theo dịch vụ
- `ReviewItem` — chi tiết review
- `ReplyForm` — form phản hồi
- `ReplyItem` — phản hồi đã gửi

**Database Mapping**: `DANH_GIA`, `PHAN_HOI_DANH_GIA`

---

## 9. ADMIN DOMAIN

### 9.1 AdminDashboard (CRD §3.7.5, UC021)

**Chức năng**:
- KPI: tổng users (mới đăng ký), Free→Premium conversion, users active
- KPI: lịch trình tạo, lịch trình công khai, lịch trình clone nhiều nhất
- KPI: địa điểm xem nhiều nhất, xu hướng du lịch
- KPI: AI usage (lượt sinh LT, optimize, chatbot)
- KPI: doanh thu Premium Traveler, doanh thu gói NCC
- Lọc theo khoảng thời gian

**Components**:
- `DateRangeFilter` — lọc thời gian
- `KPIGrid` — grid thẻ KPI
- `UserGrowthChart` — biểu đồ user growth
- `ContentStatsPanel` — thống kê nội dung
- `RevenuePanel` — doanh thu
- `TrendingDestinations` — xu hướng du lịch

**APIs**:
- `GET /admin/dashboard`

**Database Mapping**: `NGUOI_DUNG`, `LICH_TRINH`, `GOI_DICH_VU`, `DANG_KY_GOI`, `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`

### 9.2 UserManager (CRD §3.7.2, UC018)

**Chức năng**:
- Danh sách phân trang
- Tìm kiếm theo email/tên
- Chi tiết hoạt động từng user
- Khóa/mở khóa (không xóa dữ liệu)
- Reset mật khẩu

**Components**:
- `UserSearchBar` — tìm kiếm
- `UserTable` — bảng: tên, email, role, trạng thái, ngày tạo, actions
- `UserDetailDrawer` — drawer chi tiết user
- `LockToggleButton` — nút khóa/mở khóa
- `ResetPasswordButton` — nút reset MK
- `ConfirmDialog` — xác nhận hành động

**APIs**:
- `GET /admin/users`
- `POST /admin/users/{id}/lock`

**Database Mapping**: `NGUOI_DUNG`

### 9.3 ModerationHub (CRD §3.7.1, UC019)

**Chức năng**:
- Tổng quan 4 luồng kiểm duyệt song song
- Đếm pending cho mỗi loại
- Quick links đến từng sub-page

**Components**:
- `ModerationCard` — thẻ cho mỗi luồng (icon, tên, pending count)
- Grid 4 thẻ: NCC / Dịch vụ / Review / Blog + Lịch trình

### 9.4 ProviderModeration (CRD §3.7.1)

**Chức năng**:
- Xem hồ sơ NCC chờ duyệt
- Tải giấy tờ kinh doanh (PDF/JPG/PNG)
- Phê duyệt kèm ghi nhận
- Từ chối kèm lý do

**Components**:
- `PendingProviderList` — danh sách NCC chờ duyệt
- `ProviderDetailPanel` — chi tiết hồ sơ: tên DN, MST, giấy phép, địa chỉ
- `DocumentViewer` — xem file giấy tờ
- `ApproveButton` — nút duyệt
- `RejectWithReasonDialog` — modal từ chối + lý do

**APIs**:
- `GET /providers/pending`
- `POST /providers/{id}/approve`
- `POST /providers/{id}/reject`

**Database Mapping**: `NHA_CUNG_CAP`, `DUYET_NOI_DUNG`

### 9.5 ServiceModeration, ReviewModeration, BlogModeration, TripModeration

Cấu trúc tương tự: danh sách pending → xem chi tiết → duyệt/từ chối + lý do. Kết quả ghi vào `DUYET_NOI_DUNG` và thông báo đến người tạo.

### 9.6 CategoryManager (CRD §3.7.3, UC020)

**Chức năng**: CRUD loại dịch vụ, tỉnh/thành, tag du lịch, địa điểm nổi bật

**Components**:
- `CategoryTabs` — tab: Tỉnh/Thành, Tag, Loại dịch vụ
- `CategoryTable` — bảng CRUD
- `AddCategoryDialog` — modal thêm mới
- `EditCategoryDialog` — modal sửa
- `VisibilityToggle` — ẩn/hiện (không xóa)

**APIs**:
- `GET /places/categories` — danh sách tỉnh/thành
- `POST /places/categories` — tạo
- `PUT /places/categories/{id}` — sửa
- `DELETE /places/categories/{id}` — xóa

**Database Mapping**: `TINH_THANH`, `TAG`, `DIA_DIEM`

### 9.7 CouponManager (CRD §3.7.4, UC022)

**Chức năng**:
- CRUD mã giảm giá cho gói Premium Traveler
- Loại: % hoặc số tiền cố định
- Giới hạn số lần sử dụng, thời hạn hiệu lực
- Vô hiệu hóa

**Components**:
- `CouponTable` — bảng: mã, loại, giá trị, sử dụng, hết hạn, trạng thái
- `CreateCouponDialog` — modal tạo mã mới
- `CouponStatsRow` — thống kê sử dụng
- `DeactivateButton` — nút vô hiệu hóa

**Database Mapping**: `MA_GIAM_GIA` (bảng CRD yêu cầu nhưng chưa có trong DB hiện tại)

### 9.8 AdminPackageManager

**Chức năng**: Quản lý gói NCC: cấp gói, gia hạn, hết hạn thủ công, thống kê

**Components**:
- `ProviderPackageTable` — bảng NCC + gói hiện tại
- `AssignPackageDialog` — modal cấp gói
- `ExtendPackageDialog` — modal gia hạn
- `ExpirePackageButton` — nút hết hạn
- `PackageStatisticsPanel` — thống kê tổng

**APIs**:
- `GET /admin/provider-packages/providers`
- `GET /admin/provider-packages/packages`
- `POST /admin/provider-packages/assign`
- `POST /admin/provider-packages/extend`
- `POST /admin/provider-packages/expire`
- `GET /admin/provider-packages/statistics`
- `GET /admin/provider-packages/promotions-preview`

**Database Mapping**: `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`

### 9.9 ReportsExport (CRD §3.7.5)

**Chức năng**: Thống kê chi tiết, lọc thời gian, xuất Excel/PDF

**Components**:
- `ReportTypeSelector` — chọn loại báo cáo
- `DateRangeFilter` — chọn khoảng thời gian
- `ReportDataGrid` — bảng dữ liệu thống kê
- `ExportButton` — nút xuất Excel/PDF
- `ReportChart` — biểu đồ trực quan

---

## 10. SHARED COMPONENT LIBRARY

### 10.1 Data Display

| Component | Mô tả | Sử dụng bởi |
|---|---|---|
| `DataTable` | Bảng dữ liệu phân trang, sort, filter, responsive (horizontal scroll mobile) | Admin, Provider |
| `KPICard` | Thẻ thống kê: icon, label, value, trend | Dashboard (Admin, Provider, Traveler) |
| `Badge` | Badge trạng thái (Active, Pending, Rejected, Premium, etc.) | Toàn hệ thống |
| `PartnerBadge` | Badge đối tác NCC (từ `badgeType` backend) | Explore, Provider |
| `EmptyState` | Trạng thái rỗng: icon, message, CTA | Toàn hệ thống |
| `LoadingSpinner` | Spinner loading | Toàn hệ thống |
| `Skeleton` | Skeleton loader | Toàn hệ thống |
| `Avatar` | Ảnh đại diện tròn | Toàn hệ thống |
| `StarRating` | Hiển thị sao 1-5 (đọc + ghi) | Review, Explore |

### 10.2 Overlay & Feedback

| Component | Mô tả | Sử dụng bởi |
|---|---|---|
| `Modal` | Dialog modal trung tâm | Toàn hệ thống |
| `Drawer` | Panel trượt từ cạnh | Admin (User Detail), Provider |
| `ConfirmDialog` | Hộp thoại xác nhận (Xóa, Khóa, Từ chối) | Toàn hệ thống |
| `Toast` | Thông báo tạm thời (success, error, info) | Toàn hệ thống |
| `AlertBanner` | Banner cảnh báo (vượt ngân sách, gói hết hạn) | Planner, Provider |

### 10.3 Form Controls

| Component | Mô tả |
|---|---|
| `TextInput` | Input text với validation inline |
| `TextArea` | Textarea với character count |
| `SelectInput` | Dropdown select |
| `DatePicker` | Chọn ngày |
| `DateRangePicker` | Chọn khoảng ngày |
| `NumberInput` | Input số (VND, qty) |
| `FileUpload` | Upload file (ảnh, PDF) |
| `ImageUpload` | Upload ảnh với preview |
| `MultiImageUpload` | Upload nhiều ảnh (gallery) |
| `SearchInput` | Input tìm kiếm với debounce |
| `RadioGroup` | Nhóm radio buttons |
| `CheckboxGroup` | Nhóm checkbox |
| `FormSection` | Section form có label |

### 10.4 Maps

| Component | Mô tả |
|---|---|
| `MapView` | Bản đồ Leaflet/Google Maps cơ bản |
| `MapWithMarkers` | Bản đồ với nhiều markers |
| `MapWithRoute` | Bản đồ với đường đi giữa các điểm |
| `MapLocationPicker` | Chọn vị trí trên bản đồ (click → lấy tọa độ) |
| `MiniMap` | Bản đồ nhỏ embed trong card/detail |

### 10.5 Charts

| Component | Mô tả |
|---|---|
| `LineChart` | Biểu đồ đường (analytics, trends) |
| `BarChart` | Biểu đồ cột (so sánh) |
| `PieChart` | Biểu đồ tròn (phân bổ ngân sách) |
| `DoughnutChart` | Biểu đồ donut (tỷ lệ) |

### 10.6 Navigation & Layout

| Component | Mô tả |
|---|---|
| `Sidebar` | Sidebar navigation (collapse trên mobile) |
| `Header` | Header với logo, nav, auth buttons |
| `Breadcrumb` | Breadcrumb navigation |
| `TabBar` | Tab navigation |
| `Pagination` | Phân trang |

---

## 11. RTK QUERY ARCHITECTURE

### 11.1 Base Configuration

```
src/store/
├── store.ts                    # Redux store configuration
├── baseApi.ts                  # Base RTK Query API (baseUrl, auth headers)
└── apis/
    ├── authApi.ts              # Auth domain
    ├── tripApi.ts              # Trip Planning domain
    ├── placeApi.ts             # Place/Discovery domain
    ├── serviceApi.ts           # Service CRUD (4 loại)
    ├── communityApi.ts         # Feed, Like, Comment
    ├── reviewApi.ts            # Reviews
    ├── providerApi.ts          # Provider management
    ├── providerPackageApi.ts   # Provider packages & payments
    ├── promotionApi.ts         # Featured, Promoted, Badge
    ├── adminApi.ts             # Admin operations
    ├── adminPackageApi.ts      # Admin package management
    └── aiApi.ts                # AI operations
```

### 11.2 API Module Definitions

#### authApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useRegisterMutation` | `/auth/register` | POST | — |
| `useLoginMutation` | `/auth/login` | POST | — |
| `useRefreshTokenMutation` | `/auth/refresh-token` | POST | — |
| `useVerifyOtpMutation` | `/auth/verify-otp` | POST | — |
| `useGetMeQuery` | `/auth/me` | GET | `User` |

#### tripApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useGetMyTripsQuery` | `/trips` | GET | `Trip` |
| `useGetTripByIdQuery` | `/trips/{id}` | GET | `Trip` |
| `useCreateTripMutation` | `/trips` | POST | invalidates `Trip` |
| `useUpdateTripMutation` | `/trips/{id}` | PUT | invalidates `Trip` |
| `useDeleteTripMutation` | `/trips/{id}` | DELETE | invalidates `Trip` |
| `useAddLocationMutation` | `/trips/{id}/locations` | POST | invalidates `Trip` |
| `useRemoveLocationMutation` | `/trips/{id}/items/{itemId}` | DELETE | invalidates `Trip` |
| `useReorderItemsMutation` | `/trips/{id}/reorder` | PUT | invalidates `Trip` |
| `useGetTripCostQuery` | `/trips/{id}/cost` | GET | `TripCost` |
| `useCloneTripMutation` | `/trips/{id}/clone` | POST | invalidates `Trip` |
| `useGetRecommendationsQuery` | `/trips/recommendations` | POST | `Recommendation` |

#### placeApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useSearchPlacesQuery` | `/places/search` | GET | `Place` |
| `useGetPlaceByIdQuery` | `/places/{id}` | GET | `Place` |
| `useGetNearbyPlacesQuery` | `/places/nearby` | GET | `Place` |
| `useGetCategoriesQuery` | `/places/categories` | GET | `Category` |
| `useCreateCategoryMutation` | `/places/categories` | POST | invalidates `Category` |
| `useUpdateCategoryMutation` | `/places/categories/{id}` | PUT | invalidates `Category` |
| `useDeleteCategoryMutation` | `/places/categories/{id}` | DELETE | invalidates `Category` |

#### serviceApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useSearchHotelsQuery` | `/places/hotels/search` | GET | `Service` |
| `useSearchRestaurantsQuery` | `/places/restaurants/search` | GET | `Service` |
| `useSearchActivitiesQuery` | `/places/activities/search` | GET | `Service` |
| `useSearchVehiclesQuery` | `/places/vehicles/search` | GET | `Service` |
| `useCreateHotelMutation` | `/places/hotels` | POST | invalidates `Service` |
| `useCreateRestaurantMutation` | `/places/restaurants` | POST | invalidates `Service` |
| `useCreateActivityMutation` | `/places/activities` | POST | invalidates `Service` |
| `useCreateVehicleMutation` | `/places/vehicles` | POST | invalidates `Service` |
| (tương tự `useUpdate*`, `useDelete*` cho mỗi loại) | | | |

#### communityApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useGetFeedsQuery` | `/feeds` | GET | `Feed` |
| `useLikeTripMutation` | `/feeds/{tripId}/like` | POST | invalidates `Feed` |
| `useCommentOnTripMutation` | `/feeds/{tripId}/comment` | POST | invalidates `Comment` |
| `useGetTripCommentsQuery` | `/feeds/{tripId}/comments` | GET | `Comment` |

#### reviewApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `usePostReviewMutation` | `/reviews` | POST | invalidates `Review` |
| `useGetPlaceReviewsQuery` | `/reviews/place/{id}` | GET | `Review` |
| `useGetServiceReviewsQuery` | `/reviews/service/{id}` | GET | `Review` |

#### providerApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useGetProviderByIdQuery` | `/providers/{id}` | GET | `Provider` |
| `useGetProviderByUserIdQuery` | `/providers/user/{userId}` | GET | `Provider` |
| `useGetProviderDashboardQuery` | `/providers/user/{userId}/dashboard` | GET | `ProviderDashboard` |
| `useCreateProviderMutation` | `/providers` | POST | invalidates `Provider` |
| `useUpdateProviderMutation` | `/providers/{id}` | PUT | invalidates `Provider` |

#### providerPackageApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useGetPackagesQuery` | `/provider/packages` | GET | `ProviderPackage` |
| `useGetCurrentPackageQuery` | `/provider/current-package` | GET | `ProviderPackage` |
| `useGetPackageHistoryQuery` | `/provider/package-history` | GET | `ProviderPackage` |
| `useRegisterPackageMutation` | `/provider/register-package` | POST | invalidates `ProviderPackage` |
| `useGetPaymentHistoryQuery` | `/provider/payment-history` | GET | `ProviderPayment` |

#### promotionApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useGetFeaturedProvidersQuery` | `/providers/featured` | GET | `Explore` |
| `useGetExplorePromotedQuery` | `/providers/explore-promoted` | GET | `Explore` |

#### adminApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useGetAdminUsersQuery` | `/admin/users` | GET | `AdminUser` |
| `useLockUserMutation` | `/admin/users/{id}/lock` | POST | invalidates `AdminUser` |
| `useGetAdminDashboardQuery` | `/admin/dashboard` | GET | `AdminDashboard` |
| `useGetPendingProvidersQuery` | `/providers/pending` | GET | `AdminProvider` |
| `useApproveProviderMutation` | `/providers/{id}/approve` | POST | invalidates `AdminProvider` |
| `useRejectProviderMutation` | `/providers/{id}/reject` | POST | invalidates `AdminProvider` |

#### adminPackageApi

| Hook | Endpoint | Method | Tags |
|---|---|---|---|
| `useGetAdminProvidersQuery` | `/admin/provider-packages/providers` | GET | `AdminPkg` |
| `useGetAdminPackagesQuery` | `/admin/provider-packages/packages` | GET | `AdminPkg` |
| `useAssignPackageMutation` | `/admin/provider-packages/assign` | POST | invalidates `AdminPkg` |
| `useExtendPackageMutation` | `/admin/provider-packages/extend` | POST | invalidates `AdminPkg` |
| `useExpirePackageMutation` | `/admin/provider-packages/expire` | POST | invalidates `AdminPkg` |
| `useGetAdminStatisticsQuery` | `/admin/provider-packages/statistics` | GET | `AdminPkg` |
| `useGetAdminPromotionsPreviewQuery` | `/admin/provider-packages/promotions-preview` | GET | `AdminPkg` |

---

## 12. TRACEABILITY MATRIX

### CRD → SRS → Screen → Components

| CRD | SRS | Screen | Components chính |
|---|---|---|---|
| §3.1.1 Đăng ký | UC001 | A-02 Register, A-04 OTP | `RegisterForm`, `OtpInput` |
| §3.1.2 Đăng nhập | UC002 | A-01 Login | `LoginForm` |
| §3.1.3 Quên MK | UC003 | A-03 ForgotPassword, A-05 ResetPassword | `ForgotPasswordForm`, `ResetPasswordForm` |
| §3.1.4 Hồ sơ | UC004 | T-05 MyProfile, P-07 PublicProfile | `ProfileForm`, `AvatarUpload`, `ChangePasswordForm` |
| §3.1.5 Freemium | — | AI-01 AIChat (quota indicator) | `QuotaIndicator`, `UpgradePremiumBanner` |
| §3.2.1 Tạo LT | UC005 | T-01 Dashboard, T-03 Planner | `CreateTripForm`, `TripHeader` |
| §3.2.2 DnD | UC006 | T-03 Planner | `DayCanvas`, `PlaceCard`, `SearchPanel` |
| §3.2.3 Sắp xếp | UC007 | T-03 Planner | `DayCanvas` (DnD reorder) |
| §3.2.4 Ngân sách | UC008 | T-03 Planner | `BudgetPanel`, `BudgetAlert` |
| §3.2.5 Cộng tác | UC017 | T-03 Planner | `CollaborationBar`, `InviteModal` |
| §3.2.6 Clone | UC010, UC015 | T-03 Planner, P-06 TripDetail | `CloneTripButton` |
| §3.3.1 Tìm kiếm | UC011 | P-02 ExploreWorkspace | `SearchBar`, `FilterPanel`, `ExploreGrid`, `ExploreMap` |
| §3.3.2 Chi tiết | UC011 | P-03 ExploreDetail | `DetailHeader`, `ImageGallery`, `PriceInfo`, `ReviewSummary` |
| §3.3.3 Xu hướng | — | P-01 Home | `SuggestedDestinations`, `PromotedBanner` |
| §3.4.1 Chia sẻ LT | UC014 | P-04 CommunityFeed, P-06 TripDetail | `TripFeedCard`, `TripTimeline` |
| §3.4.2 Đánh giá | UC013 | P-03 ExploreDetail | `WriteReviewForm`, `ReviewList`, `StarRating` |
| §3.4.3 Blog | — | P-04 CommunityFeed, P-05 BlogDetail | `BlogFeedCard`, `BlogContent`, `BlogComments` |
| §3.4.4 Tương tác | — | P-04 CommunityFeed | `LikeButton`, `SaveButton`, `CommentSection` |
| §3.5.1 AI Generate | — | AI-02 AITripGenerator | `AIInputForm`, `AITripPreview` |
| §3.5.2 AI Route | — | AI-03 AIRouteOptimizer | `OptimizedRoute`, `RouteComparisonMap` |
| §3.5.3 AI Budget | — | AI-04 AIBudgetAdvisor | `BudgetBreakdownChart`, `AIBudgetSuggestions` |
| §3.5.4 AI Chat | — | AI-01 AIChat | `ChatMessageList`, `ChatInput`, `ChatBubble` |
| §3.6.1 Đăng ký NCC | SP001 | SP-08 Registration | `ProviderRegistrationForm` |
| §3.6.2 Quản lý DV | SP003-SP005 | SP-02 ServicesManager, SP-03 ServiceForm | `ServiceTable`, `ServiceForm`, `VisibilityToggle` |
| §3.6.3 Dashboard | SP009 | SP-01 ProviderDashboard | `DashboardTabs`, `KPICardGrid`, `PartnerBadge` |
| §3.6.4 Gói quảng bá | SP010, SP011 | SP-04 ProviderPackages | `PackageComparisonTable`, `PaymentFlow` |
| §3.7.1 Kiểm duyệt | UC019 | AD-03→AD-08 | `PendingList`, `ApproveButton`, `RejectWithReasonDialog` |
| §3.7.2 Quản lý user | UC018 | AD-02 UserManager | `UserTable`, `LockToggleButton`, `ResetPasswordButton` |
| §3.7.3 Danh mục | UC020 | AD-09 CategoryManager | `CategoryTable`, `AddCategoryDialog` |
| §3.7.4 Mã giảm giá | UC022 | AD-10 CouponManager | `CouponTable`, `CreateCouponDialog` |
| §3.7.5 Thống kê | UC021 | AD-01 AdminDashboard, AD-12 ReportsExport | `KPIGrid`, `ReportDataGrid`, `ExportButton` |

---

## 13. DEFINITION OF DONE

### Cho mỗi màn hình, Definition of Done bao gồm:

#### A. Chức năng

- [ ] Tất cả chức năng theo CRD được triển khai
- [ ] Dữ liệu lấy từ backend API (không mock, không hardcode)
- [ ] Business logic từ backend (không tự tính badge, promotion score, etc.)

#### B. Trạng thái UI

- [ ] **Loading State**: hiển thị skeleton/spinner khi chờ API
- [ ] **Error State**: hiển thị thông báo lỗi + nút retry
- [ ] **Empty State**: hiển thị thông báo + CTA khi danh sách rỗng
- [ ] **Success State**: hiển thị dữ liệu đúng từ API

#### C. Responsive

- [ ] Mobile (375px): layout không bị overflow, navigation collapse
- [ ] Tablet (768px): layout phù hợp
- [ ] Desktop (1920px): layout tận dụng không gian

#### D. TypeScript

- [ ] Không có `any`
- [ ] Không có `@ts-ignore`
- [ ] Props có type rõ ràng
- [ ] `tsc --noEmit` pass

#### E. API Integration

- [ ] Endpoint URL khớp backend controller
- [ ] HTTP method đúng
- [ ] Request/Response type khớp DTO
- [ ] RTK Query tags đúng

#### F. Accessibility

- [ ] Interactive elements có `aria-label`
- [ ] Form fields có `<label>`
- [ ] Keyboard navigation hoạt động
- [ ] Color contrast đủ

#### G. Design

- [ ] Sử dụng design tokens
- [ ] Typography consistent
- [ ] Spacing consistent
- [ ] Icon consistent (Lucide)

### DoD theo domain

| Domain | Điều kiện bổ sung |
|---|---|
| Traveler/Planner | DnD hoạt động mượt < 300ms, budget update < 200ms |
| Explore | List+Map đồng bộ, search < 2s |
| AI | Hiển thị quota, gate Premium nếu cần |
| Provider | Badge từ `badgeType` backend, không derive |
| Admin | Pagination, filter hoạt động, moderation có lý do |

---

*— Hết tài liệu —*
