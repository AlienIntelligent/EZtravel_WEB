# 10 – DANH MỤC API BACKEND (Backend API Catalog)

**Phiên bản**: 1.0  
**Ngày tạo**: 2026-06-07  
**Nguồn chân lý**: Source code Backend (Controllers + Services + DTOs)  
**Đối chiếu**: CRD_EZtravel_v3.docx, Frontend hiện tại  
**Ràng buộc**: Backend LOCKED — không thêm, sửa, xóa endpoint

---

## 1. MỤC ĐÍCH

Tài liệu này là **danh mục chính thức** của toàn bộ API Backend EZTravel. Mọi thành viên — đặc biệt Frontend developer — **phải đối chiếu tài liệu này** trước khi gọi API.

Mục tiêu:

- Liệt kê **mọi endpoint** đang tồn tại trong Backend
- Xác định **DTO** request/response cho mỗi endpoint
- Ghi rõ **trạng thái** tích hợp giữa Backend ↔ Frontend
- Phát hiện **API frontend đang gọi sai** hoặc **API còn thiếu** so với CRD
- Hỗ trợ Sprint Planning bằng dữ liệu thực

---

## 2. NGUYÊN TẮC SỬ DỤNG API

### 2.1 Quy tắc bắt buộc

1. **Chỉ gọi endpoint đã tồn tại** — không mock, không fake
2. **Endpoint URL phải khớp chính xác** — phân biệt `POST` vs `PUT`, `/lock` vs `/status`
3. **Request/Response type phải khớp Backend DTO** — không tự suy diễn
4. **Business logic lấy từ Backend** — frontend chỉ hiển thị
5. **Nếu thiếu endpoint → Coming Soon**, không tự tạo workaround

### 2.2 API Gateway

| Thành phần | Giá trị |
|---|---|
| Gateway | YARP API Gateway |
| Base URL | `https://localhost:7000` (development) |
| Auth | JWT Bearer Token |
| Content-Type | `application/json` |

### 2.3 Service Routing

| Service | Port | Prefix |
|---|---|---|
| Auth Service | 7001 | `api/auth`, `api/notifications` |
| Trip Service | 7002 | `api/trips` |
| Place Service | 7003 | `api/places` |
| Booking Service | 7004 | `api/providers`, `api/provider` |
| Community Service | 7005 | `api/feeds`, `api/reviews` |
| Admin Service | 7006 | `api/admin` |

---

## 3. AUTH APIs

**Controller**: `AuthController`  
**Route prefix**: `api/auth`  
**Service**: Auth Service (Port 7001)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| AUTH-01 | `POST` | `/auth/register` | Đăng ký tài khoản | `RegisterRequest` | `ApiResponse` | Public | ✅ Exists | ✅ `api/authApi.ts` | §3.1.1 | Done |
| AUTH-02 | `POST` | `/auth/login` | Đăng nhập JWT | `LoginRequest` | `LoginResponse` (token, refreshToken) | Public | ✅ Exists | ✅ `api/authApi.ts` | §3.1.2 | Done |
| AUTH-03 | `GET` | `/auth/me` | Lấy thông tin user đăng nhập | — | `UserProfile` | `[Authorize]` | ✅ Exists | ✅ `api/authApi.ts` | §3.1.4 | Done |

> **Lưu ý**: AuthController hiện tại chỉ có 3 endpoint. Các endpoint `POST /auth/verify-otp`, `POST /auth/refresh-token`, `POST /auth/forgot-password` được tham chiếu trong CRD nhưng cần xác nhận thêm trong AuthService.

---

## 4. NOTIFICATION APIs

**Controller**: `NotificationsController`  
**Route prefix**: `api/notifications`  
**Service**: Auth Service (Port 7001)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| NOTI-01 | `GET` | `/notifications` | Lấy thông báo của user | — | `List<NotificationDto>` | `[Authorize]` | ✅ Exists | ❌ Chưa wire | — | Sprint 7 |
| NOTI-02 | `POST` | `/notifications/{id}/read` | Đánh dấu đã đọc | — | `bool` | `[Authorize]` | ✅ Exists | ❌ Chưa wire | — | Sprint 7 |

---

## 5. TRIP APIs

