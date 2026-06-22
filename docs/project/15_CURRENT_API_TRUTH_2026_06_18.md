# 15 - CURRENT API TRUTH 2026-06-18

**Ngay lap**: 2026-06-18  
**Cap nhat gan nhat**: 2026-06-21  
**Pham vi**: Current backend controllers, YARP gateway, frontend API usage  
**Muc tieu**: Dong bang API truth hien tai de tiep tuc Phase 2 ma khong dua vao tai lieu cu da drift.

---

## 1. Executive Summary

He thong hien tai co **84 controller actions** duoc dem tu source code trong `Microservices/*/Controllers` sau Phase 2X.

Dieu nay **khong co nghia la moi API da production-ready**. Mot so action van la simulated flow, can migration/runtime verification, hoac chua co active UI.

- object rong `{ }`
- list rong `[]`
- ket qua `success = true` gia lap
- chuoi `"mock"`
- sample data hardcoded

Phan API thuc su dang dung duoc o muc co du lieu/logic that chu yeu la:

| Khu vuc | Trang thai thuc te |
|---|---|
| Auth login/register/OTP/reset | Phase 2H DB-backed login/register, OTP verify/resend, forgot/reset password; dev OTP returned until email provider exists |
| Place regions/destination detail | Co doc DB qua `PlaceService` |
| Hotel/Restaurant/Activity/Vehicle services | Service classes co logic, nhung current controller/YARP khong expose cac route `/places/{category}` cu |
| Trip core/list/detail/timeline/collaborators/dashboard | DB-backed; Phase 2V hydrates planner deep-links from route/API and replaces list graph loading with indexed summary queries |
| Explore/Home/service detail | Phase 2D DB-backed APIs; Phase 2N wires destination/service detail/reviews; Phase 2T wires Home destination/trip/community/blog sections to current public APIs |
| Profile/Traveler subscription | Phase 2A DB-backed profile; Phase 2O active profile UI; Phase 2S active subscription/expiry fields and `/upgrade` flow |
| Notifications | Phase 2K DB-backed list/read via `THONG_BAO`; realtime/push chua co |
| AI | Phase 2L DB-aware heuristic services, no hardcoded `"mock"` responses; external LLM provider deferred |
| Community/Blog/Admin/Provider | Provider verification passed full Gateway/DB/storage acceptance in Phase 2V; Phase 2W Admin provider-package catalog and Phase 2X trip comments are DB-backed and active |

Ket luan: backend **build duoc va route da duoc mo rong**, nhung runtime/API contract chua sach. Khong nen tiep tuc build UI moi truoc khi sua cac mismatch trong muc 4 va muc 5.

---

## 2. Source Of Truth

Source duoc dung trong Phase 0:

- `Microservices/ezTravel.AuthService/Controllers/*.cs`
- `Microservices/ezTravel.TripService/Controllers/*.cs`
- `Microservices/ezTravel.PlaceService/Controllers/*.cs`
- `Microservices/ezTravel.BookingService/Controllers/*.cs`
- `Microservices/ezTravel.CommunityService/Controllers/*.cs`
- `Microservices/ezTravel.AdminService/Controllers/*.cs`
- `Microservices/ezTravel.ApiGateway/yarp.json`
- `Services/ezTravel.Services/**/*.cs`
- `WebClient/src/api/**/*.ts`
- `WebClient/src/store/apis/**/*.ts`
- `WebClient/src/router/index.jsx`
- `WebClient/src/router/routes.js`

Tai lieu cu **khong con la active truth**:

- `docs/project/API_TRUTH_REPORT.md`
- `docs/project/10_BACKEND_API_CATALOG.md`
- `docs/project/SPRINT6_API_MAPPING.md`

Ly do: cac tai lieu nay noi dung da lech so voi controller hien tai, vi du `GET /api/auth/me`, `POST /api/notifications/{id}/read`, `/api/trips/{id}/reorder`, `/api/places/*`, AI "chua ton tai", trong khi source hien tai da thay doi.

---

## 3. Controller Endpoint Inventory

Legend:

| Label | Y nghia |
|---|---|
| Real-ish | Co doc/ghi DB hoac logic nghiep vu dang ke |
| Stub | Tra object/list rong hoac success gia lap |
| Mock | Tra data gia lap hoac chuoi `"mock"` |
| Sample | Tra sample hardcoded de UI khong crash |
| Gateway risk | Controller co action nhung YARP route sai/missing |

### 3.1 AuthService

