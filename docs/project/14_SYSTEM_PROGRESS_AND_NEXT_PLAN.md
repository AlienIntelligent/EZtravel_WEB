# 14 - SYSTEM PROGRESS AUDIT AND NEXT PLAN

**Ngay kiem tra**: 2026-06-18  
**Cap nhat gan nhat**: 2026-06-21  
**Pham vi**: Docs, backend source, frontend source, build/test hien tai  
**Nguon doi chieu**:
- `docs/governance/RULES.md`
- `docs/project/01_PROJECT_CONSTITUTION.md`
- `docs/project/09_FRONTEND_GAP_ANALYSIS.md`
- `docs/project/API_TRUTH_REPORT.md`
- `docs/sprints/sprint-01/*`
- `docs/sprints/sprint-02/*`
- `docs/project/SPRINT6_*`
- Source code hien tai trong `Microservices/`, `Services/`, `WebClient/src/`

---

## 1. Executive Summary

He thong hien tai **build duoc** o ca backend va frontend, nhung chua the xem la hoan thien nghiep vu.

Tinh trang thuc te:

| Khu vuc | Trang thai |
|---|---|
| Backend compile/test | Pass, current build 0 warnings |
| Frontend type-check/build | Pass |
| Tai lieu docs | Day du nhung da bi drift so voi source code moi |
| Auth login/register | Phase 2H da co DB/JWT/BCrypt + OTP verification gate |
| OTP/Forgot/Reset | Phase 2H da co DB-backed OTP flow va UI usable voi dev OTP |
| Profile | Phase 2A da co DB APIs; Phase 2O da noi profile/password/avatar len UI active |
| Traveler subscription | Phase 2S da co catalog/current/history/subscribe DB-backed va `/upgrade` active; payment chi la simulated, khong thu tien that |
| Trip | Phase 2C da co DB-backed core, Phase 2G collaborator/shared access; Phase 2V da sua planner deep-link hydrate tu URL/API va toi uu trip list query |
| Explore/Home | Phase 2D da co DB-backed explore APIs; Phase 2N da noi destination/service detail va reviews; Phase 2T da noi destination/trip/community/blog sections tren Home vao API that |
| Community/Blog | Phase 2E da co DB-backed community/blog APIs; Phase 2M da noi blog list/detail/create/comments; Phase 2X da them trip comments persisted vao Trip detail |
| Provider services/packages/verification | Phase 2B-2Q da noi services/packages/onboarding; Phase 2U da thay upload mock bang storage + metadata + Provider/Admin UI; Phase 2V da smoke Gateway/DB/storage that tren LocalDB acceptance |
| Admin core | Phase 2F da co DB-backed users/stats/alerts/moderation/categories; Phase 2R da noi moderation/categories/provider approval len active UI |
| Admin provider packages | Phase 2W da co DB-backed catalog list/create/update/status, active route va Provider catalog propagation; promotions preview van inactive |
| AI | Phase 2L da thay `"mock"` bang DB-aware heuristic services, luu `LICH_SU_AI`, va AI Planner accept flow tao trip/timeline that; external LLM provider chua cau hinh |

Ket luan ngan: **He thong dang o giai doan demo/stabilization, khong phai production-ready.** Cac phase tiep theo tiep tuc theo lat cat backend + UI + docs, uu tien cac route active con placeholder.

---

## 2. Verification Results

### Backend

Lenh da chay:

```text
dotnet build ezTravel.slnx
dotnet test ezTravel.slnx --no-build
```

Ket qua:

| Kiem tra | Ket qua | Ghi chu |
|---|---|---|
| Build | Pass | 0 warnings through Phase 2W |
| Unit tests | Pass | 23/23 |
| Integration tests | Pass | 1/1 |

Current build warnings:
- None in latest `dotnet build ezTravel.slnx`.

### Frontend

Lenh da chay:

```text
npm run type-check
npm run build
```

Ket qua:

| Kiem tra | Ket qua | Ghi chu |
|---|---|---|
| Type check | Pass | `tsc --noEmit` |
| Build | Pass | Vite build thanh cong |

Ghi chu quan trong: Build pass khong co nghia la API runtime dung. Nhieu endpoint sai van pass vi chi la string URL.

---

## 3. Tai Lieu Bi Drift

### 3.1 Docs cu noi backend locked/front-end only

Nhieu tai lieu nhu `01_PROJECT_CONSTITUTION.md`, `07_SPRINT_BACKLOG.md`, `13_TEAM_EXECUTION_PLAN.md` dat rang buoc:

- Database LOCKED
- Backend LOCKED
- Frontend la tang duy nhat duoc phat trien

Nhung source code hien tai da co thay doi lon o backend:

- `AuthController` co them `verify-otp`, `resend-otp`, `forgot-password`, `reset-password`
- `ProfileController` moi ton tai
- `AIController` moi ton tai
- `CommunityController` va `BlogController` moi ton tai
- `TripController` moi co `/api/traveler/dashboard/stats`, `/api/trips/upcoming`, `/api/trips/{id}/timeline`
- `ProviderController` moi gom cac route `/api/provider/*`
- `AdminController` moi dung `/api/admin/stats`, `/api/admin/moderation`, `/api/admin/categories`
- `ExploreController` moi dung `/api/explore`, `/api/destinations`, `/api/categories/regions`, `/api/public/home/trending-destinations`

Vi vay docs cu khong con la anh chup dung cua source hien tai.

### 3.2 `API_TRUTH_REPORT.md` khong con khop source moi

Bao cao nay dung tai thoi diem 2026-06-08, nhung hien tai:

- YARP da co route `/api/notifications`
- Notification mark-read hien la `PUT /api/notifications/{id}/read`, khong phai `POST`
- AI endpoints da ton tai o `AIController`; Phase 2L da thay mock bang DB-aware heuristic services va AI history
- Backend endpoint catalog cu ve `/api/places/hotels|restaurants|activities|vehicles` khong con phan anh controller hien tai

### 3.3 Sprint signoff can re-verify

Sprint 01, Sprint 02, Sprint 06 deu bao cao pass. Tuy nhien source hien tai cho thay:

- Sprint 01 Provider Service UI: Phase 1 rewired active `ServicesManager.jsx` sang `/api/provider/services`; Phase 2B da back endpoint bang DB.
- Sprint 02 Notification: endpoint co, gateway co, nhung method hien la PUT. Community service van tra list rong.
- Sprint 06 Admin Package/Promotion: component co ton tai, nhung router active `src/router/index.jsx` chua expose `/admin/provider-packages` va `/admin/promotions-preview`.