**Controller**: `TripsController`  
**Route prefix**: `api/trips`  
**Service**: Trip Service (Port 7002)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| TRIP-01 | `GET` | `/trips` | Lấy lịch trình của user | — | `List<TripDto>` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.1 | Done |
| TRIP-02 | `GET` | `/trips/{id}` | Chi tiết lịch trình | — | `TripDetailDto` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.1 | Done |
| TRIP-03 | `POST` | `/trips` | Tạo lịch trình mới | `CreateTripRequest` | `TripDto` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.1 | Done |
| TRIP-04 | `PUT` | `/trips/{id}` | Cập nhật lịch trình | `UpdateTripRequest` | `TripDto` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.1 | Done |
| TRIP-05 | `DELETE` | `/trips/{id}` | Xóa lịch trình | — | `bool` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.1 | Done |
| TRIP-06 | `POST` | `/trips/{id}/locations` | Thêm địa điểm vào lịch trình | `AddLocationRequest` | `Result` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.2 | Done |
| TRIP-07 | `DELETE` | `/trips/{id}/items/{itemId}` | Xóa địa điểm khỏi lịch trình | — | `Result` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.2 | Done |
| TRIP-08 | `PUT` | `/trips/{id}/reorder` | Sắp xếp lại thứ tự | `ReorderItemsRequest` | `Result` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.3 | Done |
| TRIP-09 | `GET` | `/trips/{id}/cost` | Tính chi phí lịch trình | — | `CostDto` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.4 | Done |
| TRIP-10 | `POST` | `/trips/{id}/clone` | Clone lịch trình | — | `TripDto` | `[Authorize]` | ✅ Exists | ✅ `api/tripApi.ts` | §3.2.6 | Done |
| TRIP-11 | `GET` | `/trips/metadata/styles` | Phong cách du lịch | — | `List<Style>` | Public | ✅ Exists | ✅ `api/tripApi.ts` | §3.5.1 | Done |
| TRIP-12 | `GET` | `/trips/metadata/targets` | Đối tượng du lịch | — | `List<Target>` | Public | ✅ Exists | ✅ `api/tripApi.ts` | §3.5.1 | Done |
| TRIP-13 | `GET` | `/trips/metadata/budgets` | Mức ngân sách | — | `List<Budget>` | Public | ✅ Exists | ✅ `api/tripApi.ts` | §3.5.1 | Done |
| TRIP-14 | `POST` | `/trips/recommendations` | Gợi ý lịch trình | `RecommendationRequestDto` | `List<Recommendation>` | Public | ✅ Exists | ✅ `api/tripApi.ts` | §3.3.3 | Done |

---

## 6. EXPLORE APIs (Places)

**Controller**: `PlacesController`  
**Route prefix**: `api/places`  
**Service**: Place Service (Port 7003)

### 6.1 Places Core

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| PLACE-01 | `GET` | `/places/search` | Tìm kiếm địa điểm | `PlaceSearchRequest` (query) | `PagedResult<PlaceDto>` | Public | ✅ Exists | ✅ `api/exploreApi.ts` | §3.3.1 | Done |
| PLACE-02 | `GET` | `/places/{id}` | Chi tiết địa điểm | — | `PlaceDetailDto` | Public | ✅ Exists | ✅ `api/exploreApi.ts` | §3.3.2 | Done |
| PLACE-03 | `GET` | `/places/nearby` | Địa điểm gần | `lat, lng, radius` (query) | `List<PlaceDto>` | Public | ✅ Exists | ⚠️ Partial | §3.3.1 | Sprint 5 |
| PLACE-04 | `POST` | `/places` | Tạo địa điểm | `PlaceCreateRequest` | `PlaceDto` | Public* | ✅ Exists | ✅ `api/exploreApi.ts` | §3.7.3 | Done |
| PLACE-05 | `PUT` | `/places/{id}` | Cập nhật địa điểm | `PlaceUpdateRequest` | `PlaceDto` | Public* | ✅ Exists | ✅ `api/exploreApi.ts` | §3.7.3 | Done |
| PLACE-06 | `DELETE` | `/places/{id}` | Xóa địa điểm | — | `NoContent` | Admin | ✅ Exists | ✅ `api/exploreApi.ts` | §3.7.3 | Done |

