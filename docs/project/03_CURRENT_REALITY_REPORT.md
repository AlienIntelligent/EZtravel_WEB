# 03 – BÁO CÁO THỰC TRẠNG HỆ THỐNG (Current Reality Report)

**Ngày**: 2026-06-07  
**Phương pháp**: Đọc trực tiếp source code, đối chiếu với CRD_EZtravel_v3.docx  
**Nguyên tắc**: Mọi kết luận đều có bằng chứng. Không suy diễn.

---

## 1. DATABASE REALITY

### 1.1 Tổng quan

- **Schema**: `database/archive/schema_EZtravel.sql`
- **Tổng bảng**: 37
- **Trạng thái**: LOCKED — không được sửa đổi

### 1.2 Quan hệ chính giữa các bảng

```
NGUOI_DUNG (1) ──── (N) LICH_TRINH
NGUOI_DUNG (1) ──── (0..1) NHA_CUNG_CAP
NHA_CUNG_CAP (1) ──── (N) DICH_VU
NHA_CUNG_CAP (1) ──── (N) DANG_KY_GOI_NCC
DANG_KY_GOI_NCC (1) ──── (1) THANH_TOAN_NCC
GOI_DICH_VU_NCC (1) ──── (N) DANG_KY_GOI_NCC
LICH_TRINH (1) ──── (N) NGAY_LICH_TRINH
NGAY_LICH_TRINH (1) ──── (N) DIA_DIEM_LICH_TRINH
NGAY_LICH_TRINH (1) ──── (N) DICH_VU_LICH_TRINH
DIA_DIEM (1) ──── (N) DIA_DIEM_LICH_TRINH
DIA_DIEM (1) ──── (N) DIA_DIEM_TAG
TAG (1) ──── (N) DIA_DIEM_TAG
DIA_DIEM (1) ──── (N) DANH_GIA
DICH_VU (1) ──── (N) DANH_GIA
DANH_GIA (1) ──── (N) ANH_DANH_GIA
DANH_GIA (1) ──── (N) PHAN_HOI_DANH_GIA
NGUOI_DUNG (1) ──── (N) BAI_VIET
BAI_VIET (1) ──── (N) BINH_LUAN_BAI_VIET
BAI_VIET (1) ──── (N) THICH_BAI_VIET
NGUOI_DUNG (1) ──── (N) GOI_DICH_VU (Traveler Subscription)
NGUOI_DUNG (1) ──── (N) DANG_KY_GOI (Traveler Subscription)
```

### 1.3 Domain grouping

| Domain | Bảng | Số lượng |
|---|---|---|
| Identity & Auth | NGUOI_DUNG, OTP_XAC_THUC, REFRESH_TOKEN | 3 |
| Trip Planning | LICH_TRINH, NGAY_LICH_TRINH, DIA_DIEM_LICH_TRINH, DICH_VU_LICH_TRINH, CHI_PHI_DICH_VU_LICH_TRINH, CHIA_SE_LICH_TRINH, LUU_LICH_TRINH, THICH_LICH_TRINH, LICH_SU_CLONE | 9 |
| Discovery | DIA_DIEM, ANH_DIA_DIEM, TINH_THANH, TAG, DIA_DIEM_TAG | 5 |
| Service | DICH_VU, ANH_DICH_VU | 2 |
| Community | DANH_GIA, ANH_DANH_GIA, PHAN_HOI_DANH_GIA, BAI_VIET, ANH_BAI_VIET, BINH_LUAN_BAI_VIET, THICH_BAI_VIET, BAO_CAO_NOI_DUNG, DUYET_NOI_DUNG | 9 |
| Social | THEO_DOI_NGUOI_DUNG, THONG_BAO | 2 |
| Provider | NHA_CUNG_CAP | 1 |
| Provider Monetization | GOI_DICH_VU_NCC, DANG_KY_GOI_NCC, THANH_TOAN_NCC | 3 |
| Traveler Subscription | GOI_DICH_VU, DANG_KY_GOI, LICH_SU_AI | 3 |

---

## 2. BACKEND REALITY

### 2.1 Controllers đang tồn tại