---

## 4. Current Backend Reality

### 4.1 Controllers active

| Service | Controller | Route chinh | Trang thai |
|---|---|---|---|
| Auth | `AuthController` | `/api/auth/*` | Phase 2H DB-backed login/register/verify-otp/resend-otp/forgot-password/reset-password |
| Auth | `ProfileController` | `/api/profile/*` | Phase 2A real-ish DB read/update/password/avatar |
| Auth | `NotificationController` | `/api/notifications/*` | Phase 2K DB-backed list/read qua `THONG_BAO` |
| Trip | `TripController` | `/api/trips/*`, `/api/traveler/dashboard/stats` | Phase 2C DB-backed cho trip core/timeline/dashboard; Phase 2G allows shared trip access |
| Trip | `TripCollaboratorController` | `/api/trips/{id}/collaborators` | Phase 2G DB-backed via `CHIA_SE_LICH_TRINH` |
| Trip | `AIController` | `/api/ai/*` | Phase 2L DB-aware heuristic responses + `LICH_SU_AI` history |
| Place | `ExploreController` | `/api/explore`, `/api/destinations/*`, `/api/categories/*`, `/api/public/home/trending-destinations` | Phase 2D DB-backed explore/tags/destination-services/trending |
| Place | `ServiceController` | `/api/services/*` | Phase 2D DB-backed service detail/reviews/post review |
| Place | `ServiceController` | `/api/services/*` | Service detail/review endpoints |
| Booking | `ProviderController` | `/api/provider/*`, `/api/packages/provider` | Phase 2U multipart verification upload + owner/Admin download; local storage and DB metadata, migration deployment pending |
| Booking | `TravelerPackageController` | `/api/packages/traveler/*` | Phase 2S DB-backed catalog/current/history and simulated subscription write |
| Community | `CommunityController` | `/api/community/feed`, `/api/trips/{id}/like`, etc. | Phase 2E DB-backed public trip feed/trending, trip like toggle, top bloggers, follow toggle |
| Community | `BlogController` | `/api/blogs/*` | Phase 2E DB-backed published blogs/comments/create/detail |
| Admin | `AdminController` | `/api/admin/*` | Phase 2F DB-backed users/stats/alerts/moderation/categories; Phase 2R provider approval/rejection DB-backed |

### 4.2 Stub/mock hotspots

| File | Van de |
|---|---|
| `Services/ezTravel.Services/AI/*` | Phase 2L non-mock DB-aware trip generation/chat/route/budget; external LLM provider still deferred |
| `Services/ezTravel.Services/Trips/ITripService.cs` | Phase 2C da thay sample/stub bang DB logic cho trip core; Phase 2G da them shared-user read access va `EDITOR` timeline edit access |
| `Services/ezTravel.Services/Trips/ITripCollaboratorService.cs` | Phase 2G da thay stub bang DB logic cho list/add/update/remove collaborators |
| `Services/ezTravel.Services/Places/IExploreService.cs` | Phase 2D da thay empty explore/tags/trending/destination-services bang DB logic |
| `Services/ezTravel.Services/Places/IUnifiedService.cs` | Phase 2D da thay service detail/reviews/post review stub bang DB logic |
| `Services/ezTravel.Services/Providers/IProviderService.cs` | Phase 2B real-ish provider status/stats/services/reviews; Phase 2J adds ownership-checked soft-delete |
| `Services/ezTravel.Services/Providers/INccPackageService.cs` | Phase 2I replaced empty/simulated package flow with DB-backed packages/current/history/payment/subscribe logic |
| `Services/ezTravel.Services/Admin/IAdminService.cs` | Phase 2F replaced user list/status/role/stats/alerts stubs with DB logic |
| `Services/ezTravel.Services/Admin/IModerationService.cs` | Phase 2F replaced moderation queue/resolve stubs with `BAO_CAO_NOI_DUNG` + `DUYET_NOI_DUNG` logic |
| `Services/ezTravel.Services/Admin/ICategoryService.cs` | Phase 2F replaced category stubs with `TAG` CRUD logic |
| `Services/ezTravel.Services/Community/ICommunityService.cs` | Phase 2E replaced feed/trending/like/follow/top-bloggers stubs with DB logic |
| `Services/ezTravel.Services/Community/IBlogService.cs` | Phase 2E replaced blog/comment stubs with DB logic |
| `Services/ezTravel.Services/Auth/IProfileService.cs` | Phase 2A real-ish profile/password/avatar DB logic |
| `Services/ezTravel.Services/Notifications/NotificationService.cs` | Phase 2K DB-backed notification list/read/create helper via `THONG_BAO` |

---

## 5. Current Frontend Reality

### 5.1 Active router

Frontend active router la:

```text
WebClient/src/router/index.jsx
```

Khong phai:

```text
WebClient/src/routes_legacy/index.jsx.txt
```

Vi vay khi audit phai dua tren `src/router/index.jsx`.

### 5.2 Active route coverage

| Domain | Route active | Trang thai |
|---|---|---|
| Public/Home | `/` | Phase 2T dung DB-backed trending destinations/trips, community feed va published blogs; CTA/loading/error/empty states da hoan chinh |
| Explore | `/explore`, `/explore/destinations/:id`, `/explore/services/:id` | Explore grid DB-backed after Phase 2D; destination/service detail va review UI usable after Phase 2N |
| Community | `/community`, `/community/blogs`, `/community/blogs/:id`, `/community/blogs/create` | Feed API DB-backed after Phase 2E; Phase 2M da co blog list/detail/create/comments UI dung API that |
| Auth | `/auth/login`, `/auth/register`, `/auth/verify-otp`, `/auth/forgot-password`, `/auth/reset-password` | Phase 2H end-to-end usable; dev OTP shown in UI until email provider exists |
| Traveler | `/dashboard`, `/trips`, `/trips/create`, `/trips/:id`, `/trips/:id/planner`, `/profile`, `/notifications`, `/upgrade` | Trip core/planner/profile/create/dashboard usable; `/upgrade` DB-backed after Phase 2S with simulated activation |
| AI | `/ai/planner`, `/ai/chat` | Co route; Phase 2L backend non-mock DB-aware; planner accept tao trip/timeline that |
| Provider | `/provider/registration`, `/provider/pending`, `/provider/dashboard`, `/provider/services`, `/provider/services/create`, `/provider/services/:id/edit`, `/provider/reviews`, `/provider/packages`, `/provider/current-package`, `/provider/package-history`, `/provider/payment-history` | Phase 2U completes verification; Phase 2V passes full-stack LocalDB/storage acceptance; SQLEXPRESS deployment remains external |
| Admin | `/admin/dashboard`, `/admin/users`, `/admin/moderation`, `/admin/categories` | Dashboard/users DB-backed after Phase 2F; moderation/categories/provider approval active and usable after Phase 2R |
| Admin package/promotions | Khong active | Component co nhung router chua expose |