> **\*** `POST /places` và `PUT /places/{id}` có `[Authorize(Roles = "Admin")]` bị comment out (BL-005). Đang Public nhưng nên là Admin.

### 6.2 Categories (Tỉnh/Thành)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| CAT-01 | `GET` | `/places/categories` | Danh sách tỉnh/thành | — | `List<TinhThanhDto>` | Public | ✅ Exists | ✅ `api/exploreApi.ts` | §3.7.3 | Done |
| CAT-02 | `GET` | `/places/categories/{id}` | Chi tiết tỉnh/thành | — | `TinhThanhDto` | Public | ✅ Exists | ✅ | §3.7.3 | Done |
| CAT-03 | `POST` | `/places/categories` | Tạo tỉnh/thành | `TinhThanhCreateRequest` | `TinhThanhDto` | Admin | ✅ Exists | ✅ | §3.7.3 | Done |
| CAT-04 | `PUT` | `/places/categories/{id}` | Cập nhật tỉnh/thành | `TinhThanhCreateRequest` | `TinhThanhDto` | Admin | ✅ Exists | ✅ | §3.7.3 | Done |
| CAT-05 | `DELETE` | `/places/categories/{id}` | Xóa tỉnh/thành | — | `NoContent` | Admin | ✅ Exists | ✅ | §3.7.3 | Done |

### 6.3 Hotels

**Controller**: `HotelsController` — Route: `api/places/hotels`

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| HOTEL-01 | `GET` | `/places/hotels/search` | Tìm khách sạn | `HotelSearchRequest` | `List<HotelDto>` | Public | ✅ Exists | ✅ `api/exploreApi.ts` | §3.3.1 | Done |
| HOTEL-02 | `GET` | `/places/hotels/{id}` | Chi tiết khách sạn | — | `HotelDetailDto` | Public | ✅ Exists | ✅ | §3.3.2 | Done |
| HOTEL-03 | `POST` | `/places/hotels` | Tạo khách sạn | `HotelCreateRequest` | `HotelDto` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP003 | Sprint 4 |
| HOTEL-04 | `PUT` | `/places/hotels/{id}` | Cập nhật khách sạn | `HotelUpdateRequest` | `HotelDto` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP004 | Sprint 4 |
| HOTEL-05 | `DELETE` | `/places/hotels/{id}` | Xóa khách sạn | — | `NoContent` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP005 | Sprint 4 |

### 6.4 Restaurants

**Controller**: `RestaurantsController` — Route: `api/places/restaurants`

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| REST-01 | `GET` | `/places/restaurants/search` | Tìm nhà hàng | `RestaurantSearchRequest` | `List<RestaurantDto>` | Public | ✅ Exists | ✅ `api/exploreApi.ts` | §3.3.1 | Done |
| REST-02 | `GET` | `/places/restaurants/{id}` | Chi tiết nhà hàng | — | `RestaurantDetailDto` | Public | ✅ Exists | ✅ | §3.3.2 | Done |
| REST-03 | `POST` | `/places/restaurants` | Tạo nhà hàng | `RestaurantCreateRequest` | `RestaurantDto` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP003 | Sprint 4 |
| REST-04 | `PUT` | `/places/restaurants/{id}` | Cập nhật nhà hàng | `RestaurantUpdateRequest` | `RestaurantDto` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP004 | Sprint 4 |
| REST-05 | `DELETE` | `/places/restaurants/{id}` | Xóa nhà hàng | — | `NoContent` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP005 | Sprint 4 |

### 6.5 Activities

**Controller**: `ActivitiesController` — Route: `api/places/activities`

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| ACT-01 | `GET` | `/places/activities/search` | Tìm hoạt động | `ActivitySearchRequest` | `List<ActivityDto>` | Public | ✅ Exists | ✅ `api/exploreApi.ts` | §3.3.1 | Done |
| ACT-02 | `GET` | `/places/activities/{id}` | Chi tiết hoạt động | — | `ActivityDetailDto` | Public | ✅ Exists | ✅ | §3.3.2 | Done |
| ACT-03 | `POST` | `/places/activities` | Tạo hoạt động | `ActivityCreateRequest` | `ActivityDto` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP003 | Sprint 4 |
| ACT-04 | `PUT` | `/places/activities/{id}` | Cập nhật hoạt động | `ActivityUpdateRequest` | `ActivityDto` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP004 | Sprint 4 |
| ACT-05 | `DELETE` | `/places/activities/{id}` | Xóa hoạt động | — | `NoContent` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP005 | Sprint 4 |