| Controller | File | Route | Endpoints |
|---|---|---|---|
| `AuthController` | `ezTravel.AuthService/Controllers/` | `api/auth` | 5 |
| `TripsController` | `ezTravel.TripService/Controllers/TripsController.cs` | `api/trips` | 13 |
| `PlacesController` | `ezTravel.PlaceService/Controllers/PlacesController.cs` | `api/places` | 11+ |
| `HotelsController` | `ezTravel.PlaceService/Controllers/` | `api/places/hotels` | Đa số CRUD + Search |
| `RestaurantsController` | `ezTravel.PlaceService/Controllers/` | `api/places/restaurants` | Đa số CRUD + Search |
| `ActivitiesController` | `ezTravel.PlaceService/Controllers/` | `api/places/activities` | Đa số CRUD + Search |
| `VehiclesController` | `ezTravel.PlaceService/Controllers/` | `api/places/vehicles` | Đa số CRUD + Search |
| `ProvidersController` | `ezTravel.BookingService/Controllers/ProvidersController.cs` | `api/providers` | 13 |
| `ProviderPackageController` | `ezTravel.BookingService/Controllers/ProviderPackageController.cs` | `api/provider` | 5 |
| `FeedsController` | `ezTravel.CommunityService/Controllers/FeedsController.cs` | `api/feeds` | 4 |
| `ReviewsController` | `ezTravel.CommunityService/Controllers/ReviewsController.cs` | `api/reviews` | 3 |
| `AdminController` | `ezTravel.AdminService/Controllers/AdminController.cs` | `api/admin` | 5 |
| `AdminProviderPackageController` | `ezTravel.AdminService/Controllers/AdminProviderPackageController.cs` | `api/admin/provider-packages` | 8 |

### 2.2 Services đang tồn tại

| Service | File | Trạng thái |
|---|---|---|
| `AuthService` | `Services/Auth/AuthService.cs` | ✅ Hoạt động đầy đủ |
| `TripService` | `Services/Trips/TripService.cs` | ✅ Hoạt động đầy đủ |
| `PlaceService` | `Services/Places/PlaceService.cs` | ✅ Hoạt động đầy đủ |
| `HotelService` | `Services/Hotels/HotelService.cs` | ✅ Hoạt động đầy đủ |
| `RestaurantService` | `Services/Restaurants/` | ✅ Hoạt động đầy đủ |
| `ActivityService` | `Services/Activities/` | ✅ Hoạt động đầy đủ |
| `VehicleService` | `Services/Vehicles/` | ✅ Hoạt động đầy đủ |
| `ProviderService` | `Services/Providers/ProviderService.cs` | ✅ Hoạt động (dashboard stats có hardcode) |
| `NccPackageService` | `Services/Providers/NccPackageService.cs` | ✅ Hoạt động đầy đủ |
| `PromotionService` | `Services/Promotion/PromotionService.cs` | ✅ Hoạt động đầy đủ |
| `AdminService` | `Services/Admin/AdminService.cs` | ⚠️ Hoạt động nhưng có stub (LockUser, Dashboard hạn chế) |
| `CommunityService` | `Services/Community/CommunityService.cs` | ✅ Hoạt động (Reviews, Feeds, Likes, Comments) |

### 2.3 DTOs chính

| DTO | File | Sử dụng bởi |
|---|---|---|
| `UserDto` | `DTO/Users/UserDto.cs` | AdminService |
| `AdminDashboardDto` | `DTO/Users/AdminDashboardDto.cs` | AdminService |
| `CreateTripRequest` / `TripDto` | `DTO/Trips/` | TripService |
| `CreateReviewRequest` | `DTO/Reviews/` | CommunityService |
| `CreateProviderRequest` / `UpdateProviderRequest` | `DTO/Providers/` | ProviderService |
| `PackageDto` / `CurrentPackageDto` / etc. | `DTO/Providers/PackageDtos.cs` | NccPackageService |
| `ProviderPromotionDto` | `DTO/Providers/PackageDtos.cs` | PromotionService |

---

## 3. FRONTEND REALITY

### 3.1 Modules đang hoạt động

| Module | Thư mục | Trạng thái |
|---|---|---|
| Home | `modules/home/` | ✅ Hoạt động |
| Auth | `modules/auth/` | ✅ Hoạt động (Login, Register, OTP, ForgotPassword, ResetPassword) |
| Explore | `modules/explore/` | ✅ Hoạt động (ExploreWorkspace, ExploreCard, EmptyState) |
| Trip Planner | `modules/trip/` | ✅ Hoạt động (TripPlannerWorkspace, DnD, Budget) |
| AI | `modules/ai/` | ✅ Hoạt động (Assistant, Planner, History, AIBudgetPanel, AIRoutePanel) |
| Provider Dashboard | `modules/provider/Dashboard.tsx` | ✅ Hoạt động |
| Provider Packages | `modules/provider/Packages.tsx` | ✅ Hoạt động |
| Provider Current Package | `modules/provider/CurrentPackage.tsx` | ✅ Hoạt động |
| Provider Package History | `modules/provider/PackageHistory.tsx` | ✅ Hoạt động |
| Provider Payment History | `modules/provider/PaymentHistory.tsx` | ✅ Hoạt động |
| Provider Promotions | `modules/provider/Promotions.tsx` | ✅ Hoạt động |
| Provider Services | `modules/provider/ServicesManager.tsx` | ❌ Stub (Coming Soon) |
| Admin Dashboard | `modules/admin/Dashboard.tsx` | ⚠️ Render KPI mà backend không cung cấp |
| Admin Users | `modules/admin/UserManager.tsx` | ⚠️ Gọi endpoint không tồn tại |
| Admin Places | `modules/admin/PlacesManager.tsx` | ✅ Hoạt động |
| Admin Providers | `modules/admin/ProviderApproval.tsx` | ⚠️ Gọi sai endpoint |
| Admin Services | `modules/admin/ServiceModeration.tsx` | ⚠️ Gọi endpoint không tồn tại |
| Admin Blogs | `modules/admin/BlogModeration.tsx` | ⚠️ Gọi endpoint không tồn tại |
| Admin Reports | `modules/admin/Reports.tsx` | ⚠️ Gọi endpoint không tồn tại |
| Admin Packages | `modules/admin/AdminPackagesManager.tsx` | ❌ Stub |
| Admin Promotions | `modules/admin/AdminPromotionsPreview.tsx` | ❌ Stub |