#### AuthController - `api/auth`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| POST | `/api/auth/login` | Public | Real-ish, DB/JWT/BCrypt, blocks pending/banned/inactive users | Active: `store/apis/authApi.ts` |
| POST | `/api/auth/register` | Public | Real-ish, creates `PENDING_VERIFICATION` user and OTP row | Active: `store/apis/authApi.ts` |
| POST | `/api/auth/verify-otp` | Public | Real-ish DB OTP validation, activation/reset handoff | Active auth page |
| POST | `/api/auth/resend-otp` | Public | Real-ish DB OTP regeneration | Active auth page |
| POST | `/api/auth/forgot-password` | Public | Real-ish DB reset OTP generation | Active auth page |
| POST | `/api/auth/reset-password` | Public | Real-ish DB OTP validation + BCrypt password update | Active auth page |

Important drift:

- Current backend **khong co** `GET /api/auth/me`.
- Quarantined `WebClient/src/api_legacy/authApi.ts.txt` records the old `/auth/me`; active app uses `/profile`.

#### ProfileController - `api/profile`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/profile` | JWT | Real-ish DB read from `NguoiDung`, includes provider and active Traveler subscription/expiry info | Active hydration and `/profile` page |
| PUT | `/api/profile` | JWT | Real-ish DB update for name/phone | Active `/profile` form after Phase 2O |
| PUT | `/api/profile/password` | JWT | Real-ish BCrypt verify/hash and DB update | Active password form after Phase 2O |
| POST | `/api/profile/avatar` | JWT | Real-ish avatar URL DB update | Active avatar form after Phase 2O |

Status:

- Phase 2A replaced the previous empty-object profile stub.
- The response intentionally includes both Vietnamese DB-style fields and frontend-friendly fields such as `id`, `fullName`, `role`, `providerId`, and `providerStatus`.

#### NotificationController - `api/notifications`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/notifications` | JWT | Real-ish DB list from `THONG_BAO` for current user | Active header dropdown and `/notifications` page |
| PUT | `/api/notifications/{id}/read` | JWT | Real-ish ownership-checked mark-read | Active header dropdown and `/notifications` page |

Important drift:

- Old docs mention `POST /api/notifications/{id}/read`.
- Current source is **PUT**.

### 3.2 TripService

#### TripController - `api/trips`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/trips` | JWT | DB owner/shared list with separate indexed access queries plus cost/place aggregates | Active `plannerApi` |
| POST | `/api/trips` | JWT | Real-ish DB create, creates initial days | Active `plannerApi` |
| DELETE | `/api/trips/{id}` | JWT | Real-ish soft archive with `ARCHIVED` | Active list |
| GET | `/api/trips/{id}` | AllowAnonymous | Real-ish DB detail for owner/shared/public trips | Active detail/planner |
| GET | `/api/trips/{id}/timeline` | AllowAnonymous | Real-ish DB days/items graph for owner/shared/public trips | Active `plannerApi` |
| PUT | `/api/trips/{id}/timeline` | JWT | Real-ish replace timeline days/items in DB for owner or `EDITOR` collaborator | Active `plannerApi` |
| POST | `/api/trips/{id}/clone` | JWT | Real-ish graph clone + `LICH_SU_CLONE` | Active community API |
| GET | `/api/trips/upcoming` | JWT | Real-ish DB upcoming owner/shared trips | Active `/dashboard` and `plannerApi` after Phase 2P |
| GET | `/api/traveler/dashboard/stats` | JWT | Real-ish DB counts for owner/shared trips, public trips, saved trips | Active `/dashboard` and `plannerApi` after Phase 2P |

Important drift:

- Current backend **khong co** `PUT /api/trips/{id}`.
- Current backend **khong co** `PUT /api/trips/{id}/reorder`.
- Current backend **khong co** `POST /api/trips/{id}/locations`.
- Current backend **khong co** `DELETE /api/trips/{id}/items/{itemId}`.
- Quarantined `WebClient/src/api_legacy/tripApi.ts.txt` records those old endpoints and is not compiled/imported.
- Phase 2C chose `/api/trips/{id}/timeline` as the active write contract instead of restoring all legacy item endpoints.
- `POST /api/trips` accepts frontend aliases `title`, `startDate`, `endDate`, `visibility`, `budget` in addition to Vietnamese DTO fields.

#### TripCollaboratorController - `api/trips/{id}/collaborators`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/trips/{id}/collaborators` | JWT | Real-ish DB owner + shared users from `CHIA_SE_LICH_TRINH` | Active `plannerApi` |
| POST | `/api/trips/{id}/collaborators` | JWT | Real-ish add/update/remove `VIEW`/`EDITOR` collaborators, owner-only management | Active `plannerApi` |