### 6.6 Vehicles

**Controller**: `VehiclesController` — Route: `api/places/vehicles`

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| VEH-01 | `GET` | `/places/vehicles/search` | Tìm phương tiện | `VehicleSearchRequest` | `List<VehicleDto>` | Public | ✅ Exists | ✅ `api/exploreApi.ts` | §3.3.1 | Done |
| VEH-02 | `GET` | `/places/vehicles/{id}` | Chi tiết phương tiện | — | `VehicleDetailDto` | Public | ✅ Exists | ✅ | §3.3.2 | Done |
| VEH-03 | `POST` | `/places/vehicles` | Tạo phương tiện | `VehicleCreateRequest` | `VehicleDto` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP003 | Sprint 4 |
| VEH-04 | `PUT` | `/places/vehicles/{id}` | Cập nhật phương tiện | `VehicleUpdateRequest` | `VehicleDto` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP004 | Sprint 4 |
| VEH-05 | `DELETE` | `/places/vehicles/{id}` | Xóa phương tiện | — | `NoContent` | `[Authorize]` | ✅ Exists | ❌ Missing | §3.6.2 SP005 | Sprint 4 |

---

## 7. REVIEW APIs

**Controller**: `ReviewsController`  
**Route prefix**: `api/reviews`  
**Service**: Community Service (Port 7005)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| REV-01 | `POST` | `/reviews` | Gửi đánh giá | `CreateReviewRequest` | `ReviewDto` | `[Authorize]` | ✅ Exists | ⚠️ Partial | §3.4.2 UC013 | Sprint 5 |
| REV-02 | `GET` | `/reviews/place/{id}` | Đánh giá theo địa điểm | — | `List<ReviewDto>` | Public | ✅ Exists | ⚠️ Partial | §3.4.2 | Sprint 5 |
| REV-03 | `GET` | `/reviews/service/{id}` | Đánh giá theo dịch vụ | — | `List<ReviewDto>` | Public | ✅ Exists | ❌ Missing | §3.4.2 | Sprint 5 |

---

## 8. COMMUNITY APIs

**Controller**: `FeedsController`  
**Route prefix**: `api/feeds`  
**Service**: Community Service (Port 7005)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| FEED-01 | `GET` | `/feeds` | Feed cộng đồng | — | `List<FeedDto>` | Public | ✅ Exists | ⚠️ Partial (nhúng) | §3.4.1 | Sprint 5 |
| FEED-02 | `POST` | `/feeds/{tripId}/like` | Like lịch trình | — | `Result` | `[Authorize]` | ✅ Exists | ⚠️ Partial | §3.4.4 | Sprint 5 |
| FEED-03 | `POST` | `/feeds/{tripId}/comment` | Bình luận lịch trình | `string` (body) | `CommentDto` | `[Authorize]` | ✅ Exists | ⚠️ Partial | §3.4.4 | Sprint 5 |
| FEED-04 | `GET` | `/feeds/{tripId}/comments` | Danh sách bình luận | — | `List<CommentDto>` | Public | ✅ Exists | ⚠️ Partial | §3.4.4 | Sprint 5 |

---

## 9. PROVIDER APIs

### 9.1 Provider Management