### 3.2 State Management

| Slice | File | Mô tả |
|---|---|---|
| `authSlice` | `store/authSlice.ts` | JWT user state |
| `tripSlice` | `store/tripSlice.ts` | Active trip state |
| `exploreSlice` | `store/exploreSlice.ts` | Search filters |
| `providerSlice` | `store/providerSlice.ts` | Provider keyword filter |
| `adminSlice` | `store/adminSlice.ts` | Admin filter state |
| `aiSlice` | `store/aiSlice.ts` | AI chat messages |

### 3.3 Type Definitions

| File | Domain |
|---|---|
| `shared/types/user.ts` | User types |
| `shared/types/provider.ts` | Provider types |
| `shared/types/place.ts` | Place types |
| `shared/types/service.ts` | Service types |
| `shared/types/trip.ts` | Trip types |
| `shared/types/review.ts` | Review types |
| `shared/types/blog.ts` | Blog types |
| `shared/types/report.ts` | Report types |
| `shared/types/ai.ts` | AI types |
| `types/provider.ts` | Provider DTOs (PackageDto, ProviderPromotionDto, etc.) |

---

## 4. API REALITY

### 4.1 API đang tồn tại và hoạt động

| API | Route | Backend | Frontend sử dụng |
|---|---|---|---|
| Auth | `api/auth/*` | ✅ | ✅ `api/authApi.ts` |
| Trip CRUD | `api/trips/*` | ✅ | ✅ `api/tripApi.ts` |
| Place Search | `api/places/search` | ✅ | ✅ `api/exploreApi.ts` |
| Place CRUD | `api/places/*` | ✅ | ✅ `api/exploreApi.ts` |
| Hotel/Restaurant/Activity/Vehicle Search | `api/places/hotels|restaurants|activities|vehicles/search` | ✅ | ✅ `api/exploreApi.ts` |
| Provider CRUD | `api/providers/*` | ✅ | ✅ `api/providerApi.ts` |
| Provider Approve/Reject | `POST api/providers/{id}/approve|reject` | ✅ | ❌ Frontend gọi sai endpoint |
| Provider Dashboard | `GET api/providers/{id}/dashboard` | ✅ | ✅ |
| Provider Packages | `api/provider/*` | ✅ | ✅ `store/apis/providerApi.ts` |
| Featured/Promoted | `api/providers/featured|explore-promoted` | ✅ | ✅ `store/apis/exploreApi.ts` |
| Feeds | `api/feeds/*` | ✅ | ✅ |
| Reviews | `api/reviews/*` | ✅ | ✅ |
| Admin Users | `GET api/admin/users` | ✅ | ✅ |
| Admin Lock User | `POST api/admin/users/{id}/lock` | ✅ (stub) | ❌ Frontend gọi `PUT /admin/users/{id}/status` |
| Admin Dashboard | `GET api/admin/dashboard` | ✅ (giới hạn) | ⚠️ Field mismatch |
| Admin Provider Packages | `api/admin/provider-packages/*` | ✅ | ❌ Frontend stub |

### 4.2 API Frontend đang gọi nhưng Backend KHÔNG có

| Frontend gọi | File | Backend thực tế |
|---|---|---|
| `GET /admin/providers?keyword=...` | `api/adminApi.ts` | Không tồn tại. API đúng: `GET /providers` (Admin) hoặc `GET /providers/pending` |
| `PUT /admin/providers/{id}/status` | `api/adminApi.ts` | Không tồn tại. API đúng: `POST /providers/{id}/approve` hoặc `POST /providers/{id}/reject` |
| `PUT /admin/users/{id}/status` | `api/adminApi.ts` | Không tồn tại. API đúng: `POST /admin/users/{id}/lock` |
| `GET /admin/services` | `api/adminApi.ts` | Không tồn tại |
| `PUT /admin/services/{id}/status` | `api/adminApi.ts` | Không tồn tại |
| `GET /admin/blogs` | `api/adminApi.ts` | Không tồn tại |
| `PUT /admin/blogs/{id}/status` | `api/adminApi.ts` | Không tồn tại |
| `GET /admin/reports` | `api/adminApi.ts` | Không tồn tại |
| `PUT /admin/reports/{id}/resolve` | `api/adminApi.ts` | Không tồn tại |
| `GET /provider/analytics` | `api/providerApi.ts` | Không tồn tại |