### 5.3 API layer problems

| File | Van de |
|---|---|
| `src/store/apis/serviceApi.ts` | Phase 1 migrated active provider service calls to `/provider/services`; Phase 2B backend now persists DB rows |
| `src/store/apis/providerApi.ts` | Goi `/provider/services`, `/packages/provider`, `/provider/packages/current|history|payments` phu hop backend moi; subscribe invalidates provider package cache |
| `src/api_legacy/providerApi.ts.txt` | Quarantined after import audit; no active runtime import |
| `src/store/apis/communityApi.ts` | Route-aligned; community/blog endpoints DB-backed after Phase 2E, notifications DB-backed after Phase 2K, blog route UI active after Phase 2M |
| `src/store/apis/adminApi.ts` | Khop backend moi cho users/stats/moderation/categories, nhung thieu package/promotions hooks |
| `src/store/apis/exploreApi.ts` | Khop backend moi; Phase 2N active destination/service detail pages use real detail/services/review hooks with cache invalidation |
| `src/store/apis/plannerApi.ts` | Khop route backend moi; trip core/timeline/stats DB-backed after Phase 2C, collaborators DB-backed after Phase 2G |

### 5.4 Runtime bug da xu ly

Before Phase 1, `UserManager.jsx` goi:

```js
await lockUser(userId).unwrap();
```

Nhung mutation `updateUserStatus` trong `adminApi.ts` dinh nghia argument:

```ts
{ id: number; body: any }
```

Ket qua runtime co nguy co goi:

```text
/api/admin/users/undefined/status
```

Phase 1 da sua thanh:

```js
lockUser({ id: userId, body: { status: "BANNED" } })
```

---

## 6. Completion Assessment

### 6.1 Theo build/test

| Khu vuc | Muc do |
|---|---|
| Backend technical compile | 90% |
| Frontend technical compile | 90% |
| Automated test coverage | Thap |

### 6.2 Theo nghiep vu thuc

| Domain | Danh gia hien tai |
|---|---|
| Auth login/register | 78% |
| Auth OTP/reset/profile | 76% vi profile/password/avatar UI da dung DB APIs; email delivery production van chua co |
| Traveler trips/planner/subscription | 91% vi trip create/list/detail/planner/collaborators/dashboard va upgrade subscription da dung DB flow; runtime smoke test va real payment van con |
| Explore/Home | 82% vi grid/detail/reviews va bon Home sections da dung DB-backed public APIs; runtime voi full gateway stack van can smoke test |
| Community/blog | 72% vi feed va blog list/detail/create/comments da DB-backed, co UI active va Home highlights; trip-feed comments van can product decision |
| Provider dashboard/packages/services | 92% vi registration/pending/approval/documents/service create-edit-delete/status/stats/reviews/packages da co code va UI; can apply migration + full-stack smoke tren DB local |
| Admin core | 78% vi dashboard/users/moderation/categories/provider approval da DB-backed va co active UI; package/promotions van inactive |
| Admin package/promotions | 25% vi chua routed |
| AI | 48% vi endpoint khong con mock, co DB-aware heuristic va luu history; external LLM provider/polish chua co |
| Notifications | 62% vi list/read DB-backed va UI dropdown/page usable; realtime/push chua co |

Uoc luong tong the theo business readiness: **74-81%**.

---

## 7. Priority Plan

## Phase 0 - Stop The Bleeding

Muc tieu: tao lai single source of truth moi tu source code hien tai.

Status 2026-06-18: **Completed**. Output da tao:
- `docs/project/15_CURRENT_API_TRUTH_2026_06_18.md`
- `docs/project/16_FRONTEND_RUNTIME_ROUTE_AUDIT.md`

1. Cap nhat API truth report theo controller hien tai.
2. Ghi ro route active la `src/router/index.jsx`.
3. Danh dau docs cu nao chi con tham khao.
4. Tao bang endpoint frontend -> backend hien tai.
5. Khong build UI moi truoc khi API map sach.

Deliverable:
- `docs/project/15_CURRENT_API_TRUTH_2026_06_18.md`
- `docs/project/16_FRONTEND_RUNTIME_ROUTE_AUDIT.md`

## Phase 1 - Fix Runtime-Wire Bugs

Muc tieu: cac route active khong goi endpoint sai.

Status 2026-06-18: **Completed**.

Da lam:
- Them YARP route cho community cross-domain actions:
  - `POST /api/trips/{id}/like`
  - `GET /api/public/home/trending-trips`
  - `POST /api/users/{id}/follow`
- Chuyen `/explore` route sang current `store/apis/exploreApi`, khong con goi legacy `/places/*`.
- Chuyen `/provider/dashboard` sang `GET /api/provider/stats`.
- Chuyen `/provider/services` sang `/api/provider/services`; delete luc Phase 1 tam disable, sau do Phase 2J da bat lai bang soft-delete endpoint.
- Chuyen `/provider/reviews` sang store API va normalize response.
- Fix `UserManager.jsx` update status body de khong goi `/admin/users/undefined/status`.
- Fix link chet `/planner` tren Home/AI flow va `/provider/promotions` tren Provider Dashboard.

Verification:
- `npm run type-check` pass
- `npm run build` pass
- `dotnet build ezTravel.slnx` pass
- `dotnet test ezTravel.slnx --no-build` pass

Historical checklist completed in Phase 1:

1. Sua `UserManager.jsx`/`adminApi.ts` contract cho update user status.
2. Rewire `ServicesManager.jsx` sang API backend moi:
   - Listing: `GET /api/provider/services`
   - Create: `POST /api/provider/services`
   - Update: `PUT /api/provider/services/{id}`
   - Delete: chua co endpoint, can UI hide hoac tao CR.