**Controller**: `ProvidersController`  
**Route prefix**: `api/providers`  
**Service**: Booking Service (Port 7004)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| PROV-01 | `GET` | `/providers/{id}` | Lấy NCC theo ID | — | `NhaCungCap` | Public | ✅ Exists | ✅ | §3.6.1 | Done |
| PROV-02 | `GET` | `/providers/{id}/dashboard` | Dashboard stats NCC | — | `DashboardStatsDto` | Public | ✅ Exists | ✅ `store/apis/providerApi.ts` | §3.6.3 | Done |
| PROV-03 | `GET` | `/providers/user/{userId}` | Lấy NCC theo userId | — | `NhaCungCap` | Public | ✅ Exists | ✅ | §3.6.1 | Done |
| PROV-04 | `GET` | `/providers/user/{userId}/dashboard` | Dashboard stats theo userId | — | `DashboardStatsDto` | Public | ✅ Exists | ✅ | §3.6.3 | Done |
| PROV-05 | `GET` | `/providers/featured` | NCC nổi bật | `topN` (query, default 10) | `List<ProviderPromotionDto>` | Public | ✅ Exists | ✅ `store/apis/exploreApi.ts` | §3.3.3 | Done |
| PROV-06 | `GET` | `/providers/explore-promoted` | NCC quảng bá Explore | — | `List<ProviderPromotionDto>` | Public | ✅ Exists | ✅ `store/apis/exploreApi.ts` | §3.6.4 | Done |
| PROV-07 | `GET` | `/providers` | Tất cả NCC (Admin) | — | `List<NhaCungCap>` | Admin | ✅ Exists | ❌ FE gọi sai URL | §3.7.1 | Sprint 4 |
| PROV-08 | `GET` | `/providers/pending` | NCC chờ duyệt (Admin) | — | `List<NhaCungCap>` | Admin | ✅ Exists | ❌ FE gọi sai URL | §3.7.1 UC019 | Sprint 4 |
| PROV-09 | `POST` | `/providers` | Đăng ký NCC | `CreateProviderRequest` | `NhaCungCap` | `[Authorize]` | ✅ Exists | ⚠️ Legacy | §3.6.1 SP001 | Sprint 4 |
| PROV-10 | `PUT` | `/providers/{id}` | Cập nhật NCC | `UpdateProviderRequest` | `NhaCungCap` | `[Authorize]` | ✅ Exists | ⚠️ Legacy | §3.6.1 SP002 | Sprint 4 |
| PROV-11 | `DELETE` | `/providers/{id}` | Xóa NCC | — | `NoContent` | `[Authorize]` | ✅ Exists | ⚠️ Partial | — | — |
| PROV-12 | `POST` | `/providers/{id}/approve` | Duyệt NCC | `ApproveProviderRequest { ApprovedBy }` | `{ message }` | Admin | ✅ Exists | ❌ FE gọi sai URL | §3.7.1 UC019 | Sprint 4 |
| PROV-13 | `POST` | `/providers/{id}/reject` | Từ chối NCC | `RejectProviderRequest { Reason }` | `{ message }` | Admin | ✅ Exists | ❌ FE gọi sai URL | §3.7.1 UC019 | Sprint 4 |

### 9.2 Provider Package

**Controller**: `ProviderPackageController`  
**Route prefix**: `api/provider`  
**Service**: Booking Service (Port 7004)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| PKG-01 | `GET` | `/provider/packages` | Danh sách gói | — | `List<PackageDto>` | `[Authorize]` | ✅ Exists | ✅ `store/apis/providerApi.ts` | §3.6.4 | Done |
| PKG-02 | `GET` | `/provider/current-package` | Gói hiện tại | — | `CurrentPackageDto` | `[Authorize]` | ✅ Exists | ✅ `store/apis/providerApi.ts` | §3.6.3 | Done |
| PKG-03 | `GET` | `/provider/package-history` | Lịch sử gói | — | `List<PackageHistoryDto>` | `[Authorize]` | ✅ Exists | ✅ `store/apis/providerApi.ts` | §3.6.4 | Done |
| PKG-04 | `POST` | `/provider/register-package` | Đăng ký gói | `RegisterPackageRequest` | `CurrentPackageDto` | `[Authorize]` | ✅ Exists | ✅ `store/apis/providerApi.ts` | §3.6.4 SP010 | Done |
| PKG-05 | `GET` | `/provider/payment-history` | Lịch sử thanh toán | — | `List<PaymentHistoryDto>` | `[Authorize]` | ✅ Exists | ✅ `store/apis/providerApi.ts` | §3.6.4 SP011 | Done |

---

## 10. ADMIN APIs

### 10.1 Admin Core