#### AIController - `api/ai`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| POST | `/api/ai/generate` | JWT | Real-ish DB-aware itinerary preview from `DIA_DIEM`/`DICH_VU`, writes `LICH_SU_AI` | Active AI Planner |
| POST | `/api/ai/chat` | JWT | Real-ish DB-aware assistant reply from destinations/services, writes `LICH_SU_AI` | Active AI Chat |
| POST | `/api/ai/optimize-route` | JWT | Real-ish DB-backed route order from trip timeline, writes `LICH_SU_AI` | Active AI route panel |
| POST | `/api/ai/analyze-budget` | JWT | Real-ish DB-backed trip budget analysis, writes `LICH_SU_AI` | Active AI budget panel |

Important drift:

- Old docs said AI endpoints were missing. Current source has them; Phase 2L replaced hardcoded mock responses with DB-aware heuristic services. External LLM integration is still deferred.

### 3.3 PlaceService

#### ExploreController

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/categories/regions` | Public | Real-ish via `PlaceService.GetTinhThanhsAsync` | Active explore filters |
| GET | `/api/categories/tags` | Public | Real-ish DB `TAG` list | Active hook exists |
| GET | `/api/explore` | Public | Real-ish DB explore grid when `type=places/services`; empty params returns promoted provider data for badge checks | Active `store/apis/exploreApi.ts` |
| GET | `/api/destinations/{id}` | Public | Real-ish via `PlaceService.GetPlaceByIdAsync` | Active destination detail page after Phase 2N |
| GET | `/api/destinations/{id}/services` | Public | Real-ish active `DICH_VU` list for destination | Active destination detail service list after Phase 2N |
| GET | `/api/public/home/trending-destinations` | Public | Real-ish top `DIA_DIEM` list with Home compatibility aliases | Active destination cards on Home after Phase 2T |

Important drift:

- Current source **khong co** controller cho `/api/places/search` hoac `/api/places/{category}/search`.
- Legacy frontend explore/provider services van goi `/places/search` va `/places/{category}/search`.

#### ServiceController - `api/services`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/services/{id}` | Public | Real-ish DB service detail, increments view count | Active service detail page after Phase 2N |
| GET | `/api/services/{id}/reviews` | Public | Real-ish DB reviews from `DANH_GIA` | Active service detail review list after Phase 2N |
| POST | `/api/services/{id}/reviews` | JWT | Real-ish creates `DANH_GIA` and updates service rating/count | Active authenticated review form after Phase 2N |

### 3.4 BookingService

#### TravelerPackageController - `api/packages/traveler`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/packages/traveler` | JWT | DB-backed active `GOI_DICH_VU` catalog | Active `/upgrade` after Phase 2S |
| GET | `/api/packages/traveler/current` | JWT | DB-backed current non-expired `DANG_KY_GOI` | Active `/upgrade` after Phase 2S |
| GET | `/api/packages/traveler/history` | JWT | DB-backed latest Traveler subscription history | Active `/upgrade` after Phase 2S |
| POST | `/api/packages/traveler/subscribe-simulated` | JWT Traveler | Expires old active rows, creates real `DANG_KY_GOI`, updates role; no real payment | Active `/upgrade` after Phase 2S |