3. Sua Provider packages theo backend moi:
   - `GET /api/packages/provider`
   - `POST /api/provider/packages/subscribe-simulated`
Remaining route decision after Phase 1:

1. Expose hoac loai bo Admin package/promotions routes:
   - Neu giu Sprint 6 scope: them route active va hooks dung backend.
   - Neu backend moi khong co controller package admin: mark deferred.
2. Add smoke test UI cho route active.

Definition of Done:
- `npm run build` pass
- `npm run type-check` pass
- Khong con endpoint sai tren route active

## Phase 2 - Replace Stub Backend With Real DB Logic

Muc tieu: giai quyet core business truoc.

Status 2026-06-18: **In progress**.

Completed slice:
- **Phase 2A - Profile service real DB logic**
  - `GET /api/profile` doc `NguoiDung` va provider info tu `NhaCungCap` neu co.
  - `PUT /api/profile` update `HoTen`, `SoDienThoai`, `NgayCapNhat`.
  - `PUT /api/profile/password` verify old password bang BCrypt va hash password moi.
  - `POST /api/profile/avatar` update `AvatarUrl`.

Verification:
- `dotnet build ezTravel.slnx` pass
- `dotnet test ezTravel.slnx --no-build` pass
- `npm run type-check` pass

- **Phase 2B - Provider services real DB logic**
  - `GET /api/provider/services?category=&keyword=` returns real `DichVu` rows owned by current provider.
  - `POST /api/provider/services` creates real `DichVu` rows with owner/provider validation.
  - `PUT /api/provider/services/{id}` enforces ownership and updates DB.
  - `GET /api/provider/status` and `GET /api/provider/stats` read provider/service DB state.
  - `GET /api/provider/reviews` and `POST /api/provider/reviews/{id}/reply` read/write provider-owned review data.
  - `POST /api/provider/register` creates a minimal pending `MULTI_SERVICE` provider profile instead of returning fake success.
  - Historical note: delete endpoint was still missing in Phase 2B; Phase 2J later added ownership-checked soft-delete and enabled UI delete.
  - DTO nullable warnings in `Requests.cs` were cleaned.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2C - Traveler trips real DB logic**
  - `GET /api/trips` now reads owner trips from `LICH_TRINH`, excluding archived rows.
  - `POST /api/trips` creates a real trip plus initial `NGAY_LICH_TRINH` rows, and accepts frontend aliases `title`, `startDate`, `endDate`, `visibility`.
  - `GET /api/trips/{id}` and `GET /api/trips/{id}/timeline` read real trip/day/place/service/cost graph, with public/owner access rules.
  - `PUT /api/trips/{id}/timeline` replaces timeline days/items in DB.
  - `DELETE /api/trips/{id}` soft-archives the trip with `ARCHIVED`.
  - `POST /api/trips/{id}/clone` copies trip/day/place/service/cost graph and writes `LICH_SU_CLONE`.
  - `GET /api/trips/upcoming` and `GET /api/traveler/dashboard/stats` now compute DB-backed values.
  - `TripController` now returns `401/404/400/500` via `TripServiceError` instead of wrapping failures in `200 OK`.
  - `UpdateTimelineRequest` now accepts `Days`.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2D - Explore/Home real DB data**
  - Implement real `GET /api/explore` results from `DIA_DIEM` + `DICH_VU`.
  - Implement `GET /api/destinations/{id}/services`.
  - Implement `GET /api/public/home/trending-destinations`.
  - Implement `GET /api/services/{id}` and `/api/services/{id}/reviews` if needed by active detail pages.
  - Historical note: OTP/reset was deferred at this point; Phase 2H later implemented a DB-backed dev-OTP flow.

Status 2026-06-18: **Completed**.

Da lam:
- `GET /api/categories/tags` now reads real `TAG` rows.
- `GET /api/explore?type=places` returns DB-backed destination grid from `DIA_DIEM`, with frontend aliases `name`, `description`, `address`, `images`, `averageRating`.
- `GET /api/explore?type=services` returns DB-backed service grid from `DICH_VU`, with category/rating/budget/province/keyword filters and provider badge metadata.
- `GET /api/explore` with empty params still returns promoted provider data for active provider badge checks.
- `GET /api/destinations/{id}/services` returns active services for a destination.
- `GET /api/public/home/trending-destinations` returns top destinations with provider-card compatibility aliases used by current Home UI.
- `GET /api/services/{id}` returns DB-backed service detail and increments view count.
- `GET /api/services/{id}/reviews` returns real service reviews from `DANH_GIA`.
- `POST /api/services/{id}/reviews` creates a real review row and updates service rating/count.
- `ExploreController` and `ServiceController` were formatted and now return 404/error responses where relevant.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2E - Community/Blog real DB logic**

Status 2026-06-18: **Completed**.

Da lam:
- `GET /api/community/feed` now returns DB-backed public trips from `LICH_TRINH` with user/like metadata and frontend compatibility aliases.
- `GET /api/public/home/trending-trips` now returns DB-backed public trips sorted by likes/clones/views.
- `POST /api/trips/{id}/like` now toggles real `THICH_LICH_TRINH` rows and synchronizes `LICH_TRINH.luot_thich`.
- `GET /api/community/top-bloggers` now ranks published blog authors by post count, followers, and total likes.
- `POST /api/users/{id}/follow` now toggles real `THEO_DOI_NGUOI_DUNG` rows and returns follower count.
- `GET /api/blogs` and `GET /api/blogs/{id}` now read published `BAI_VIET` rows with author/place/image/comment/like metadata.
- `POST /api/blogs` now creates a published blog row, validates author/place, generates a unique slug, and stores thumbnail image metadata when provided.
- `GET /api/blogs/{id}/comments` and `POST /api/blogs/{id}/comments` now read/write real `BINH_LUAN_BAI_VIET` rows.
- `CommunityController` and `BlogController` now map service errors to real HTTP status codes instead of returning all failures as `200 OK`.
- `FeedCard.jsx` comment mutation now sends `{ id, body: { content } }`, matching `communityApi.createBlogComment`.

Known limitation:
- Community feed currently models public trips because the active like endpoint is `POST /api/trips/{id}/like`. Blog comment APIs are real, but the feed UX still needs a product decision if comments should attach directly to trips.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2F - Admin core real DB logic**

Status 2026-06-19: **Completed**.