**Controller**: `AdminController`  
**Route prefix**: `api/admin`  
**Service**: Admin Service (Port 7006)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| ADM-01 | `GET` | `/admin/users` | Danh sách user | — | `List<UserDto>` | Admin | ✅ Exists | ⚠️ Partial (gọi đúng URL, action sai) | §3.7.2 UC018 | Sprint 4 |
| ADM-02 | `POST` | `/admin/users/{id}/lock` | Khóa user | — | `bool` | Admin | ✅ Exists (stub) | ❌ FE gọi `PUT .../status` | §3.7.2 UC018 | Sprint 4 |
| ADM-03 | `GET` | `/admin/dashboard` | Dashboard thống kê | — | `AdminDashboardDto` | Admin | ✅ Exists (giới hạn: TotalUsers, TotalTrips) | ⚠️ Field mismatch | §3.7.5 UC021 | Sprint 4 |
| ADM-04 | `GET` | `/admin/bookings` | Danh sách booking | — | `List<>` (trả về rỗng) | Admin | ✅ Exists (trả rỗng) | ❌ Ngoài phạm vi CRD | — | — |
| ADM-05 | `GET` | `/admin/bookings/{id}` | Chi tiết booking | — | `null` | Admin | ✅ Exists (trả null) | ❌ Ngoài phạm vi CRD | — | — |
| ADM-06 | `GET` | `/admin/payments` | Danh sách thanh toán | — | `List<>` (trả về rỗng) | Admin | ✅ Exists (trả rỗng) | ❌ Ngoài phạm vi CRD | — | — |
| ADM-07 | `GET` | `/admin/payments/{id}` | Chi tiết thanh toán | — | `null` | Admin | ✅ Exists (trả null) | ❌ Ngoài phạm vi CRD | — | — |

### 10.2 Admin Provider Packages

**Controller**: `AdminProviderPackageController`  
**Route prefix**: `api/admin/provider-packages`  
**Service**: Admin Service (Port 7006)

| # | Method | Route | Mô tả | Request DTO | Response DTO | Auth | Backend Status | Frontend Status | CRD | Sprint |
|---|---|---|---|---|---|---|---|---|---|---|
| APKG-01 | `GET` | `/admin/provider-packages/providers` | Danh sách NCC | — | `List<AdminProviderDto>` | Admin | ✅ Exists | ✅ RTK hook sẵn, UI stub | §3.6.4 | Sprint 6 |
| APKG-02 | `GET` | `/admin/provider-packages/providers/{providerId}` | Chi tiết NCC | — | `AdminProviderDetailDto` | Admin | ✅ Exists | ✅ RTK hook sẵn, UI stub | §3.6.4 | Sprint 6 |
| APKG-03 | `GET` | `/admin/provider-packages/packages` | Danh sách gói | — | `List<PackageDto>` | Admin | ✅ Exists | ✅ RTK hook sẵn, UI stub | §3.6.4 | Sprint 6 |
| APKG-04 | `POST` | `/admin/provider-packages/assign` | Cấp gói cho NCC | `AssignPackageRequest` | `{ message }` | Admin | ✅ Exists | ✅ RTK hook sẵn, UI stub | §3.6.4 | Sprint 6 |
| APKG-05 | `POST` | `/admin/provider-packages/extend` | Gia hạn gói | `ExtendPackageRequest` | `{ message }` | Admin | ✅ Exists | ✅ RTK hook sẵn, UI stub | §3.6.4 | Sprint 6 |
| APKG-06 | `POST` | `/admin/provider-packages/expire` | Hết hạn gói | `ExpirePackageRequest` | `{ message }` | Admin | ✅ Exists | ✅ RTK hook sẵn, UI stub | §3.6.4 | Sprint 6 |
| APKG-07 | `GET` | `/admin/provider-packages/statistics` | Thống kê gói | — | `PackageStatisticsDto` | Admin | ✅ Exists | ✅ RTK hook sẵn, UI stub | §3.6.4 | Sprint 6 |
| APKG-08 | `GET` | `/admin/provider-packages/promotions-preview` | Preview promotion | — | `List<ProviderPromotionDto>` | Admin | ✅ Exists | ✅ RTK hook sẵn, UI stub | §3.6.4 | Sprint 6 |

---

## 11. AI APIs

**Trạng thái**: Planned — Waiting AI Provider Selection  
**CRD**: §3.5 (Phase 3 — ⭐ Ưu tiên cao)