#### ProviderController - `api`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| POST | `/api/provider/register` | JWT | Creates pending provider with legal/contact metadata | Active `/provider/registration` after Phase 2U |
| POST | `/api/provider/upload-docs` | JWT pending/rejected provider | Multipart PDF/JPG/PNG storage + `HO_SO_XAC_MINH_NCC` metadata; replaces current type | Active `/provider/pending` after Phase 2U |
| GET | `/api/provider/documents/{id}/download` | JWT owner/Admin | Streams non-public stored file after ownership/role check | Active Provider/Admin document download after Phase 2U |
| GET | `/api/provider/status` | JWT | Reads provider plus current document metadata | Active provider guards and `/provider/pending` after Phase 2U |
| GET | `/api/provider/stats` | JWT | Real-ish service counts/rating/views from `DichVu` | Active store provider API |
| GET | `/api/provider/services` | JWT | Real-ish DB list, supports `category` and `keyword` query | Active store provider API |
| POST | `/api/provider/services` | JWT | Real-ish creates provider-owned `DichVu` | Active service create route and store API after Phase 2Q |
| PUT | `/api/provider/services/{id}` | JWT | Real-ish ownership-checked `DichVu` update | Active service edit route and store API after Phase 2Q |
| DELETE | `/api/provider/services/{id}` | JWT | Real-ish ownership-checked soft-delete (`TrangThai = DELETED`) | Active service manager delete |
| GET | `/api/provider/reviews` | JWT | Real-ish provider-owned service reviews | Active provider reviews |
| POST | `/api/provider/reviews/{id}/reply` | JWT | Real-ish creates/updates `PhanHoiDanhGia` | Active store provider API |
| GET | `/api/packages/provider` | JWT | Real-ish DB active `GOI_DICH_VU_NCC` list, marks current package | Active provider packages |
| GET | `/api/provider/packages/current` | JWT | Real-ish current active `DANG_KY_GOI_NCC` package | Active provider current package |
| GET | `/api/provider/packages/history` | JWT | Real-ish provider package history from `DANG_KY_GOI_NCC` | Active provider package history |
| GET | `/api/provider/packages/payments` | JWT | Real-ish payment history from `THANH_TOAN_NCC` | Active provider payment history |
| POST | `/api/provider/packages/subscribe-simulated` | JWT | Real-ish demo payment flow; writes registration/payment/current package | Active provider packages |

Count note:

- ProviderController has 16 rows above after the document download action. The total current controller action count is 84 across all services after Phase 2X.

Important drift:

- Current backend **khong co** `/api/providers/user/{userId}/dashboard`.
- Current backend **khong co** `/api/provider/analytics`.
- YARP still has `/api/providers/*`, but source controller uses `/api/provider/*` singular.
- Phase 2B changed provider service create/update/reply failures to return `400 BadRequest` via `ProviderServiceError`.
- Phase 2I changed provider package failures to return real HTTP status codes via `NccPackageServiceError`.
- Phase 2J added provider service soft-delete and `ProviderServiceError.StatusCode` HTTP mapping.

### 3.5 CommunityService

#### CommunityController

| Method | Path | Auth | Service state | Gateway | Frontend state |
|---|---|---|---|---|---|
| GET | `/api/community/feed` | Public | Real-ish DB public trip feed | OK | Active community page |
| POST | `/api/trips/{id}/like` | JWT | Real-ish toggles `THICH_LICH_TRINH` and syncs trip like count | OK via specific YARP route | Active feed card |
| GET | `/api/public/home/trending-trips` | Public | Real-ish DB public trips sorted by likes/clones/views | OK via specific YARP route | Active store hook |
| GET | `/api/community/top-bloggers` | Public | Real-ish ranks published blog authors by post/follower/like counts | OK | Active hook exists |
| POST | `/api/users/{id}/follow` | JWT | Real-ish toggles `THEO_DOI_NGUOI_DUNG` | OK via specific YARP route | Active hook exists |

#### TripCommentController - `api/trips/{tripId}/comments`

| Method | Path | Auth | Service state | Gateway | Frontend state |
|---|---|---|---|---|---|
| GET | `/api/trips/{id}/comments` | JWT | DB-backed active `BINH_LUAN_LICH_TRINH` list with author/ownership mapping and Trip access check | OK via higher-priority Community route | Active TripDetails after Phase 2X |
| POST | `/api/trips/{id}/comments` | JWT | Validates user/content/access and persists `BINH_LUAN_LICH_TRINH` | OK via higher-priority Community route | Active TripDetails form after Phase 2X |

Important:

- Phase 1 added specific YARP routes for like/trending-trips/follow so these actions are reachable through the gateway.
- Phase 2E replaced the previous empty/stub community implementation with DB-backed feed/trending/like/follow/top-bloggers logic.

#### BlogController - `api/blogs`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/blogs` | Public | Real-ish published `BAI_VIET` list | Active `/community/blogs` and latest Home section after Phase 2T |
| GET | `/api/blogs/{id}` | Public | Real-ish published blog detail and increments views | Active `/community/blogs/{id}` page after Phase 2M |
| POST | `/api/blogs` | JWT | Real-ish creates published `BAI_VIET` and thumbnail image metadata | Active `/community/blogs/create` page after Phase 2M |
| GET | `/api/blogs/{id}/comments` | Public | Real-ish `BINH_LUAN_BAI_VIET` list | Active blog detail/comments UI |
| POST | `/api/blogs/{id}/comments` | JWT | Real-ish creates `BINH_LUAN_BAI_VIET` | Active blog detail/comments UI |

### 3.6 AdminService

#### AdminController - `api/admin`