Da lam:
- `GET /api/admin/users` now reads real `NGUOI_DUNG` rows and includes provider metadata when available.
- `PUT /api/admin/users/{id}/status` now updates real user status. Frontend `LOCKED` is persisted as `BANNED`, which Auth/Gateway already block.
- `PUT /api/admin/users/{id}/role` now validates and updates `NGUOI_DUNG.vai_tro`.
- `GET /api/admin/stats` now computes DB-backed users/trips/providers/services/blogs/reports/reviews/package/revenue metrics.
- `GET /api/admin/alerts` now returns real alert counts from pending reports/providers/reviews and locked users.
- `GET /api/admin/moderation` now reads pending `BAO_CAO_NOI_DUNG` with reporter and target metadata.
- `POST /api/admin/moderation/{id}/resolve` now updates report status and writes a `DUYET_NOI_DUNG` audit row using the current admin id.
- `GET/POST/DELETE /api/admin/categories` now manages `TAG` rows, rejecting deletion for tags already attached to places.
- `AdminController` now maps `AdminServiceError` to real HTTP status codes.
- `AppDbContext.OnConfiguring` no longer emits the hardcoded connection-string scaffold warning; DI-configured connection remains the normal runtime path and env var `EZTRAVEL_DEFAULT_CONNECTION` is only a fallback.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2G - Trip collaborators real DB logic**

Status 2026-06-19: **Completed**.

Da lam:
- `GET /api/trips/{id}/collaborators` now reads owner + shared users from `CHIA_SE_LICH_TRINH` with user metadata.
- `POST /api/trips/{id}/collaborators` now supports add/update/remove through `Action` and `VIEW`/`EDITOR` permissions.
- Only the trip owner can manage collaborators; shared users can view the collaborator list for trips shared with them.
- `TripService` now allows shared users to read private shared trips, see them in trips/upcoming/dashboard counts, and allows only `EDITOR` collaborators to update timeline.
- `TripCollaboratorController` now maps service errors to real HTTP status codes and safely parses user claims.
- `ManageCollaboratorRequest` now accepts `Email`, `UserId`/`MaNguoiDung`, `Role`/`Permission`/`Quyen`, and `Action`.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2H - Auth OTP/Forgot/Reset end-to-end**

Status 2026-06-19: **Completed**.

Da lam:
- `POST /api/auth/register` now creates a `PENDING_VERIFICATION` user, writes a real `OTP_XAC_THUC` row, and returns `devOtp` for local/dev use.
- `POST /api/auth/login` now blocks `PENDING_VERIFICATION`, `BANNED`, and `INACTIVE` accounts with real HTTP error responses.
- `POST /api/auth/verify-otp` now validates DB OTP, tracks failed attempts, consumes register OTP, activates the user, and supports reset verification without consuming the code.
- `POST /api/auth/resend-otp` now invalidates old pending OTPs and creates a new DB OTP.
- `POST /api/auth/forgot-password` now creates a reset OTP from DB user state.
- `POST /api/auth/reset-password` now validates unused reset OTP, hashes the new password with BCrypt, marks OTP used, and updates user state.
- Auth UI now shows dev OTP after register/forgot/resend, carries reset flow state into OTP verification, and routes verified reset users to `/auth/reset-password`.
- `AuthController` now maps failed auth operations to real HTTP error responses instead of wrapping all failures in `200 OK`.

Known limitation:
- There is still no email/SMS provider. `devOtp` is intentionally returned and shown in UI so the module is usable locally; replace this with email delivery before production.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2I - Provider packages/subscription end-to-end**

Status 2026-06-19: **Completed**.

Da lam:
- `GET /api/packages/provider` now reads active `GOI_DICH_VU_NCC` rows and marks the current provider package when one is active.
- `GET /api/provider/packages/current` now returns the current active `DANG_KY_GOI_NCC` package with package benefits and paid amount.
- `GET /api/provider/packages/history` now returns provider package registration history from `DANG_KY_GOI_NCC`.
- `GET /api/provider/packages/payments` now returns provider payment history from `THANH_TOAN_NCC`.
- `POST /api/provider/packages/subscribe-simulated` now validates package rules, expires the old active package, creates a real `DANG_KY_GOI_NCC`, creates a demo `THANH_TOAN_NCC` payment with `SUCCESS`, and updates `NHA_CUNG_CAP.ma_goi_ncc_hien_tai`.
- `PromotionService` now treats both `ACTIVE` and `APPROVED` providers as visible, so provider package promotion can affect existing approved provider data.
- Provider UI now uses real hooks for package list/current/history/payments and exposes active routes:
  - `/provider/packages`
  - `/provider/current-package`
  - `/provider/package-history`
  - `/provider/payment-history`
- Provider sidebar now links to Pricing, Current Package, Package History, and Payments.

Known limitation:
- Payment is still a demo-success flow. It writes real DB rows and is usable locally, but does not integrate a real payment gateway yet.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2J - Provider service delete/soft-delete end-to-end**

Status 2026-06-19: **Completed**.

Da lam:
- `DELETE /api/provider/services/{id}` now soft-deletes provider-owned `DichVu` rows by setting `TrangThai = "DELETED"` and updating `NgayCapNhat`.
- Delete enforces current-user provider ownership and returns `404` when the current provider profile or target service is not found.
- `ProviderController` now maps `ProviderServiceError.StatusCode` to real HTTP status codes instead of always returning `400`.
- `WebClient/src/store/apis/serviceApi.ts` now exposes `useDeleteProviderServiceMutation`.
- `ServicesManager.jsx` now enables the existing delete confirmation flow, calls the real backend endpoint, invalidates/refetches the service list, and keeps the button disabled while deletion is in progress.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2K - Notifications real table flow**

Status 2026-06-19: **Completed**.

Da lam:
- `GET /api/notifications` now reads real `THONG_BAO` rows for the current user, sorted unread-first/newest-first.
- `PUT /api/notifications/{id}/read` now enforces current-user ownership and returns `404` for missing or foreign notifications.
- `NotificationService.CreateNotificationAsync` now creates real `THONG_BAO` rows for internal future callers.
- `NotificationDto` now includes `message` and `link` aliases for current frontend compatibility.
- Header notification bell now shows real unread count and a real dropdown instead of hardcoded badge count.
- `/notifications` route now renders a usable list page with loading/empty/error states, refresh, mark-one-read, and mark-all-read.
- `communityApi` now tags notification queries/mutations so dropdown/page refresh after read actions.