---

## 5. GAP REALITY

### Nguyên tắc

- Chỉ liệt kê Gap khi **CRD yêu cầu** nhưng **hệ thống chưa hoàn thành**.
- KHÔNG đưa Booking, Notification (standalone), Follow, Coupon, AI implementation vào Gap.
- Booking: CRD §7.2 loại rõ ràng.
- AI: CRD yêu cầu nhưng DEFERRED IMPLEMENTATION (chưa chọn AI Provider).

### 5.1 Gaps thuộc CRD – Frontend chưa hoàn thành

| Gap ID | CRD | Mô tả | Tầng thiếu |
|---|---|---|---|
| GAP-01 | §3.7.2 UC018 | Admin User Management: Frontend gọi sai endpoint. Backend có `POST /admin/users/{id}/lock` nhưng frontend gọi `PUT /admin/users/{id}/status`. Cần sửa frontend để gọi đúng API | Frontend |
| GAP-02 | §3.7.5 UC021 | Admin Dashboard: Frontend render 8+ KPI nhưng backend chỉ trả 2 (`TotalUsers`, `TotalTrips`). Frontend cần điều chỉnh để hiển thị đúng dữ liệu backend trả về | Frontend |
| GAP-03 | §3.7.1 UC019 | Admin Provider Approval: Frontend gọi sai endpoint (`GET /admin/providers`). Backend có sẵn `GET /providers/pending` và `POST /providers/{id}/approve|reject`. Cần sửa frontend | Frontend |
| GAP-04 | §3.7.1 UC019 | Admin Service Moderation: Backend không có endpoint moderation cho dịch vụ. Frontend gọi endpoint không tồn tại. Cần tái thiết kế frontend hiển thị "Coming Soon" hoặc wire đến endpoint có sẵn | Frontend |
| GAP-05 | §3.7.1 UC019 | Admin Blog Moderation: Backend không có endpoint moderation cho blog. Frontend gọi endpoint không tồn tại | Frontend |
| GAP-06 | §3.7.1 UC019 | Admin Review Moderation: Không có UI hoặc API cho review moderation | Frontend |
| GAP-07 | §3.6.2 SP003-SP005 | Provider Services Manager: Frontend hiện là stub "Coming Soon". Backend có sẵn Hotels/Restaurants/Activities/Vehicles API cho CRUD dịch vụ. Cần build frontend page để wire | Frontend |
| GAP-08 | §3.6.3 Tab Analytics, SP009 | Provider Analytics: Frontend dùng mock data. Backend `ProviderService.GetProviderDashboardStatsAsync` trả về `totalServices`, `avgRating` cơ bản. Cần wire frontend đến dữ liệu thực | Frontend |
| GAP-09 | Admin Packages | Admin Package Manager & Promotions Preview: Frontend là stub. Backend (`AdminProviderPackageController`) và RTK Query (`store/apis/adminApi.ts`) đầy đủ. Chỉ cần build UI | Frontend |
| GAP-10 | Kiến trúc | Hai tầng API song song (`src/api/` và `src/store/apis/`). Admin pages dùng layer cũ gọi endpoint sai. Cần consolidate | Frontend |

### 5.2 Lưu ý về các module KHÔNG phải Gap

| Module | Lý do KHÔNG phải Gap |
|---|---|
| Booking | CRD §7.2 loại rõ ràng |
| AI Implementation | DEFERRED — CRD yêu cầu nhưng chưa chọn AI Provider. UI skeleton đã có |
| SignalR Realtime | CRD yêu cầu nhưng Backend LOCKED — không thể thêm Hub |
| Trip Sharing service | CRD yêu cầu nhưng Backend LOCKED — không thể thêm service |
| Traveler Subscription service | CRD yêu cầu nhưng Backend LOCKED — không thể thêm service |
| Export Excel/PDF | CRD yêu cầu nhưng Backend LOCKED — không thể thêm endpoint |
| SearchScore formula | CRD công thức khác nhưng Backend LOCKED |

**Kết luận**: Tất cả Gap còn lại đều là Gap về **Frontend** — frontend chưa wire đúng đến backend API đã có sẵn, hoặc frontend page là stub cần build.