| Method | Path | Auth | Service state | Frontend state |
|---|---|---|---|---|
| GET | `/api/admin/users` | ADMIN | Real-ish DB `NGUOI_DUNG` list with provider metadata | Active admin users |
| PUT | `/api/admin/users/{id}/status` | ADMIN | Real-ish updates `NGUOI_DUNG.trang_thai`; frontend `LOCKED` persists as `BANNED` | Active hook, caller fixed in Phase 1 |
| PUT | `/api/admin/users/{id}/role` | ADMIN | Real-ish validates and updates `NGUOI_DUNG.vai_tro` | Hook exists |
| GET | `/api/admin/stats` | ADMIN | Real-ish DB counts for users/trips/providers/services/blogs/reports/reviews/packages/revenue | Active admin dashboard |
| GET | `/api/admin/alerts` | ADMIN | Real-ish pending reports/providers/reviews and locked user counts | Hook exists |
| GET | `/api/admin/providers/pending` | ADMIN | Pending providers with legal and current document metadata | Active provider document review after Phase 2U |
| PUT | `/api/admin/providers/{id}/status` | ADMIN | Requires a document to approve; updates provider/user/document statuses | Active approval after Phase 2U |
| GET | `/api/admin/provider-packages` | ADMIN | Reads active and inactive `GOI_DICH_VU_NCC` catalog rows | Active `/admin/provider-packages` after Phase 2W |
| POST | `/api/admin/provider-packages` | ADMIN | Validates and creates an active catalog row | Active create UI after Phase 2W |
| PUT | `/api/admin/provider-packages/{id}` | ADMIN | Validates duplicate/name/price/coefficient rules and updates the catalog row | Active edit UI after Phase 2W |
| PUT | `/api/admin/provider-packages/{id}/status` | ADMIN | Activates/deactivates without deleting subscription history | Active status UI after Phase 2W |
| GET | `/api/admin/moderation` | ADMIN | Real-ish pending `BAO_CAO_NOI_DUNG` queue | Active moderation |
| POST | `/api/admin/moderation/{id}/resolve` | ADMIN | Real-ish updates report and writes `DUYET_NOI_DUNG` audit row | Active moderation |
| GET | `/api/admin/categories` | ADMIN | Real-ish `TAG` list | Active categories |
| POST | `/api/admin/categories` | ADMIN | Real-ish creates `TAG` | Active categories |
| DELETE | `/api/admin/categories/{id}` | ADMIN | Real-ish deletes unused `TAG`, rejects tags attached to places | Active categories |

Frontend caller status:

- Phase 1 changed `WebClient/src/modules/admin/UserManager.jsx` to call `lockUser({ id, body })`.
- Phase 2F replaced the previous Admin service stubs with DB-backed logic and HTTP error mapping.

---

## 4. YARP Gateway Truth

Frontend dev server proxies `/api` to `http://localhost:5000`, so `Microservices/ezTravel.ApiGateway/yarp.json` matters for local runtime.

### 4.1 Route prefixes backed by current controllers

| Prefix | Cluster | Current source coverage |
|---|---|---|
| `/api/auth/*` | auth | OK |
| `/api/profile/*` | auth | OK |
| `/api/notifications/*` | auth | OK |
| `/api/explore/*` | place | OK |
| `/api/destinations/*` | place | OK |
| `/api/categories/*` | place | OK |
| `/api/public/*` | place/community | OK with specific community override for `/api/public/home/trending-trips` |
| `/api/services/*` | place | OK |
| `/api/ai/*` | trip | OK |
| `/api/traveler/*` | trip | OK |
| `/api/trips/*` | trip/community | OK with specific community override for `/api/trips/{id}/like` |
| `/api/blogs/*` | community | OK |
| `/api/community/*` | community | OK |
| `/api/users/{id}/follow` | community | OK via specific route |
| `/api/packages/*` | booking | OK |
| `/api/provider/*` | booking | OK |
| `/api/admin/*` | admin | OK |

### 4.2 Gateway routes that look legacy or currently unbacked

| Gateway prefix | Cluster | Problem |
|---|---|---|
| `/api/bookings/*` | booking | No current controller found |
| `/api/providers/*` | booking | No current controller found; current source uses singular `/api/provider/*` |
| `/api/places/*` | place | No current controller found for `/places/search` or `/places/{category}` |
| `/api/reviews/*` | community | No current controller found |
| `/api/feeds/*` | community | No current controller found |
| `/api/trips/metadata/*` | trip | No current controller action found |
| `/api/trips/recommendations` | trip | No current controller action found |