Known limitation:
- Realtime/push notification delivery is not implemented yet. This phase completes persisted notification list/read UX only.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2L - AI provider boundary / DB-aware AI flow**

Status 2026-06-19: **Completed**.

Da lam:
- Replaced hardcoded `"mock"` AI responses with DB-aware heuristic implementations for:
  - `POST /api/ai/generate`
  - `POST /api/ai/chat`
  - `POST /api/ai/optimize-route`
  - `POST /api/ai/analyze-budget`
- AI services now read real `DIA_DIEM`, `DICH_VU`, `LICH_TRINH`, timeline, and cost data where applicable.
- AI services now persist request/response summaries into `LICH_SU_AI`.
- `GenerateTripRequest` now accepts active frontend fields: destination, start/end date, budget mode, preferences, and additional notes.
- `ChatMessageRequest` now accepts active frontend `messages` history.
- `AIController` now uses safe user claim parsing and normal controller formatting.
- AI Planner accept flow now creates a real trip via `POST /api/trips`, saves AI days to `PUT /api/trips/{id}/timeline`, and opens `/trips/{id}/planner` using a real numeric trip id.

Known limitation:
- This is a local DB-aware AI provider boundary, not an external LLM integration. To get generative natural language beyond heuristic output, wire the provider boundary to an LLM and keep the same controller contract.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2M - Community/blog UX completion**

Status 2026-06-19: **Completed**.

Da lam:
- `/community/blogs` now loads the real published blog list through `GET /api/blogs`, with loading/error/empty states and links to details/create.
- `/community/blogs/{id}` now loads real blog detail and comments, displays author/place/view metadata, and posts comments through `POST /api/blogs/{id}/comments`.
- `/community/blogs/create` now validates and submits title/content plus optional summary/thumbnail/place through `POST /api/blogs`, then opens the created blog by real id.
- `communityApi` now tags blog list/detail/comments and invalidates those caches after create/comment mutations.
- The three active blog route pages are no longer placeholders.

Known limitation:
- The main community feed remains trip-based. Direct Trip comments were subsequently completed end-to-end in Phase 2X on the active Trip detail route.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2N - Explore detail pages usable UI**

Status 2026-06-19: **Completed**.

Da lam:
- `/explore/destinations/{id}` now loads real `PlaceDetailDto`, displays image/location/rating/views/tags/map link, and loads active destination services.
- `/explore/services/{id}` now loads real service/provider/place/price/gallery metadata and real review list.
- Authenticated users can post `{ rating, comment, imageUrl }` through `POST /api/services/{id}/reviews`; review/service caches refresh after submit.
- Explore cards now link to the real destination/service detail routes instead of showing the previous coming-soon action.
- Both active Explore detail pages include loading/error/empty states and are no longer placeholders.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2O - Traveler profile and trip-create UI**

Status 2026-06-20: **Completed**.

Da lam:
- `/profile` now loads the current DB-backed profile and exposes real update forms for name/phone, avatar URL, and password.
- Profile mutations invalidate the `User` cache so app-level user hydration refreshes after updates.
- Profile password flow validates minimum length/confirmation and handles backend `success = false` responses correctly.
- `/trips/create` now validates title/dates/budget, posts real trip aliases to `POST /api/trips`, and opens `/trips/{id}/planner` using the created numeric id.
- `plannerApi` now tags trip list/detail/timeline and invalidates trip caches after create/clone/delete/timeline writes.
- Both active routes are no longer placeholders and include loading/error/success states.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2P - Traveler dashboard real data**

Status 2026-06-20: **Completed**.

Da lam:
- `/dashboard` now reads summary metrics from `GET /api/traveler/dashboard/stats`.
- Upcoming trip cards now use `GET /api/trips/upcoming` and link to active trip detail/create routes.
- Recent notifications now use the DB-backed notification query instead of hardcoded demo messages.
- Removed fake saved destinations, stale trip cards, demo counters, and dead dashboard-only controls.
- Added loading, retry, error, and empty states for stats, trips, and notifications.
- Dashboard quick actions now link to active Explore, Trips, Community, AI Planner, and Profile routes.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2Q - Provider registration and service create/edit**

Status 2026-06-20: **Completed**.

Da lam:
- `/provider/registration` now submits a real pending provider profile through `POST /api/provider/register`.
- `/provider/pending` reads and polls `GET /api/provider/status`, shows the current DB state, and redirects when the provider becomes active.
- Provider guards now verify provider DB status, while `roleResolver` recognizes provider profile/status from hydrated user data.
- `/provider/services/create` and `/provider/services/:id/edit` now share a real service editor backed by current create/update mutations.
- Service editor searches real places through `/api/explore`, validates price/place fields, handles loading/error states, and refreshes `Service`/`Provider` caches.
- `ServicesManager` add/edit actions now navigate to the active create/edit routes.
- Removed the unused legacy `ServiceForm.jsx` and `ServiceFormModal.jsx`.
- Historical Phase 2Q note: upload-docs was still mock here; Phase 2U later replaced it with multipart storage/metadata and active pending/Admin UI.

Verification:
- `dotnet build ezTravel.slnx` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 9/9
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2R - Admin moderation, categories, and provider approval**

Status 2026-06-20: **Completed**.

Da lam:
- Added `GET /api/admin/providers/pending` for the DB-backed pending provider queue.
- Added `PUT /api/admin/providers/{id}/status` for approve/reject with admin validation.
- Provider approval updates both `NHA_CUNG_CAP.trang_thai` and `NGUOI_DUNG.vai_tro`; rejection restores a provider-role account to Traveler.
- `/admin/moderation` now exposes real report resolution and provider approval tabs with loading/error/empty states.
- `/admin/categories` now exposes real tag list/create/delete, filtering, and prevents deletion of tags currently attached to places.
- Admin sidebar now links to the active Moderation and Categories routes; the stale dashboard reports link now points to Moderation.
- `adminApi` adds cache tags for moderation, categories, stats, and provider approval mutations.
- Added two unit tests for approve/reject provider state transitions.