| # | Chức năng CRD | API cần thiết | Backend Status | Frontend Status | Ghi chú |
|---|---|---|---|---|---|
| AI-01 | AI Chat (§3.5.4) | `POST /ai/chat` | ❌ Chưa tồn tại | UI skeleton có (`modules/ai/Assistant.tsx`) | Waiting AI Provider |
| AI-02 | AI Trip Generator (§3.5.1) | `POST /ai/generate-trip` | ❌ Chưa tồn tại | UI skeleton có (`modules/ai/Planner.tsx`) | Waiting AI Provider |
| AI-03 | AI Route Optimizer (§3.5.2) | `POST /ai/optimize-route` | ❌ Chưa tồn tại | UI skeleton có (`modules/ai/AIRoutePanel.tsx`) | Waiting AI Provider |
| AI-04 | AI Budget Advisor (§3.5.3) | `POST /ai/budget-advice` | ❌ Chưa tồn tại | UI skeleton có (`modules/ai/AIBudgetPanel.tsx`) | Waiting AI Provider |
| AI-05 | AI History (§3.5) | `GET /ai/history` | ❌ Chưa tồn tại | UI skeleton có (`modules/ai/History.tsx`) | Waiting AI Provider |

> **⚠️ QUAN TRỌNG**: AI KHÔNG bị loại khỏi hệ thống. Đây là nghiệp vụ chính thức trong CRD Phase 3. Trạng thái hiện tại: **Planned — Waiting AI Provider Selection**. KHÔNG được ghi Removed / Cancelled / Out of Scope.

---

## 12. API KHÔNG TỒN TẠI (Frontend Đang Gọi Sai)

Danh sách endpoint **Frontend đang gọi** nhưng **Backend KHÔNG có**:

| # | Frontend gọi | File | Method | Endpoint đúng | Ghi chú |
|---|---|---|---|---|---|
| ERR-01 | `GET /admin/providers?keyword=...` | `src/api/adminApi.ts` | GET | `GET /providers` (Admin) hoặc `GET /providers/pending` | Cần wire đúng endpoint |
| ERR-02 | `PUT /admin/providers/{id}/status` | `src/api/adminApi.ts` | PUT | `POST /providers/{id}/approve` hoặc `POST /providers/{id}/reject` | Method sai (PUT→POST), URL sai |
| ERR-03 | `PUT /admin/users/{id}/status` | `src/api/adminApi.ts` | PUT | `POST /admin/users/{id}/lock` | Method sai (PUT→POST), URL sai |
| ERR-04 | `GET /admin/services` | `src/api/adminApi.ts` | GET | ❌ Không tồn tại | Backend LOCKED — hiển thị Coming Soon |
| ERR-05 | `PUT /admin/services/{id}/status` | `src/api/adminApi.ts` | PUT | ❌ Không tồn tại | Backend LOCKED — hiển thị Coming Soon |
| ERR-06 | `GET /admin/blogs` | `src/api/adminApi.ts` | GET | ❌ Không tồn tại | Backend LOCKED — hiển thị Coming Soon |
| ERR-07 | `PUT /admin/blogs/{id}/status` | `src/api/adminApi.ts` | PUT | ❌ Không tồn tại | Backend LOCKED — hiển thị Coming Soon |
| ERR-08 | `GET /admin/reports` | `src/api/adminApi.ts` | GET | ❌ Không tồn tại | Backend LOCKED — hiển thị Coming Soon |
| ERR-09 | `PUT /admin/reports/{id}/resolve` | `src/api/adminApi.ts` | PUT | ❌ Không tồn tại | Backend LOCKED — hiển thị Coming Soon |
| ERR-10 | `GET /provider/analytics` | `src/api/providerApi.ts` | GET | `GET /providers/{id}/dashboard` | Endpoint tương đương tồn tại |

---

## 13. API ĐANG GỌI SAI (Cần Sửa Frontend)

| # | Trang | Endpoint sai | Endpoint đúng | Hành động | Sprint |
|---|---|---|---|---|---|
| FIX-01 | AdminDashboard | Render 8+ KPI | `GET /admin/dashboard` chỉ trả `TotalUsers`, `TotalTrips` | Wire đúng, ẩn KPI thiếu | Sprint 4 |
| FIX-02 | UserManager | `PUT /admin/users/{id}/status` | `POST /admin/users/{id}/lock` | Sửa method + URL | Sprint 4 |
| FIX-03 | ProviderApproval | `GET /admin/providers` | `GET /providers/pending` | Sửa URL | Sprint 4 |
| FIX-04 | ProviderApproval | `PUT /admin/providers/{id}/status` | `POST /providers/{id}/approve` + `POST /providers/{id}/reject` | Sửa method + URL + tách action | Sprint 4 |
| FIX-05 | Admin legacy layer | `src/api/adminApi.ts` | `src/store/apis/adminApi.ts` | Consolidate API layer | Sprint 4 |