### 4.3 Controller actions that gateway likely cannot reach

No active frontend-used controller action is currently known to be unreachable through YARP after Phase 1.

Remaining legacy YARP prefixes are listed in section 4.2 and should be removed or backed by controllers in a later docs/backend cleanup phase.

---

## 5. Frontend Endpoint Fit

### 5.1 Mostly aligned with current source

| Frontend module | Endpoint group | Verdict |
|---|---|---|
| `store/apis/authApi.ts` | `/auth/*`, `/profile/*` | Route-aligned; OTP/reset DB-backed after Phase 2H and active profile UI after Phase 2O |
| `store/apis/plannerApi.ts` | `/trips`, `/trips/{id}`, `/timeline`, `/collaborators`, `/traveler/dashboard/stats` | Route-aligned; trip core/collaborators DB-backed, trip-create active after Phase 2O, dashboard stats/upcoming active after Phase 2P |
| `store/apis/exploreApi.ts` | `/categories`, `/explore`, `/destinations`, `/services`, `/public/home/*` | Route-aligned; core DB-backed after Phase 2D, active destination/service detail and review cache flow after Phase 2N |
| `store/apis/communityApi.ts` | `/community`, `/blogs`, `/notifications`, `/trips/{id}/like`, `/trips/{id}/comments`, `/users/{id}/follow` | Route-aligned; community/blog DB-backed after Phase 2E, notifications after Phase 2K, blog UI after Phase 2M, and Trip comments after Phase 2X |
| `store/apis/adminApi.ts` | `/admin/*` | Route-aligned; moderation/categories/provider approval active after Phase 2R; provider-package list/create/update/status active with Provider cache invalidation after Phase 2W |
| `store/apis/providerApi.ts` | `/provider/*`, `/packages/provider`, `/provider/packages/current|history|payments` | Route-aligned; registration/status and provider package flows are active with cache tags after Phase 2Q |
| `store/apis/travelerPackageApi.ts` | `/packages/traveler/*` | Route-aligned; catalog/current/history/subscribe and User/Subscription invalidation active after Phase 2S |
| `api/aiApi.ts` | `/ai/*` | Route-aligned, DB-aware non-mock after Phase 2L |

### 5.2 Quarantined frontend modules

| Historical module | Reason quarantined |
|---|---|
| `WebClient/src/api_legacy/exploreApi.ts.txt` | `/places/search`, `/places/{category}/search` do not exist in current backend |
| `WebClient/src/store/apis/serviceApi.ts` | Active list/create/edit/delete routes use `/provider/services`; Phase 2Q adds all-category edit lookup and Provider/Service cache invalidation |
| `WebClient/src/api_legacy/tripApi.ts.txt` | Old item-level mutation paths conflict with active timeline contract |
| `WebClient/src/api_legacy/providerApi.ts.txt` | Old dashboard/place/analytics paths are absent |
| `WebClient/src/api_legacy/authApi.ts.txt` | Old `/auth/me` is absent; `/profile` is active |

---

## 6. Differences From Old Docs

| Old claim | Current truth |
|---|---|
| `GET /api/auth/me` exists | It does not exist in current `AuthController` |
| Notification read uses POST | Current source uses `PUT /api/notifications/{id}/read` |
| AI endpoints do not exist | AI endpoints exist and return DB-aware non-mock values after Phase 2L |
| `/api/trips/{id}/reorder` exists | No current controller action |
| `/api/trips/{id}/locations` exists | No current controller action |
| `/api/places/*` category APIs exist | No current controller route found |
| `/api/providers/*` is provider API | Current controller uses singular `/api/provider/*` |

---

## 7. Post Phase 2X Backend/API Cleanup Status

Da xong trong source qua Phase 1 + Phase 2B-2U:

- Fix YARP routing for community cross-domain paths:
   - `POST /api/trips/{id}/like`
   - `GET /api/public/home/trending-trips`
   - `POST /api/users/{id}/follow`
- Migrate active provider services UI to `/api/provider/services`.
- Implement provider service/status/stats/reviews/register DB logic in `IProviderService.cs`.
- `GET /api/provider/services` now accepts `category`/`keyword` query in `ProviderController`.
- DTO request warnings in `Requests.cs` cleaned; latest backend build has 0 warnings.
- Replace trip sample/stub service with DB-backed logic in `ITripService.cs`.
- `GET/POST/DELETE /api/trips`, `GET/PUT /api/trips/{id}/timeline`, `POST /api/trips/{id}/clone`, `GET /api/trips/upcoming`, and `GET /api/traveler/dashboard/stats` now use DB state.
- Trip create request now accepts frontend aliases and timeline update request accepts `Days`.
- `TripController` now maps service errors to HTTP status codes instead of returning all service failures as `200 OK`.
- Replace empty/stub Explore/Home/service-detail flows:
  - `GET /api/categories/tags`
  - `GET /api/explore`
  - `GET /api/destinations/{id}/services`
  - `GET /api/public/home/trending-destinations`
  - `GET/POST /api/services/{id}/reviews`
  - `GET /api/services/{id}`