Verification:
- `dotnet build ezTravel.slnx --no-restore` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build --no-restore` pass, 11/11
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2S - Traveler upgrade and subscription flow**

Status 2026-06-20: **Completed**.

Da lam:
- Added `GET /api/packages/traveler` for active `GOI_DICH_VU` catalog with current-package markers.
- Added `GET /api/packages/traveler/current` and `/history` from `DANG_KY_GOI`.
- Added `POST /api/packages/traveler/subscribe-simulated`; it expires prior active registrations, creates a real subscription, and updates Traveler role to `PREMIUM_TRAVELER`.
- Profile hydration now exposes `isPremium`, current Traveler package, and expiry based on a non-expired DB subscription.
- `roleResolver` downgrades an expired Premium role to Traveler when `isPremium = false`.
- `/upgrade` now shows catalog, current subscription, activation confirmation, and subscription history with loading/error/empty states.
- Frontend subscription mutations invalidate both `Subscription` and `User` caches so Premium permissions refresh after activation.
- Added two unit tests for successful Traveler activation and provider-account rejection.
- Payment remains explicitly simulated; this phase does not claim a real payment gateway.

Verification:
- `dotnet build ezTravel.slnx --no-restore` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build --no-restore` pass, 13/13
- `npm run type-check` pass
- `npm run build` pass

- **Phase 2T - Home remaining sections real data**

Status 2026-06-20: **Completed**.

Da lam:
- Replaced the Home destination placeholder with real `GET /api/public/home/trending-destinations` cards.
- Replaced trip/community placeholders with `GET /api/public/home/trending-trips` and `GET /api/community/feed`.
- Added the latest published blog section from `GET /api/blogs`, with links to active blog detail routes.
- Removed the semantically incorrect provider-card rendering of destination records and all Home under-development placeholder messages.
- Every section now has isolated loading, retry/error, and empty states so one unavailable service does not blank the page.
- Search and CTA links now resolve to active Explore, Trip create, Community, Blog, and destination detail routes.
- Playwright verified desktop `1440x900` and mobile `390x844`: no horizontal overflow, no framework overlay, Home-to-Explore search navigation passed.

Verification:
- `dotnet build ezTravel.slnx --no-restore` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build --no-restore` pass, 13/13
- `npm run type-check` pass
- `npm run build` pass
- `npm exec eslint -- src/modules/home/Home.jsx` pass

- **Phase 2U - Provider verification documents end-to-end**

Status 2026-06-21: **Completed in source and isolated LocalDB acceptance; configured SQLEXPRESS still requires an external Windows session because this tool identity cannot create its SSPI context**.

Da lam:
- Added `HO_SO_XAC_MINH_NCC` entity, EF mapping, UnitOfWork repository, and idempotent SQL migration with file-size/type/status constraints.
- Replaced `POST /api/provider/upload-docs` mock with real multipart storage for PDF/JPG/PNG up to 5 MB.
- Files are stored under the configurable BookingService `App_Data/provider-documents` path with random names; original paths are never exposed.
- Added signature, MIME, extension, size, and path-traversal validation.
- Added JWT-protected `GET /api/provider/documents/{id}/download` for the owner or Admin only.
- Provider status and Admin pending queue now expose current document metadata; resubmission marks the prior document `REPLACED` and reopens a rejected provider as `PENDING`.
- Provider registration now captures tax/license/contact/address data; pending UI supports upload, replacement, status, and authenticated download.
- Admin moderation shows legal metadata and downloadable documents; both UI and backend block approval without a submitted document.
- Approval now persists schema-valid provider status `APPROVED` instead of the previous drifted `ACTIVE`, and updates submitted documents to `APPROVED/REJECTED`.
- `ProviderPendingGuard` now allows `REJECTED/INACTIVE` providers to return and resubmit instead of redirect-looping.
- Added three Admin approval tests and two Provider document service tests.

Verification:
- `dotnet build ezTravel.slnx --no-restore` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build --no-restore` pass, 16/16 (15 unit + 1 integration)
- `npm run type-check` pass
- `npm run build` pass
- Focused JSX lint pass
- Playwright passed Provider multipart upload/status at `1440x900` and `390x844`, Admin document download/approval, and rejected-provider re-entry; no horizontal overflow or framework overlay.

Deployment note:
- Migration: `database/migrations/20260620_provider_verification_documents.sql`.
- Migration was applied to `(localdb)\MSSQLLocalDB` for full-stack acceptance. The configured SQLEXPRESS instance still fails under the tool identity with `Cannot generate SSPI context` and must be migrated from a valid Windows/SSMS session.

- **Phase 2V - Full-stack runtime smoke and accessibility**

Status 2026-06-21: **Completed**.

Da lam:
- Built isolated `EZTravel` LocalDB from the current schema/data snapshot and applied Phase 2U plus `20260621_runtime_query_performance.sql`.
- Started Gateway, all six microservices, and Vite against the same DB; Provider registration, multipart upload, owner/Admin download, pending queue, approval, user-role update, provider status, document status, and physical storage all passed.
- Fixed active-route accessible names, page headings, mobile Planner action bar, and Explore map fallback when no Google Maps key is configured.
- Fixed `/trips/:id/planner` deep-link initialization from route params and hydrated real trip/timeline data into planner state.
- Replaced the expensive Trip list graph load with indexed summary queries; warm runtime fell to about `57 ms`, with first process request about `2.4 s`.
- Added runtime DB migration to disable `AUTO_CLOSE` and index Trip cost/share/list paths.
- Quarantined inactive legacy API/router/component clusters under `api_legacy`, `routes_legacy`, and `modules_legacy` with `.txt` suffixes.
- Playwright active matrix passed 8 routes at desktop `1440x900` and mobile `390x844`: no API 4xx/5xx, redirect loop, console/page error, horizontal overflow, unlabeled active controls, unnamed visible actions, or missing image alt.

Verification:
- `dotnet build ezTravel.slnx --no-restore` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 16/16
- `npm run type-check` pass
- `npm run build` pass
- Focused ESLint pass for changed active files
- Full-stack Provider acceptance and active-route Playwright matrix pass

- **Phase 2W - Admin provider-package management end-to-end**

Status 2026-06-21: **Completed**.

Da lam:
- Added Admin-protected `GET/POST/PUT /api/admin/provider-packages` and `PUT /api/admin/provider-packages/{id}/status` over `GOI_DICH_VU_NCC`.
- Added validation for name, description, non-negative prices, priority coefficient, duplicate names, and missing package ids.
- Uses status deactivation instead of hard delete so provider subscription history and current-package references remain valid.
- Added current RTK Query hooks with `Admin` and `Provider` cache invalidation.
- Activated `/admin/provider-packages` in router/sidebar and replaced the stale provider-assignment component with catalog loading/error/empty/search/create/edit/status UI.
- Provider `/provider/packages` immediately reflects active Admin create/update/status changes through the same Gateway/DB contract.
- Added accessible names for shared toast close controls discovered during runtime audit.

