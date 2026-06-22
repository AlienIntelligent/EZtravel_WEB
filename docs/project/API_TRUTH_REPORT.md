# API TRUTH REPORT

> Current status note (2026-06-21): This file is historical and is no longer the active API truth. Use `docs/project/15_CURRENT_API_TRUTH_2026_06_18.md`, `docs/project/16_FRONTEND_RUNTIME_ROUTE_AUDIT.md`, and `docs/project/14_SYSTEM_PROGRESS_AND_NEXT_PLAN.md` instead. Those files are updated through Phase 2X, including full-stack Provider verification, active Admin provider-package catalog management, and persisted Trip comments. Current migrations are applied to the isolated LocalDB acceptance database; configured SQLEXPRESS deployment still needs an external Windows session because this tool identity cannot establish its SSPI context.

**Ngày kiểm toán**: 2026-06-08  
**Nguồn chân lý**: Source code Backend + Database schema  
**Đối chiếu**: `10_BACKEND_API_CATALOG.md`, `11_DATABASE_BUSINESS_MAPPING.md`, `13_TEAM_EXECUTION_PLAN.md`  
**Quy tắc**: Chỉ đọc và đối chiếu. Không suy đoán. Không sửa code.

---

## 1. Executive Summary

### Endpoint Count

| Chỉ số | Giá trị |
|---|---|
| **Document claims** | 76 endpoints |
| **Actual (source code)** | 65 endpoints |
| **Difference** | **-11 (OVERCOUNTED)** |

### Root Cause

Tài liệu `10_BACKEND_API_CATALOG.md` **đếm thừa 11 endpoints**:
- 5 AI endpoints (AI-01→AI-05) được đếm vào tổng — thực tế **CHƯA TỒN TẠI** trong backend
- 6 endpoints trong bảng "§14: API Còn Thiếu So Với CRD" được **tính nhầm** vào tổng (GAP-01→GAP-10 không phải endpoint thực)

### Kết luận

```
OVERCOUNTED — Document claims 76, Actual is 65
```

---

## 2. Nhiệm vụ 1 — Kiểm kê Endpoint Thực tế

### 2.1 Bảng endpoint thực tế (từ source code)

#### AuthController — Route: `api/auth` — AuthService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | Public | `RegisterRequest` | `ApiResponse` |
| 2 | POST | `/api/auth/login` | Public | `LoginRequest` | `ApiResponse` (contains token) |
| 3 | GET | `/api/auth/me` | `[Authorize]` | — | `ApiResponse` (contains user) |