- `PlaceSearchRequest` now accepts current frontend filters: `type`, `province`, `serviceCategory`, `rating`, `budgetMin`, `budgetMax`.
- Replace empty/stub Community/Blog flows:
  - `GET /api/community/feed`
  - `POST /api/trips/{id}/like`
  - `GET /api/public/home/trending-trips`
  - `GET /api/community/top-bloggers`
  - `POST /api/users/{id}/follow`
  - `GET/POST /api/blogs`
  - `GET/POST /api/blogs/{id}/comments`
- `CreateBlogRequest` now accepts optional `summary`, `thumbnail`, `imageUrl`, `placeId`, and `maDiaDiem`.
- `FeedCard.jsx` now sends the correct `createBlogComment({ id, body })` mutation shape.
- Replace Admin core stubs:
  - `GET /api/admin/users`
  - `PUT /api/admin/users/{id}/status`
  - `PUT /api/admin/users/{id}/role`
  - `GET /api/admin/stats`
  - `GET /api/admin/alerts`
  - `GET/POST/DELETE /api/admin/categories`
  - `GET /api/admin/moderation`
  - `POST /api/admin/moderation/{id}/resolve`
- `AppDbContext.OnConfiguring` no longer emits the scaffolded connection-string warning; runtime DI configuration remains the normal path.
- Replace trip collaborator stubs:
  - `GET /api/trips/{id}/collaborators`
  - `POST /api/trips/{id}/collaborators`
- `CHIA_SE_LICH_TRINH` now backs collaborator list/add/update/remove.
- Trip shared access now applies to trip list/detail/timeline/upcoming/dashboard, with timeline writes limited to owner or `EDITOR` collaborators.
- Replace Auth OTP/reset stubs:
  - `POST /api/auth/verify-otp`
  - `POST /api/auth/resend-otp`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
- Registration now creates `PENDING_VERIFICATION` users and real `OTP_XAC_THUC` rows.
- Forgot/reset password now uses `OTP_XAC_THUC` and BCrypt password update.
- Auth UI now displays `devOtp` and routes reset verification into reset-password form.
- Replace Provider package stubs:
  - `GET /api/packages/provider`
  - `GET /api/provider/packages/current`
  - `GET /api/provider/packages/history`
  - `GET /api/provider/packages/payments`
  - `POST /api/provider/packages/subscribe-simulated`
- Provider package subscribe now writes `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`, and updates `NHA_CUNG_CAP.ma_goi_ncc_hien_tai`.
- Provider package UI now exposes active routes for packages/current/history/payments and uses real store hooks.
- Add provider service soft-delete:
  - `DELETE /api/provider/services/{id}`
- Provider service delete now enforces current-provider ownership, sets `DICH_VU.trang_thai = DELETED`, and active UI calls it through `ServicesManager.jsx`.
- Replace Notification stubs:
  - `GET /api/notifications`
  - `PUT /api/notifications/{id}/read`
- Notification list/read now uses `THONG_BAO`, enforces current-user ownership for mark-read, and active UI calls it from header dropdown and `/notifications`.
- Replace AI hardcoded mock responses:
  - `POST /api/ai/generate`
  - `POST /api/ai/chat`
  - `POST /api/ai/optimize-route`
  - `POST /api/ai/analyze-budget`