Verification:
- `dotnet build ezTravel.slnx --no-restore` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 20/20 (19 unit + 1 integration)
- `npm run type-check` pass
- `npm run build` pass
- Focused ESLint pass for active JS/JSX files
- Gateway smoke passed Admin create/update/activate/deactivate -> Provider catalog -> LocalDB row evidence
- Playwright desktop `1440x900` and mobile `390x844` passed UI create/edit/deactivate with 0 API/console/page/overflow/checked-accessibility failures

- **Phase 2X - Community trip-comment contract end-to-end**

Status 2026-06-21: **Completed**.

Da lam:
- Added idempotent `20260621_trip_comments.sql` with `BINH_LUAN_LICH_TRINH`, ownership FKs, content/status constraints, and read indexes.
- Added EF entity/mapping/UnitOfWork repository and DB-backed Community list/create service.
- Comment access follows Trip access: owner, shared user, or public trip; inaccessible/private trips return `404` without leaking existence.
- Added authorized `GET/POST /api/trips/{id}/comments` in CommunityService and a higher-priority YARP route before the generic Trip route.
- Added RTK Query cache contract and active TripDetails loading/error/empty/post/read-back UI.
- Community feed comment counts now read active trip comments instead of hardcoded zero.
- Added four focused service tests for persistence, validation, private access, author mapping, and ownership.

Verification:
- `dotnet build ezTravel.slnx --no-restore` pass, 0 warnings
- `dotnet test ezTravel.slnx --no-build` pass, 24/24 (23 unit + 1 integration)
- `npm run type-check` pass
- `npm run build` pass
- Gateway smoke passed Traveler post -> fresh read -> LocalDB evidence; inaccessible private trip returned `404`
- Playwright desktop `1440x900` and mobile `390x844` passed active TripDetails comment post/read with 0 API/console/page/overflow/checked-accessibility failures

Next recommended slice:
- **Pause feature phases for CRD backlog and system UI quality**
  - Publish a current CRD-only end-to-end backlog in the root README.
  - Audit every active route at desktop/mobile and normalize shared shells, typography, spacing, tables, forms, and states.
  - Keep out-of-scope CRD section 7.2 items excluded.

Thu tu uu tien:

1. Reconcile unfinished CRD workflows into the root README
2. Complete whole-system UI audit and visual normalization
3. Resume business modules only from the end-to-end CRD backlog

Definition of Done:
- Khong con service tra `{ success = true }` khong tac dong DB cho feature marked Done.
- Khong con `mock` trong backend services cua feature active.

### Phase 2Y - Auth session and active Planner mutation loop (2026-06-22)

- Fixed the active Planner's `Map is not a constructor` runtime crash.
- Replaced mock Planner resources with current `/api/explore` place/service IDs.
- Added activity create/edit/delete, cross-day/order reducers, time/note/cost editing, budget update, immediate over-budget warning, and 700 ms debounced timeline persistence.
- Added `PUT /api/trips/{id}` for editable metadata/budget and corrected `CHI_PHI_DICH_VU_LICH_TRINH.loai_chi_phi` mapping to current DB constraints.
- Gateway/Playwright acceptance passed add -> save -> reload -> edit -> save -> reload -> mobile render -> delete -> reload with HTTP 200 and no relevant console/API errors.
- Added 14-day hashed refresh-token rotation, HttpOnly/Secure/SameSite cookie, refresh/logout APIs, replay rejection, and in-memory access-token handling in the client.
- Added configurable SMTP OTP sender, development-only `devOtp`, 60-second resend cooldown, and five-failure 15-minute OTP lock using the current schema.
- Auth migration hardening and future Planner concurrency/share-link schema are specified in `database/migrations/MIGRATION_REQUIREMENTS.md`; no DB migration was applied.
- Co unit/integration tests toi thieu cho service chinh.

## Phase 3 - Reconcile Sprint Docs

Muc tieu: docs khong gay nham lan cho nguoi lam tiep.

1. Update `API_TRUTH_REPORT.md` hoac thay bang ban moi.
2. Update `09_FRONTEND_GAP_ANALYSIS.md` theo route active moi.
3. Update Sprint 01/02/06 signoff thanh:
   - Historical result
   - Current drift note
   - Re-verification required
4. Cap nhat `DOCUMENT_INDEX.md` va `READING_ORDER.md`.

## Phase 4 - Product Completion

Chi thuc hien sau khi Phase 1-3 sach.

1. Hoan thien cac Planner mutation controls con lai.
2. Hoan thien cac CRD workflow con thieu theo root README.
3. Tich hop payment/subscription provider chi khi CRD va credential yeu cau.
4. Decide external LLM provider neu can nang cap AI heuristic thanh generative AI.

---

## 8. Next Sprint Proposal

### Current Focus - CRD Backlog And Whole-System UI

**Goal**: Dong bang danh sach nghiep vu CRD chua hoan tat theo Definition of Done end-to-end, sau do dua toan bo active UI ve mot chat luong thi giac va su dung nhat quan.

Scope:
- Audit CRD v3 against current DB, backend, Gateway, active router, and runtime evidence.
- Create/update root `README.md` with flat task bullets grouped by CRD domain.
- Audit all active routes at `1440x900` and `390x844`.
- Fix shared UI consistency and route-specific visual/ergonomic blockers.

Out of scope:
- SignalR realtime
- Real payment gateway integration
- External LLM provider integration

Acceptance Criteria:
- README khong tinh mot nghiep vu la Done neu con thieu DB/API/Gateway/UI/test/runtime.
- Excluded scope duoc tach ro, khong dua vao backlog.
- Moi active route khong bi overflow, overlap, mojibake tu source, unnamed control, hay trang thai loading/error/empty vo dang.
- Build/test va route matrix pass lai sau dot UI.

---

## 9. Final Recommendation

Khong nen tiep tuc theo Sprint 7 polish ngay. Nen tiep tuc theo cac lat cat end-to-end:

```text
Current focus: CRD backlog + whole-system UI quality
```

Khong mo phase nghiep vu moi cho den khi README backlog va UI audit hoan tat.