---

## 14. API CÒN THIẾU SO VỚI CRD

| # | CRD | Yêu cầu | Backend hiện tại | Cần Change Request? |
|---|---|---|---|---|
| GAP-01 | §3.1.5 | Traveler Subscription (Free/Premium) | Không có endpoint subscription | CHANGE REQUEST REQUIRED |
| GAP-02 | §3.2.5 UC017 | Cộng tác realtime (SignalR) | Không có SignalR Hub | CHANGE REQUEST REQUIRED |
| GAP-03 | §3.4.1 | Chia sẻ lịch trình (Public/Private) | Không có share endpoint | CHANGE REQUEST REQUIRED |
| GAP-04 | §3.5.1-3.5.4 | AI APIs (Chat, Generate, Optimize, Budget) | Không có AI endpoint | DEFERRED — Waiting AI Provider |
| GAP-05 | §3.7.1 UC019 | Admin Service Moderation | Không có admin endpoint cho dịch vụ | CHANGE REQUEST REQUIRED |
| GAP-06 | §3.7.1 UC019 | Admin Blog Moderation | Không có admin endpoint cho blog | CHANGE REQUEST REQUIRED |
| GAP-07 | §3.7.1 UC019 | Admin Review Moderation | Không có admin endpoint cho review | CHANGE REQUEST REQUIRED |
| GAP-08 | §3.7.4 UC022 | Quản lý mã giảm giá | Không có bảng DB + endpoint | CHANGE REQUEST REQUIRED |
| GAP-09 | §3.7.5 UC021 | Xuất báo cáo Excel/PDF | Không có export endpoint | CHANGE REQUEST REQUIRED |
| GAP-10 | §3.4.2 SP008 | NCC phản hồi đánh giá | Không rõ endpoint phản hồi | Cần xác nhận |

---

## 15. API CẦN CHANGE REQUEST

Tổng hợp các API cần Change Request chính thức từ Trưởng nhóm để mở khóa Backend:

| CR-ID | Phạm vi | Mô tả | CRD | Tác động | Ưu tiên |
|---|---|---|---|---|---|
| CR-API-01 | Backend | Thêm SignalR Hub cho cộng tác realtime | §3.2.5 | Trip Planner collaboration | Trung bình |
| CR-API-02 | Backend | Thêm endpoint share/unshare trip | §3.4.1 | Community sharing | Trung bình |
| CR-API-03 | Backend | Thêm AI endpoints (khi chọn provider) | §3.5 | AI domain toàn bộ | Cao |
| CR-API-04 | Backend | Thêm admin moderation endpoints (service, blog, review, trip) | §3.7.1 | Admin moderation | Trung bình |
| CR-API-05 | DB + Backend | Thêm bảng + endpoint mã giảm giá | §3.7.4 | Coupon management | Thấp |
| CR-API-06 | Backend | Thêm export Excel/PDF endpoint | §3.7.5 | Reports export | Thấp |
| CR-API-07 | Backend | Thêm endpoint subscription Traveler | §3.1.5 | Freemium model | Cao (khi có AI) |

---

## THỐNG KÊ TỔNG HỢP

| Chỉ số | Số lượng |
|---|---|
| **Tổng API Backend** | 76 endpoints |
| **Frontend Implemented** | 40 |
| **Frontend Partial** | 13 |
| **Frontend Missing** | 17 |
| **Frontend Gọi Sai** | 10 |
| **Backend Stub** | 4 (bookings/payments trả rỗng, lock user trả true) |
| **API Cần CR** | 7 Change Requests |
| **AI API Deferred** | 5 endpoints |

---

*Tài liệu này được tạo từ source code backend thực tế. Mọi thay đổi API phải tuân theo Change Request Policy (01_PROJECT_CONSTITUTION.md §VII).*