- AI services now read DB data where applicable, write `LICH_SU_AI`, and AI Planner accept flow creates real trips/timelines.
- Active blog list/detail/create pages now use `store/apis/communityApi.ts` against DB-backed blog endpoints.
- Blog detail loads/posts real comments, and blog create/comment mutations invalidate blog caches.
- Active destination/service detail pages now use DB-backed detail, destination-services, and review endpoints.
- Service review submit invalidates service/review caches, and Explore grid cards link to real detail routes.
- Active `/profile` page now uses DB-backed profile/update/password/avatar endpoints with user cache invalidation.
- Active `/trips/create` now creates a real trip and redirects to its planner; trip mutations invalidate list/detail/timeline caches.
- Active `/dashboard` now uses DB-backed Traveler stats, upcoming trips, and notifications with loading/error/empty states.
- Active provider registration/pending pages now use DB-backed register/status flows and provider-aware guards.
- Active provider service create/edit pages now use current service mutations, real place search, and cache invalidation.
- Obsolete legacy provider service form/modal files were removed.
- Admin provider approval/rejection now persists provider status, admin audit fields, approval date, and related user role.
- Active admin moderation and categories pages now use current DB-backed APIs; admin sidebar exposes both routes.
- Provider approve/reject state transitions have focused unit coverage.
- Traveler package catalog/current/history and simulated subscribe now use `GOI_DICH_VU`/`DANG_KY_GOI`.
- Active subscription state now participates in profile hydration and frontend Premium permission resolution.
- Active `/upgrade` uses current subscription APIs and focused subscribe tests cover success/role rejection.
- Active Home now consumes trending destinations, trending trips, community feed, and published blogs through verified store APIs; no section-level business placeholders remain.
- Provider verification upload is no longer mock: multipart files use validated local storage and `HO_SO_XAC_MINH_NCC` metadata.
- Provider/Admin active UI supports upload, replacement, status, authenticated download, document-required approval, and rejected-provider resubmission.
- Provider approval now writes schema-valid `APPROVED` instead of drifted `ACTIVE`.
- Full-stack Provider registration/upload/download/pending/approval/status flow passed through Gateway against isolated LocalDB and physical BookingService storage.
- `/api/trips` now loads base owner/shared rows separately and computes cost/place summaries with focused aggregate queries instead of loading the full trip graph.
- `/trips/:id/planner` now initializes from the route id and real trip detail response instead of requiring pre-existing Redux state.
- Inactive legacy `src/api` modules and their inactive consumers/router were moved to `.txt` quarantine paths; active routes retain only verified API modules.
- Admin provider-package catalog now exposes DB-backed list/create/update/status endpoints with duplicate and field validation.
- Catalog deactivation is non-destructive; Provider package list only returns active rows and reflects Admin mutations through shared cache invalidation.
- Gateway acceptance verified Admin create/update/activate/deactivate, Provider visibility/hide behavior, and the persisted LocalDB row.
- Trip comments now use a dedicated constrained table and authorized list/create contract instead of reusing blog comments.
- Gateway acceptance verified comment post/read-back/DB persistence and `404` for an inaccessible private trip.

Deployment truth:

- Required migrations are `database/migrations/20260620_provider_verification_documents.sql`, `20260621_runtime_query_performance.sql`, and `20260621_trip_comments.sql`.
- All three migrations are applied in the isolated `(localdb)\MSSQLLocalDB` acceptance database. The configured SQLEXPRESS instance remains pending because this tool identity cannot establish its Integrated Security SSPI context.

## 2026-06-22 Contract Addendum

| Method | Gateway path | Auth | Current behavior |
|---|---|---|---|
| `POST` | `/api/auth/refresh` | HttpOnly refresh cookie | Rotates the hashed DB refresh token, revokes the previous token, returns a new access token, and replaces the cookie. |
| `POST` | `/api/auth/logout` | Refresh cookie optional | Revokes the current refresh token and expires the cookie. |
| `PUT` | `/api/trips/{id}` | Owner or `EDITOR` | Updates editable Trip metadata, budget, and visibility. |
| `PUT` | `/api/trips/{id}/timeline` | Owner or `EDITOR` | Replaces the timeline graph; active Planner now autosaves add/edit/delete/move/order/time/note/cost changes. |

Access tokens are no longer persisted in browser Web Storage by the active client. Pending schema hardening is documented in `database/migrations/MIGRATION_REQUIREMENTS.md`.
- Gateway + all microservices ran against LocalDB; Provider acceptance and the active route matrix are now claimed with runtime evidence.

Con lai:

1. Decide whether legacy `/api/places/{category}` routes should be deleted from docs/frontend memory or restored as real backend APIs.
2. Complete remaining Planner mutation controls beyond timeline save.
3. Use the root CRD backlog as the only source for new business phases.

---

## 8. Definition Of Done For API Truth

API truth can be considered clean when:

- Every active frontend API call maps to one current controller action.
- Every current controller action used by frontend is reachable through YARP.
- No active route imports `WebClient/src/api/*` legacy modules unless the module is verified against current backend.
- API catalog is generated or updated from source after each backend route change.
- Stub/mock endpoints are labeled in docs and tickets instead of counted as completed business features.