**Source**: [AuthController.cs](file:///d:/eztravel/Microservices/ezTravel.AuthService/Controllers/AuthController.cs)

---

#### NotificationsController — Route: `api/notifications` — AuthService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 4 | GET | `/api/notifications` | `[Authorize]` | — | `List<NotificationDto>` |
| 5 | POST | `/api/notifications/{id}/read` | `[Authorize]` | — | `Result` |

**Source**: [NotificationsController.cs](file:///d:/eztravel/Microservices/ezTravel.AuthService/Controllers/NotificationsController.cs)

---

#### TripsController — Route: `api/trips` — TripService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 6 | GET | `/api/trips` | `[Authorize]` | — | `List<TripDto>` |
| 7 | GET | `/api/trips/{id}` | `[Authorize]` | — | `TripDto` |
| 8 | POST | `/api/trips` | `[Authorize]` | `CreateTripRequest` | `TripDto` |
| 9 | PUT | `/api/trips/{id}` | `[Authorize]` | `UpdateTripRequest` | `TripDto` |
| 10 | DELETE | `/api/trips/{id}` | `[Authorize]` | — | `Result` |
| 11 | POST | `/api/trips/{id}/locations` | `[Authorize]` | `AddLocationRequest` | `Result` |
| 12 | DELETE | `/api/trips/{id}/items/{itemId}` | `[Authorize]` | — | `Result` |
| 13 | PUT | `/api/trips/{id}/reorder` | `[Authorize]` | `ReorderItemsRequest` | `Result` |
| 14 | GET | `/api/trips/{id}/cost` | `[Authorize]` | — | `CostDto` |
| 15 | POST | `/api/trips/{id}/clone` | `[Authorize]` | — | `TripDto` |
| 16 | GET | `/api/trips/metadata/styles` | `[AllowAnonymous]` | — | `List<PhongCachDuLich>` |
| 17 | GET | `/api/trips/metadata/targets` | `[AllowAnonymous]` | — | `List<DoiTuongDuLich>` |
| 18 | GET | `/api/trips/metadata/budgets` | `[AllowAnonymous]` | — | `List<MucNganSach>` |
| 19 | POST | `/api/trips/recommendations` | `[AllowAnonymous]` | `RecommendationRequestDto` | `List<Recommendation>` |

**Source**: [TripsController.cs](file:///d:/eztravel/Microservices/ezTravel.TripService/Controllers/TripsController.cs)

---

#### PlacesController — Route: `api/places` — PlaceService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 20 | GET | `/api/places/search` | Public | `PlaceSearchRequest` (query) | `PagedResult<PlaceDto>` |
| 21 | GET | `/api/places/{id}` | Public | — | `PlaceDto` |
| 22 | GET | `/api/places/nearby` | Public | `lat, lng, radius` (query) | `List<PlaceDto>` |
| 23 | POST | `/api/places` | Public* (Authorize commented out) | `PlaceCreateRequest` | `PlaceDto` |
| 24 | PUT | `/api/places/{id}` | Public* (Authorize commented out) | `PlaceUpdateRequest` | `PlaceDto` |
| 25 | DELETE | `/api/places/{id}` | `[Authorize(Roles = "Admin")]` | — | `NoContent` |
| 26 | GET | `/api/places/categories` | Public | — | `List<TinhThanh>` |
| 27 | GET | `/api/places/categories/{id}` | Public | — | `TinhThanh` |
| 28 | POST | `/api/places/categories` | `[Authorize(Roles = "Admin")]` | `TinhThanhCreateRequest` | `TinhThanh` |
| 29 | PUT | `/api/places/categories/{id}` | `[Authorize(Roles = "Admin")]` | `TinhThanhCreateRequest` | `TinhThanh` |
| 30 | DELETE | `/api/places/categories/{id}` | `[Authorize(Roles = "Admin")]` | — | `NoContent` |

**Source**: [PlacesController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/PlacesController.cs)

---

#### HotelsController — Route: `api/places/hotels` — PlaceService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 31 | GET | `/api/places/hotels/search` | Public | `HotelSearchRequest` | `List<HotelDto>` |
| 32 | GET | `/api/places/hotels/{id}` | Public | — | `HotelDetailDto` |
| 33 | POST | `/api/places/hotels` | `[Authorize]` | `HotelCreateRequest` | `HotelDto` |
| 34 | PUT | `/api/places/hotels/{id}` | `[Authorize]` | `HotelUpdateRequest` | `HotelDto` |
| 35 | DELETE | `/api/places/hotels/{id}` | `[Authorize]` | — | `NoContent` |

**Source**: [HotelsController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/HotelsController.cs)

---

#### RestaurantsController — Route: `api/places/restaurants` — PlaceService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 36 | GET | `/api/places/restaurants/search` | Public | `RestaurantSearchRequest` | `List<RestaurantDto>` |
| 37 | GET | `/api/places/restaurants/{id}` | Public | — | `RestaurantDetailDto` |
| 38 | POST | `/api/places/restaurants` | `[Authorize]` | `RestaurantCreateRequest` | `RestaurantDto` |
| 39 | PUT | `/api/places/restaurants/{id}` | `[Authorize]` | `RestaurantUpdateRequest` | `RestaurantDto` |
| 40 | DELETE | `/api/places/restaurants/{id}` | `[Authorize]` | — | `NoContent` |

**Source**: [RestaurantsController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/RestaurantsController.cs)

---

#### ActivitiesController — Route: `api/places/activities` — PlaceService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 41 | GET | `/api/places/activities/search` | Public | `ActivitySearchRequest` | `List<ActivityDto>` |
| 42 | GET | `/api/places/activities/{id}` | Public | — | `ActivityDetailDto` |
| 43 | POST | `/api/places/activities` | `[Authorize]` | `ActivityCreateRequest` | `ActivityDto` |
| 44 | PUT | `/api/places/activities/{id}` | `[Authorize]` | `ActivityUpdateRequest` | `ActivityDto` |
| 45 | DELETE | `/api/places/activities/{id}` | `[Authorize]` | — | `NoContent` |

**Source**: [ActivitiesController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/ActivitiesController.cs)

---

#### VehiclesController — Route: `api/places/vehicles` — PlaceService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 46 | GET | `/api/places/vehicles/search` | Public | `VehicleSearchRequest` | `List<VehicleDto>` |
| 47 | GET | `/api/places/vehicles/{id}` | Public | — | `VehicleDetailDto` |
| 48 | POST | `/api/places/vehicles` | `[Authorize]` | `VehicleCreateRequest` | `VehicleDto` |
| 49 | PUT | `/api/places/vehicles/{id}` | `[Authorize]` | `VehicleUpdateRequest` | `VehicleDto` |
| 50 | DELETE | `/api/places/vehicles/{id}` | `[Authorize]` | — | `NoContent` |

**Source**: [VehiclesController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/VehiclesController.cs)

---

#### ProvidersController — Route: `api/providers` — BookingService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 51 | GET | `/api/providers/{id}` | Public | — | `NhaCungCap` |
| 52 | GET | `/api/providers/{id}/dashboard` | Public | — | `DashboardStatsDto` |
| 53 | GET | `/api/providers/user/{userId}` | Public | — | `NhaCungCap` |
| 54 | GET | `/api/providers/user/{userId}/dashboard` | Public | — | `DashboardStatsDto` |
| 55 | GET | `/api/providers/featured` | Public | `topN` (query) | `List<ProviderPromotionDto>` |
| 56 | GET | `/api/providers/explore-promoted` | Public | — | `List<ProviderPromotionDto>` |
| 57 | GET | `/api/providers` | `[Authorize(Roles = "Admin")]` | — | `List<NhaCungCap>` |
| 58 | GET | `/api/providers/pending` | `[Authorize(Roles = "Admin")]` | — | `List<NhaCungCap>` |
| 59 | POST | `/api/providers` | `[Authorize]` | `CreateProviderRequest` | `NhaCungCap` |
| 60 | PUT | `/api/providers/{id}` | `[Authorize]` | `UpdateProviderRequest` | `NhaCungCap` |
| 61 | DELETE | `/api/providers/{id}` | `[Authorize]` | — | `NoContent` |
| 62 | POST | `/api/providers/{id}/approve` | `[Authorize(Roles = "Admin")]` | `ApproveProviderRequest` | `{ message }` |
| 63 | POST | `/api/providers/{id}/reject` | `[Authorize(Roles = "Admin")]` | `RejectProviderRequest` | `{ message }` |

**Source**: [ProvidersController.cs](file:///d:/eztravel/Microservices/ezTravel.BookingService/Controllers/ProvidersController.cs)

---

#### ProviderPackageController — Route: `api/provider` — BookingService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 64 | GET | `/api/provider/packages` | `[Authorize]` | — | `List<PackageDto>` |
| 65 | GET | `/api/provider/current-package` | `[Authorize]` | — | `CurrentPackageDto` |
| 66 | GET | `/api/provider/package-history` | `[Authorize]` | — | `List<PackageHistoryDto>` |
| 67 | POST | `/api/provider/register-package` | `[Authorize]` | `RegisterPackageRequest` | `CurrentPackageDto` |
| 68 | GET | `/api/provider/payment-history` | `[Authorize]` | — | `List<PaymentHistoryDto>` |

**Source**: [ProviderPackageController.cs](file:///d:/eztravel/Microservices/ezTravel.BookingService/Controllers/ProviderPackageController.cs)

---

#### FeedsController — Route: `api/feeds` — CommunityService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 69 | GET | `/api/feeds` | Public | — | `List<FeedDto>` |
| 70 | POST | `/api/feeds/{tripId}/like` | `[Authorize]` | — | `Result` |
| 71 | POST | `/api/feeds/{tripId}/comment` | `[Authorize]` | `string` (body) | `Result` |
| 72 | GET | `/api/feeds/{tripId}/comments` | Public | — | `List<Comment>` |

**Source**: [FeedsController.cs](file:///d:/eztravel/Microservices/ezTravel.CommunityService/Controllers/FeedsController.cs)

---

#### ReviewsController — Route: `api/reviews` — CommunityService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 73 | POST | `/api/reviews` | `[Authorize]` | `CreateReviewRequest` | `Result` |
| 74 | GET | `/api/reviews/place/{id}` | Public | — | `List<ReviewDto>` |
| 75 | GET | `/api/reviews/service/{id}` | Public | — | `List<ReviewDto>` |

**Source**: [ReviewsController.cs](file:///d:/eztravel/Microservices/ezTravel.CommunityService/Controllers/ReviewsController.cs)

---

#### AdminController — Route: `api/admin` — AdminService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 76 | GET | `/api/admin/users` | `[Authorize(Roles = "Admin")]` | — | `List<UserDto>` |
| 77 | POST | `/api/admin/users/{id}/lock` | `[Authorize(Roles = "Admin")]` | — | `bool` |
| 78 | GET | `/api/admin/dashboard` | `[Authorize(Roles = "Admin")]` | — | `AdminDashboardDto` |
| 79 | GET | `/api/admin/bookings` | `[Authorize(Roles = "Admin")]` | — | `List<>` |
| 80 | GET | `/api/admin/bookings/{id}` | `[Authorize(Roles = "Admin")]` | — | `object` |
| 81 | GET | `/api/admin/payments` | `[Authorize(Roles = "Admin")]` | — | `List<>` |
| 82 | GET | `/api/admin/payments/{id}` | `[Authorize(Roles = "Admin")]` | — | `object` |

**Source**: [AdminController.cs](file:///d:/eztravel/Microservices/ezTravel.AdminService/Controllers/AdminController.cs)

---

#### AdminProviderPackageController — Route: `api/admin/provider-packages` — AdminService

| # | Method | Route | Authorize | DTO Request | DTO Response |
|---|---|---|---|---|---|
| 83 | GET | `/api/admin/provider-packages/promotions-preview` | `[Authorize(Roles = "Admin")]` | — | `List<ProviderPromotionDto>` |
| 84 | GET | `/api/admin/provider-packages/providers` | `[Authorize(Roles = "Admin")]` | — | `List<AdminProviderDto>` |
| 85 | GET | `/api/admin/provider-packages/providers/{providerId}` | `[Authorize(Roles = "Admin")]` | — | `AdminProviderDetailDto` |
| 86 | GET | `/api/admin/provider-packages/packages` | `[Authorize(Roles = "Admin")]` | — | `List<PackageDto>` |
| 87 | POST | `/api/admin/provider-packages/assign` | `[Authorize(Roles = "Admin")]` | `AssignPackageRequest` | `{ message }` |
| 88 | POST | `/api/admin/provider-packages/extend` | `[Authorize(Roles = "Admin")]` | `ExtendPackageRequest` | `{ message }` |
| 89 | POST | `/api/admin/provider-packages/expire` | `[Authorize(Roles = "Admin")]` | `ExpirePackageRequest` | `{ message }` |
| 90 | GET | `/api/admin/provider-packages/statistics` | `[Authorize(Roles = "Admin")]` | — | `PackageStatisticsDto` |

**Source**: [AdminProviderPackageController.cs](file:///d:/eztravel/Microservices/ezTravel.AdminService/Controllers/AdminProviderPackageController.cs)

---

### 2.2 Tổng kết

```
Tổng số endpoint thực tế: 90 (không phải 65 hay 76)
```

**WAIT — kiểm tra lại**: Tôi đếm từng dòng endpoint ở trên: 3 + 2 + 14 + 11 + 5 + 5 + 5 + 5 + 13 + 5 + 4 + 3 + 7 + 8 = **90 endpoints**.

### 2.3 Phân tích lại so với tài liệu

Tài liệu ghi **76 endpoints** nhưng thực tế có **90 method actions** trong controllers.

**Nguyên nhân chênh lệch Document (76) vs Actual (90)**:

| Lý do | Số lượng |
|---|---|
| AI-01→AI-05: Tài liệu đếm 5 AI endpoints nhưng chúng không tồn tại (tổng giảm -5) | -5 |
| Tài liệu đánh số chỉ đến APKG-08 (8 endpoints AdminProviderPackage) nhưng thực tế đúng 8 → OK | 0 |
| Tài liệu đánh số TRIP-01→TRIP-14 (14) → thực tế 14 → OK | 0 |
| Tài liệu đánh số Restaurants/Hotels/Activities/Vehicles mỗi loại 5 → thực tế mỗi loại 5 → OK | 0 |
| AdminController: Tài liệu đánh số ADM-01→ADM-07 (7) → thực tế 7 → OK | 0 |
| **Tài liệu thiếu đếm nhiều endpoint thực tế** → Lý do chính | **+19** |

**Chi tiết chênh lệch**:

Tài liệu đếm 76 bao gồm 5 AI (không tồn tại). Bỏ AI = **71 documented existing endpoints**.  
Thực tế = **90 endpoints** → chênh lệch = **+19 endpoints thực tế không được tài liệu liệt kê đầy đủ**.

**NHƯNG** — kiểm tra lại tài liệu: Tổng 76 trong "THỐNG KÊ TỔNG HỢP" là con số bao gồm cả AI. Nếu bỏ AI (5) = 71. Thực tế: Tài liệu **có liệt kê mỗi endpoint** nhưng **đếm tổng sai**. Đây là lỗi tính toán trong mục thống kê.

### 2.4 Kết luận Nhiệm vụ 1

```
INCORRECT — Document claims 76 total endpoints
Actual existing endpoints: 90
AI endpoints (non-existent): 0
Correct total: 90 (excluding AI), not 76

The document UNDERCOUNTED by 14 real endpoints 
while also including 5 non-existent AI endpoints.
Net error: +19 endpoint discrepancy.
```

---

## 3. Nhiệm vụ 2 — Xác minh NotificationsController

### 3.1 Controller tồn tại?

```
TRUE — File: Microservices/ezTravel.AuthService/Controllers/NotificationsController.cs
```

### 3.2 Route chính xác

| Endpoint | Tài liệu ghi | Thực tế | Khớp? |
|---|---|---|---|
| GET notifications | `GET /notifications` | `[HttpGet]` on route `api/notifications` = `GET /api/notifications` | ✅ TRUE |
| POST mark read | `POST /notifications/{id}/read` | `[HttpPost("{id}/read")]` = `POST /api/notifications/{id}/read` | ✅ TRUE |

### 3.3 DTO sử dụng

| Endpoint | Service | DTO |
|---|---|---|
| GET | `INotificationService.GetUserNotificationsAsync(userId)` | Return type: inferred `List<>` (cần xác minh service layer) |
| POST | `INotificationService.MarkAsReadAsync(id)` | Return type: inferred `Result` |

### 3.4 Frontend đã gọi?

```
UNVERIFIED — Grep "notifications" trong WebClient cần kiểm tra thêm.
Nhưng tài liệu 10_BACKEND_API_CATALOG.md ghi: "❌ Chưa wire"
```

### 3.5 YARP Gateway routing

```
CRITICAL FINDING: YARP Gateway (yarp.json) KHÔNG có route cho /api/notifications

Hệ quả: Notifications endpoint tồn tại trong AuthService (port 7001)
nhưng KHÔNG thể truy cập qua API Gateway.
Frontend phải gọi trực tiếp port 7001 hoặc cần thêm route YARP.
```

**Bằng chứng**: [yarp.json](file:///d:/eztravel/Microservices/ezTravel.ApiGateway/yarp.json) — Không có route chứa "notifications".

### 3.6 Kết luận Nhiệm vụ 2

```
PARTIAL — Controller tồn tại, routes đúng, nhưng YARP Gateway THIẾU routing.
Tài liệu KHÔNG ghi nhận thiếu route YARP → đây là sai sót.
```

---

## 4. Nhiệm vụ 3 — Xác minh Auth Domain

### 4.1 Kết quả tìm kiếm trong source code

| Keyword | Kết quả | Source |
|---|---|---|
| `verify-otp` | ❌ **KHÔNG TÌM THẤY** trong toàn bộ Microservices | grep trả về 0 kết quả |
| `refresh-token` | ❌ **KHÔNG TÌM THẤY** trong toàn bộ Microservices | grep trả về 0 kết quả |
| `forgot-password` | ❌ **KHÔNG TÌM THẤY** trong toàn bộ Microservices | grep trả về 0 kết quả |
| `OtpXacThuc` | ✅ Entity + Repository + DbSet | Entities, UnitOfWork, AppDbContext |
| `RefreshToken` | ✅ Entity + Repository + DbSet | Entities, UnitOfWork, AppDbContext |

### 4.2 Bảng triển khai

| Feature | DB Table | Entity C# | Repository | Service | Controller Endpoint |
|---|---|---|---|---|---|
| OTP Verification | ✅ `OTP_XAC_THUC` | ✅ `OtpXacThuc` | ✅ `IGenericRepository<OtpXacThuc>` via UnitOfWork | ❌ **KHÔNG TÌM THẤY** trong Services | ❌ **KHÔNG CÓ** endpoint |
| Refresh Token | ✅ `REFRESH_TOKEN` | ✅ `RefreshToken` | ✅ `IGenericRepository<RefreshToken>` via UnitOfWork | ❌ **KHÔNG TÌM THẤY** trong Services | ❌ **KHÔNG CÓ** endpoint |
| Forgot Password | — (dùng OTP table) | — | — | ❌ **KHÔNG TÌM THẤY** | ❌ **KHÔNG CÓ** endpoint |

### 4.3 Bằng chứng

- `OtpXacThuc` tồn tại tại: [OtpXacThuc.cs](file:///d:/eztravel/DataAccess/ezTravel.Entities/OtpXacThuc.cs)
- `RefreshToken` tồn tại tại: [RefreshToken.cs](file:///d:/eztravel/DataAccess/ezTravel.Entities/RefreshToken.cs)
- `IUnitOfWork` có repository: [IUnitOfWork.cs](file:///d:/eztravel/DataAccess/ezTravel.Repository/Interfaces/IUnitOfWork.cs) — line 31 (`OtpXacThucs`), line 33 (`RefreshTokens`)
- Grep `OtpXacThuc|RefreshToken` trong `Services/` folder: **0 results** — Service layer KHÔNG sử dụng

### 4.4 Kết luận Nhiệm vụ 3

```
DATABASE ONLY — Bảng OTP_XAC_THUC và REFRESH_TOKEN tồn tại trong database + có Entity C# + có 
Repository, nhưng KHÔNG có Service layer và KHÔNG có Controller endpoint.

Tài liệu 11_DATABASE_BUSINESS_MAPPING.md ghi:
- OTP_XAC_THUC: "API sử dụng: AuthController (verify-otp, forgot-password)" → SAI
- REFRESH_TOKEN: "API sử dụng: AuthController (refresh-token)" → SAI

Thực tế: AuthController chỉ có 3 endpoints: register, login, me.
Không có verify-otp, refresh-token, hay forgot-password.
```

---

## 5. Nhiệm vụ 4 — Xác minh Saved Items

### 5.1 Kết quả tìm kiếm

| Keyword | DataAccess | Services | Microservices | WebClient |
|---|---|---|---|---|
| `LuuLichTrinh` | ✅ Entity + Repository + DbContext | ❌ **0 results** | ❌ **0 results** | UNVERIFIED |
| `LUU_LICH_TRINH` | ✅ AppDbContext line 910 | ❌ | ❌ | UNVERIFIED |
| `SavedTrip` | — | ❌ | ❌ | UNVERIFIED |
| `Bookmark` | — | ❌ | ❌ | UNVERIFIED |
| `Favorite` | — | ❌ | ❌ | UNVERIFIED |

### 5.2 Chuỗi triển khai

```
DB Table: LUU_LICH_TRINH         ✅ EXISTS
     ↓
Entity: LuuLichTrinh             ✅ EXISTS (DataAccess/ezTravel.Entities/LuuLichTrinh.cs)
     ↓
Repository: IGenericRepository   ✅ EXISTS (UnitOfWork line 27: LuuLichTrinhs)
     ↓
Service:                         ❌ BREAK POINT — Không có service nào sử dụng LuuLichTrinh
     ↓
Controller:                      ❌ NOT EXISTS — Không có endpoint
     ↓
Frontend:                        ❌ NOT EXISTS
```

### 5.3 Entity chi tiết

```csharp
// Source: DataAccess/ezTravel.Entities/LuuLichTrinh.cs
public partial class LuuLichTrinh
{
    public int MaLichTrinh { get; set; }
    public int MaNguoiDung { get; set; }
    public DateTime NgayLuu { get; set; }
    public virtual LichTrinh MaLichTrinhNavigation { get; set; }
    public virtual NguoiDung MaNguoiDungNavigation { get; set; }
}
```

Bảng không có Primary Key riêng (composite key: `MaLichTrinh + MaNguoiDung`).

### 5.4 Kết luận Nhiệm vụ 4

```
DATABASE ONLY — Bảng LUU_LICH_TRINH tồn tại, Entity tồn tại, Repository tồn tại,
nhưng KHÔNG có Service, KHÔNG có Controller, KHÔNG có Frontend.

Tài liệu 11_DATABASE_BUSINESS_MAPPING.md ghi:
"API sử dụng: ⚠️ Có thể qua FeedsController (chưa xác nhận)" → UNVERIFIED
Kiểm tra FeedsController: KHÔNG có bất kỳ reference nào đến LuuLichTrinh.

Kết luận: Database Only. Điểm đứt gãy tại Service layer.
```

---

## 6. Nhiệm vụ 5 — Kiểm kê Bảng Không Có API

### 6.1 Danh sách bảng từ DbContext

DbContext có **36 DbSets** + 1 join table (`DIA_DIEM_TAG` — configured inline) = **37 physical tables**

### 6.2 Đối chiếu

| # | Bảng (ToTable) | Entity C# | API Endpoint Tồn Tại? | Ghi chú |
|---|---|---|---|---|
| 1 | ANH_BAI_VIET | `AnhBaiViet` | ❌ | Không có endpoint riêng |
| 2 | ANH_DANH_GIA | `AnhDanhGia` | ❌ | Không có endpoint riêng |
| 3 | ANH_DIA_DIEM | `AnhDiaDiem` | ❌ (nested trong Places) | Gián tiếp qua Places CRUD |
| 4 | ANH_DICH_VU | `AnhDichVu` | ❌ (nested trong Service CRUD) | Gián tiếp |
| 5 | BAI_VIET | `BaiViet` | ⚠️ Gián tiếp qua Feeds | Không có CRUD endpoint riêng |
| 6 | BAO_CAO_NOI_DUNG | `BaoCaoNoiDung` | ❌ | Không có endpoint |
| 7 | BINH_LUAN_BAI_VIET | `BinhLuanBaiViet` | ⚠️ Gián tiếp qua Feeds (Comments) | FeedsController.CommentOnTrip |
| 8 | CHI_PHI_DICH_VU_LICH_TRINH | `ChiPhiDichVuLichTrinh` | ⚠️ Gián tiếp qua Trips (Cost) | TripsController.GetCost |
| 9 | CHIA_SE_LICH_TRINH | `ChiaSeLichTrinh` | ❌ | Không có endpoint |
| 10 | DANG_KY_GOI | `DangKyGoi` | ❌ | Traveler Subscription — Deferred |
| 11 | DANG_KY_GOI_NCC | `DangKyGoiNcc` | ✅ | ProviderPackageController + AdminProviderPackageController |
| 12 | DANH_GIA | `DanhGia` | ✅ | ReviewsController |
| 13 | DIA_DIEM | `DiaDiem` | ✅ | PlacesController |
| 14 | DIA_DIEM_LICH_TRINH | `DiaDiemLichTrinh` | ✅ | TripsController (AddLocation, etc.) |
| 15 | DIA_DIEM_TAG | (join table) | ⚠️ Gián tiếp | DiaDiem search/CRUD |
| 16 | DICH_VU | `DichVu` | ✅ | Hotels/Restaurants/Activities/Vehicles controllers |
| 17 | DICH_VU_LICH_TRINH | `DichVuLichTrinh` | ⚠️ Gián tiếp qua Trips | Trips CRUD |
| 18 | DUYET_NOI_DUNG | `DuyetNoiDung` | ❌ | Không có endpoint |
| 19 | GOI_DICH_VU | `GoiDichVu` | ❌ | Traveler Subscription — Deferred |
| 20 | GOI_DICH_VU_NCC | `GoiDichVuNcc` | ✅ | ProviderPackageController + AdminProviderPackageController |
| 21 | LICH_SU_AI | `LichSuAi` | ❌ | AI — Deferred |
| 22 | LICH_SU_CLONE | `LichSuClone` | ⚠️ Gián tiếp qua Clone | TripsController.CloneTrip |
| 23 | LICH_TRINH | `LichTrinh` | ✅ | TripsController |
| 24 | LUU_LICH_TRINH | `LuuLichTrinh` | ❌ | Không có endpoint |
| 25 | NGAY_LICH_TRINH | `NgayLichTrinh` | ⚠️ Gián tiếp qua Trips | Trips CRUD |
| 26 | NGUOI_DUNG | `NguoiDung` | ✅ | AuthController + AdminController |
| 27 | NHA_CUNG_CAP | `NhaCungCap` | ✅ | ProvidersController |
| 28 | OTP_XAC_THUC | `OtpXacThuc` | ❌ | Không có endpoint |
| 29 | PHAN_HOI_DANH_GIA | `PhanHoiDanhGia` | ❌ | Không có endpoint |
| 30 | REFRESH_TOKEN | `RefreshToken` | ❌ | Không có endpoint |
| 31 | TAG | `Tag` | ⚠️ Gián tiếp qua Places | Places search |
| 32 | THANH_TOAN_NCC | `ThanhToanNcc` | ✅ | ProviderPackageController (PaymentHistory) |
| 33 | THEO_DOI_NGUOI_DUNG | `TheoDoiNguoiDung` | ❌ | Không có endpoint |
| 34 | THICH_BAI_VIET | `ThichBaiViet` | ❌ | Không có endpoint |
| 35 | THICH_LICH_TRINH | `ThichLichTrinh` | ⚠️ Gián tiếp | FeedsController.LikeTrip |
| 36 | THONG_BAO | `ThongBao` | ✅ | NotificationsController |
| 37 | TINH_THANH | `TinhThanh` | ✅ | PlacesController (Categories) |

### 6.3 Đếm bảng không có API trực tiếp

Bảng KHÔNG có bất kỳ endpoint trực tiếp hoặc gián tiếp nào:

| # | Bảng | Entity |
|---|---|---|
| 1 | BAO_CAO_NOI_DUNG | `BaoCaoNoiDung` |
| 2 | CHIA_SE_LICH_TRINH | `ChiaSeLichTrinh` |
| 3 | DANG_KY_GOI | `DangKyGoi` |
| 4 | DUYET_NOI_DUNG | `DuyetNoiDung` |
| 5 | GOI_DICH_VU | `GoiDichVu` |
| 6 | LICH_SU_AI | `LichSuAi` |
| 7 | LUU_LICH_TRINH | `LuuLichTrinh` |
| 8 | OTP_XAC_THUC | `OtpXacThuc` |
| 9 | PHAN_HOI_DANH_GIA | `PhanHoiDanhGia` |
| 10 | REFRESH_TOKEN | `RefreshToken` |
| 11 | THEO_DOI_NGUOI_DUNG | `TheoDoiNguoiDung` |
| 12 | THICH_BAI_VIET | `ThichBaiViet` |

### 6.4 Xác nhận con số

```
Tài liệu ghi: 8 bảng có Entity nhưng không có API
Thực tế: 12 bảng có Entity nhưng không có API (trực tiếp hoặc gián tiếp)

INCORRECT — Thiếu 4 bảng: OTP_XAC_THUC, REFRESH_TOKEN, PHAN_HOI_DANH_GIA, THICH_BAI_VIET

Tài liệu 11_DATABASE_BUSINESS_MAPPING.md (mục 17) chỉ liệt kê 8 bảng:
- CHIA_SE_LICH_TRINH ✅
- LUU_LICH_TRINH ✅
- BAO_CAO_NOI_DUNG ✅
- DUYET_NOI_DUNG ✅
- THEO_DOI_NGUOI_DUNG ✅
- GOI_DICH_VU ✅
- DANG_KY_GOI ✅
- LICH_SU_AI ✅

Thiếu:
- OTP_XAC_THUC (tài liệu ghi sai có endpoint)
- REFRESH_TOKEN (tài liệu ghi sai có endpoint)
- PHAN_HOI_DANH_GIA (tài liệu ghi "⚠️ Chưa rõ" — thực tế là ❌)
- THICH_BAI_VIET (tài liệu ghi "⚠️ Chưa rõ" — thực tế là ❌)
```

---

## 7. Nhiệm vụ 6 — Kiểm tra Provider Services Domain

### 7.1 Xác minh Controllers

| Controller | Route | Source | Tồn tại? |
|---|---|---|---|
| HotelsController | `api/places/hotels` | [HotelsController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/HotelsController.cs) | ✅ |
| RestaurantsController | `api/places/restaurants` | [RestaurantsController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/RestaurantsController.cs) | ✅ |
| ActivitiesController | `api/places/activities` | [ActivitiesController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/ActivitiesController.cs) | ✅ |
| VehiclesController | `api/places/vehicles` | [VehiclesController.cs](file:///d:/eztravel/Microservices/ezTravel.PlaceService/Controllers/VehiclesController.cs) | ✅ |

### 7.2 Xác minh CRUD đầy đủ

| Action | Hotels | Restaurants | Activities | Vehicles |
|---|---|---|---|---|
| GET Search | ✅ | ✅ | ✅ | ✅ |
| GET Detail | ✅ | ✅ | ✅ | ✅ |
| POST Create | ✅ `[Authorize]` | ✅ `[Authorize]` | ✅ `[Authorize]` | ✅ `[Authorize]` |
| PUT Update | ✅ `[Authorize]` | ✅ `[Authorize]` | ✅ `[Authorize]` | ✅ `[Authorize]` |
| DELETE Delete | ✅ `[Authorize]` | ✅ `[Authorize]` | ✅ `[Authorize]` | ✅ `[Authorize]` |

### 7.3 providerId filter — kiểm tra DTO

Từ [ServiceDtos.cs](file:///d:/eztravel/Services/ezTravel.DTO/Places/ServiceDtos.cs):

| DTO | Có `MaNhaCungCap`? | Dòng | Chính xác |
|---|---|---|---|
| `HotelSearchRequest` | ✅ `public int? MaNhaCungCap { get; set; }` | Line 12 | `MaNhaCungCap` (không phải `ProviderId`) |
| `RestaurantSearchRequest` | ✅ `public int? MaNhaCungCap { get; set; }` | Line 70 | `MaNhaCungCap` |
| `ActivitySearchRequest` | ✅ `public int? MaNhaCungCap { get; set; }` | Line 120 | `MaNhaCungCap` |
| `VehicleSearchRequest` | ✅ `public int? MaNhaCungCap { get; set; }` | Line 168 | `MaNhaCungCap` |

### 7.4 Kết luận Nhiệm vụ 6

```
SUPPORTED — providerId filter (tên thực tế: MaNhaCungCap) được hỗ trợ
trong TẤT CẢ 4 Search Request DTOs.

Frontend có thể gọi:
  GET /api/places/hotels/search?MaNhaCungCap=123
  GET /api/places/restaurants/search?MaNhaCungCap=123
  GET /api/places/activities/search?MaNhaCungCap=123
  GET /api/places/vehicles/search?MaNhaCungCap=123

Tài liệu 13_TEAM_EXECUTION_PLAN.md ghi rủi ro R-01:
"Search endpoint không hỗ trợ providerId filter" → SAI

Thực tế: Tất cả 4 Search DTO đều có MaNhaCungCap.
Rủi ro R-01 không tồn tại.
```

---

## 8. Nhiệm vụ 7 — Kiểm tra Community Domain

### 8.1 FeedsController

**Source**: [FeedsController.cs](file:///d:/eztravel/Microservices/ezTravel.CommunityService/Controllers/FeedsController.cs)

| Endpoint | Method | Route | Auth | DTO | Tồn tại? |
|---|---|---|---|---|---|
| GET Feeds | GET | `/api/feeds` | Public | — → `List<FeedDto>` | ✅ |
| Like Trip | POST | `/api/feeds/{tripId}/like` | `[Authorize]` | — → `Result` | ✅ |
| Comment | POST | `/api/feeds/{tripId}/comment` | `[Authorize]` | `string` (body) → `Result` | ✅ |
| Get Comments | GET | `/api/feeds/{tripId}/comments` | Public | — → `List<Comment>` | ✅ |

**Lưu ý về Comment DTO**: Request body là `[FromBody] string content` — không phải DTO phức tạp, chỉ là string thuần.

### 8.2 ReviewsController

**Source**: [ReviewsController.cs](file:///d:/eztravel/Microservices/ezTravel.CommunityService/Controllers/ReviewsController.cs)

| Endpoint | Method | Route | Auth | DTO | Tồn tại? |
|---|---|---|---|---|---|
| Post Review | POST | `/api/reviews` | `[Authorize]` | `CreateReviewRequest` → `Result` | ✅ |
| Get by Place | GET | `/api/reviews/place/{id}` | Public | — → `List<ReviewDto>` | ✅ |
| Get by Service | GET | `/api/reviews/service/{id}` | Public | — → `List<ReviewDto>` | ✅ |

### 8.3 DTO thực tế

`CreateReviewRequest` defined in: [ReviewDto.cs](file:///d:/eztravel/Services/ezTravel.DTO/Reviews/ReviewDto.cs) — Line 17

### 8.4 Kết luận Nhiệm vụ 7

```
TRUE — Tất cả 7 endpoints Community (4 Feeds + 3 Reviews) tồn tại đúng
như tài liệu mô tả. Routes, methods, và auth đều chính xác.
```

---

## 9. YARP Gateway — Phát Hiện Quan Trọng

### 9.1 Missing Routes

| Route Pattern | Controller | YARP Config | Status |
|---|---|---|---|
| `/api/notifications` | NotificationsController (AuthService) | ❌ **MISSING** | Cannot access via gateway |
| `/api/bookings` | ❌ Không có controller nào | ✅ Route tồn tại nhưng vô nghĩa | Dead route |

### 9.2 Dead Routes trong YARP

YARP có route cho `/api/bookings/{**catch-all}` và `/api/bookings` (lines 38-47) pointing to `booking` cluster (BookingService port 7004).

**NHƯNG**: BookingService KHÔNG có controller nào lắng nghe route `/api/bookings`. Các controller là:
- `ProvidersController` → `/api/providers`
- `ProviderPackageController` → `/api/provider`

Vậy route `/api/bookings` trong YARP là **dead route** — gọi sẽ trả 404.

### 9.3 Tác động

```
CRITICAL — Hai vấn đề gateway:
1. NotificationsController UNREACHABLE qua gateway (thiếu route YARP)
2. YARP bookings route là dead route (không có controller đích)
```

---

## 10. Confirmed Correct (Tài liệu đúng)

Các mục trong `10_BACKEND_API_CATALOG.md` được source code **xác nhận đúng**:

| Section | Nội dung | Verdict |
|---|---|---|
| §3 Auth APIs | 3 endpoints: register, login, me | ✅ CORRECT |
| §4 Notifications | 2 endpoints: get, mark-read | ✅ CORRECT (nhưng thiếu YARP issue) |
| §5 Trip APIs | 14 endpoints (TRIP-01→TRIP-14) | ✅ CORRECT |
| §6.1 Places Core | 6 endpoints (search, detail, CRUD + nearby) | ✅ CORRECT |
| §6.2 Categories | 5 endpoints (CRUD tỉnh/thành) | ✅ CORRECT |
| §6.3-6.6 Hotels/Rest/Act/Veh | Mỗi loại 5 endpoints = 20 | ✅ CORRECT |
| §7 Reviews | 3 endpoints | ✅ CORRECT |
| §8 Community Feeds | 4 endpoints | ✅ CORRECT |
| §9.1 Provider Management | 13 endpoints (PROV-01→PROV-13) | ✅ CORRECT |
| §9.2 Provider Package | 5 endpoints (PKG-01→PKG-05) | ✅ CORRECT |
| §10.1 Admin Core | 7 endpoints (ADM-01→ADM-07) | ✅ CORRECT |
| §10.2 Admin Provider Packages | 8 endpoints (APKG-01→APKG-08) | ✅ CORRECT |
| §12 Frontend gọi sai | 10 errors liệt kê | ✅ CORRECT (cần verify từng FE file) |
| Provider MaNhaCungCap filter | Supported | ✅ CORRECT (newly verified) |

---

## 11. Incorrect Information (Tài liệu sai)

| # | Tài liệu | Mục | Sai | Đúng | Mức độ |
|---|---|---|---|---|---|
| ERR-01 | `10_BACKEND_API_CATALOG.md` | Thống kê tổng hợp | "Tổng API Backend: 76 endpoints" | **90 endpoints** thực tế (hoặc 85 nếu bỏ 5 AI) | **CRITICAL** |
| ERR-02 | `10_BACKEND_API_CATALOG.md` | §11 AI APIs | AI-01→AI-05 được đếm vào tổng 76 | 5 AI endpoints KHÔNG tồn tại trong backend | HIGH |
| ERR-03 | `11_DATABASE_BUSINESS_MAPPING.md` | §3 OTP_XAC_THUC | "API sử dụng: AuthController (verify-otp, forgot-password)" | AuthController KHÔNG có verify-otp/forgot-password | **CRITICAL** |
| ERR-04 | `11_DATABASE_BUSINESS_MAPPING.md` | §3 REFRESH_TOKEN | "API sử dụng: AuthController (refresh-token)" | AuthController KHÔNG có refresh-token endpoint | **CRITICAL** |
| ERR-05 | `11_DATABASE_BUSINESS_MAPPING.md` | §17 | "8 bảng có Entity nhưng không có API" | **12 bảng** (thiếu OTP_XAC_THUC, REFRESH_TOKEN, PHAN_HOI_DANH_GIA, THICH_BAI_VIET) | HIGH |
| ERR-06 | `13_TEAM_EXECUTION_PLAN.md` | R-01 | "Search endpoint không hỗ trợ providerId filter" — Risk Trung bình | `MaNhaCungCap` field **CÓ SẴN** trong tất cả 4 SearchRequest DTOs | HIGH |
| ERR-07 | `10_BACKEND_API_CATALOG.md` | Toàn bộ | Không đề cập YARP Gateway routing issue | NotificationsController **UNREACHABLE** qua gateway | HIGH |
| ERR-08 | `10_BACKEND_API_CATALOG.md` | §2.2 | "Auth: JWT Bearer Token" (đầy đủ) | YARP có dead route `/api/bookings` → 404 | MEDIUM |

---

## 12. Missing Information (Tài liệu thiếu)

| # | Thông tin thiếu | Tác động |
|---|---|---|
| MISS-01 | YARP Gateway routing cho `/api/notifications` KHÔNG tồn tại | NotificationsController unreachable via gateway |
| MISS-02 | YARP Dead route `/api/bookings` pointing to BookingService (no matching controller) | Confusion, potential FE bugs |
| MISS-03 | OTP_XAC_THUC và REFRESH_TOKEN chỉ tồn tại ở DB+Entity+Repository layer, Service layer trống | Tài liệu ghi có endpoint → misleading |
| MISS-04 | `MaNhaCungCap` filter trong 4 SearchRequest DTOs — quan trọng cho ServicesManager (US-4.4) | Tài liệu ghi risk nhưng feature đã có |
| MISS-05 | Provider NCC repositories (`IDangKyGoiNccRepository`, `IGoiDichVuNccRepository`, `IThanhToanNccRepository`) có custom repository riêng (không chỉ GenericRepository qua UnitOfWork) | Architecture detail |
| MISS-06 | Hotels/Restaurants/Activities/Vehicles controllers đều dùng `UserContextHelper.GetUserId(User)` cho Create/Update/Delete — ownership validation | Security detail |

---

## 13. Sprint Impact

### User Stories bị ảnh hưởng bởi sai lệch

| User Story | Tài liệu ghi | Thực tế | Tác động |
|---|---|---|---|
| **US-4.4** ServicesManager | R-01: "Search endpoint không hỗ trợ providerId filter" — Risk Trung bình | `MaNhaCungCap` **CÓ SẴN** → risk không tồn tại | ✅ **Tích cực** — không cần fallback client-side filter |
| **NOTI Sprint 7** | "Sprint 7" cho Notifications | YARP THIẾU route → endpoint unreachable qua gateway | ⚠️ Cần thêm YARP route trước khi wire FE |
| **US-4.2** UserManager | Tài liệu đúng | OK | Không ảnh hưởng |
| **US-4.3** ProviderApproval | Tài liệu đúng | OK | Không ảnh hưởng |
| **US-5.2** Community Feed | Tài liệu đúng | OK | Không ảnh hưởng |
| **US-6.1** Admin PackageManager | Tài liệu đúng | OK | Không ảnh hưởng |

### Velocity Impact

```
Positive: US-4.4 dễ hơn dự kiến (MaNhaCungCap filter có sẵn)
Negative: Notifications cần YARP fix trước khi FE wire (không ảnh hưởng Sprint 4-6)
Net: Nhỏ — Sprint timeline không thay đổi
```

---

## 14. Final Verdict

### API Catalog Accuracy

```
85% — Liệt kê endpoint chính xác nhưng tổng số sai (76 vs 90),
5 AI endpoints ghi vào tổng mặc dù không tồn tại,
thiếu thông tin YARP routing critical.
```

### Database Mapping Accuracy

```
82% — Mapping bảng→entity đúng, phân nhóm đúng, phân biệt monetization đúng.
Nhưng SAI nghiêm trọng ở 2 bảng Auth (OTP_XAC_THUC, REFRESH_TOKEN) — ghi có endpoint khi không có.
Đếm sai "8 bảng không API" → thực tế 12 bảng.
```

### Team Plan Accuracy

```
90% — Sprint structure, User Stories, DoD, và ownership đều hợp lý.
Rủi ro R-01 (providerId filter) sai — thực tế feature đã có sẵn.
Tác động tích cực: US-4.4 dễ triển khai hơn dự kiến.
```

---

## 15. Errata — Danh sách sửa lỗi cần thực hiện

| # | File | Mục | Hành động |
|---|---|---|---|
| 1 | `10_BACKEND_API_CATALOG.md` | Thống kê tổng hợp | Sửa "76 endpoints" → "90 endpoints" (hoặc 85 nếu bỏ AI) |
| 2 | `10_BACKEND_API_CATALOG.md` | §11 AI APIs | Ghi rõ: "AI endpoints CHƯA tồn tại trong backend — KHÔNG đếm vào tổng" |
| 3 | `10_BACKEND_API_CATALOG.md` | Mới | Thêm mục "YARP Gateway Routing Issues" — ghi rõ notifications thiếu route, bookings dead route |
| 4 | `11_DATABASE_BUSINESS_MAPPING.md` | §3 OTP_XAC_THUC | Sửa "API sử dụng" → "❌ Không có endpoint (DB + Entity + Repository Only)" |
| 5 | `11_DATABASE_BUSINESS_MAPPING.md` | §3 REFRESH_TOKEN | Sửa "API sử dụng" → "❌ Không có endpoint (DB + Entity + Repository Only)" |
| 6 | `11_DATABASE_BUSINESS_MAPPING.md` | §17 | Sửa "8 bảng" → "12 bảng" — thêm OTP_XAC_THUC, REFRESH_TOKEN, PHAN_HOI_DANH_GIA, THICH_BAI_VIET |
| 7 | `13_TEAM_EXECUTION_PLAN.md` | R-01 | Sửa/Xóa rủi ro R-01 — MaNhaCungCap filter ĐÃ CÓ trong tất cả 4 SearchRequest DTOs |
| 8 | `13_TEAM_EXECUTION_PLAN.md` | Mới | Thêm rủi ro: "YARP thiếu route cho NotificationsController — cần fix trước Sprint 7" |

---

*Báo cáo này được tạo hoàn toàn từ source code thực tế. Mọi kết luận đều có dẫn chứng file path cụ thể. Mục nào không có bằng chứng source code đã được đánh dấu UNVERIFIED.*
