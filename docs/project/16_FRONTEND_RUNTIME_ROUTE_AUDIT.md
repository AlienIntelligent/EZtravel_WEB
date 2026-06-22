# 16 - FRONTEND RUNTIME ROUTE AUDIT

**Ngay lap**: 2026-06-18  
**Cap nhat gan nhat**: 2026-06-21  
**Pham vi**: Active router, lazy pages, API modules used by active routes  
**Lien quan**: `docs/project/15_CURRENT_API_TRUTH_2026_06_18.md`

---

## 1. Executive Summary

Frontend hien tai **type-check/build pass** through Phase 2X. Full-stack active route matrix khong con API 4xx/5xx, redirect loop, console/page error, horizontal overflow, hay accessibility blocker da biet. He thong van chua production-ready vi con simulated payment va cac CRD workflow chua expose.

Active router la:

- `WebClient/src/router/index.jsx`
- `WebClient/src/router/routes.js`
- `WebClient/src/App.tsx` import `router` tu `./router`

Router cu da cach ly:

- `WebClient/src/routes_legacy/index.jsx.txt` **khong duoc compile/runtime import**.

Ket luan nhanh:

| Khu vuc | Trang thai runtime |
|---|---|
| Auth pages | Route active; profile real-ish after Phase 2A; OTP/Forgot/Reset end-to-end usable after Phase 2H with dev OTP |
| Home | Phase 2T wires trending destinations/trips, community feed, and published blogs to real APIs with isolated loading/error/empty states |
| Explore | Active on `store/apis/exploreApi`; grid DB-backed after Phase 2D and destination/service detail/reviews usable after Phase 2N |
| Trips list/detail/create/dashboard/upgrade | Active and endpoint-aligned; Traveler upgrade subscription DB-backed after Phase 2S |
| Trip planner workspace | Active; Phase 2V deep-link hydrates route id + real detail/timeline into planner state and fixes mobile action bar accessibility |
| Community/Notifications | Feed/like/follow/trending/blog APIs DB-backed after Phase 2E; blog UI after Phase 2M; Trip comments persisted and active after Phase 2X; notifications usable after Phase 2K |
| Provider dashboard/services/reviews/packages | Active store APIs; services/delete/packages/onboarding/create-edit complete through Phase 2Q; verification documents wired after Phase 2U |
| Provider registration/pending/service create-edit | Registration legal fields plus pending upload/replace/status/download; rejected guard re-entry fixed after Phase 2U |
| Admin dashboard/users/moderation/categories/provider packages | Provider packages has active DB-backed create/edit/status management after Phase 2W |
| Admin promotions | Preview component ton tai nhung khong nam trong active router |

Phase 1 runtime-wire va Phase 2A-2X da hoan tat. Phase 2X da noi Trip comments tu migration/API/YARP den active TripDetails va pass Gateway/DB/Playwright acceptance. Feature phases tam dung de audit CRD backlog va UI toan he thong.

---

## 2. Active Route Map

### 2.1 Public and guest routes

| Path | Guard/Layout | Component | API modules | Verdict |
|---|---|---|---|---|
| `/` | `PublicGuard` + `ConsumerLayout` | `modules/home/Home` | `store/apis/exploreApi`, `store/apis/communityApi` | Phase 2T DB-backed destination/trip/community/blog sections; active CTA and complete loading/error/empty states |
| `/explore` | `PublicGuard` + `ConsumerLayout` | `modules/explore/ExploreWorkspace` | `store/apis/exploreApi` | Route-aligned; backend `/explore` DB-backed for places/services after Phase 2D |
| `/explore/destinations/:id` | `PublicGuard` + `ConsumerLayout` | `modules/explore/DestinationDetails` | `store/apis/exploreApi` | DB-backed detail + destination service list after Phase 2N |
| `/explore/services/:id` | `PublicGuard` + `ConsumerLayout` | `modules/explore/ServiceDetails` | `store/apis/exploreApi` | DB-backed detail/reviews and authenticated review submit after Phase 2N |
| `/community` | `PublicGuard` + `ConsumerLayout` | `modules/community/CommunityWorkspace` | `store/apis/communityApi` | Route-aligned; feed API DB-backed with public trips after Phase 2E |
| `/community/blogs` | `PublicGuard` + `ConsumerLayout` | `modules/community/BlogFeed` | `store/apis/communityApi` | DB-backed published blog list with loading/error/empty states after Phase 2M |
| `/community/blogs/:id` | `PublicGuard` + `ConsumerLayout` | `modules/community/BlogDetails` | `store/apis/communityApi` | DB-backed detail and comments read/create after Phase 2M |
| `/preview/design-system` | `PublicGuard` | `pages/preview/DesignSystemPreview` | None | Dev preview |
| `/auth/login` | `GuestGuard` + `AuthLayout` | `pages/auth/LoginPage` | `store/apis/authApi` | Endpoint exists, login logic real-ish |
| `/auth/register` | `GuestGuard` + `AuthLayout` | `pages/auth/RegisterPage` | `store/apis/authApi` | Endpoint exists, register logic real-ish |
| `/auth/verify-otp` | `GuestGuard` + `AuthLayout` | `pages/auth/OtpVerificationPage` | `store/apis/authApi` | DB-backed OTP verify/resend; displays dev OTP |
| `/auth/forgot-password` | `GuestGuard` + `AuthLayout` | `pages/auth/ForgotPasswordPage` | `store/apis/authApi` | DB-backed reset OTP create; displays dev OTP |
| `/auth/reset-password` | `GuestGuard` + `AuthLayout` | `pages/auth/ResetPasswordPage` | `store/apis/authApi` | DB-backed OTP validation + password reset |

### 2.2 Authenticated traveler routes

| Path | Guard/Layout | Component | API modules | Verdict |
|---|---|---|---|---|
| `/dashboard` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/dashboard/TravelerDashboard` | `store/apis/plannerApi`, `store/apis/communityApi` | DB-backed stats, upcoming trips, and recent notifications after Phase 2P |
| `/trips` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/trip/TripsList` | `store/apis/plannerApi` | Route-aligned, backend DB-backed list |
| `/trips/create` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/trip/TripCreate` | `store/apis/plannerApi` | DB-backed create and real planner redirect after Phase 2O |
| `/trips/:id` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/trip/TripDetails` | `store/apis/plannerApi`, `store/apis/communityApi` | DB detail for owner/shared/public trips plus persisted Trip comments after Phase 2X |
| `/trips/:id/planner` | `AuthenticatedGuard` + `PlannerLayout` | `modules/trip/TripPlannerWorkspace` | `store/apis/plannerApi` | Read/create/timeline/collaborators route-aligned and DB-backed after Phase 2G |
| `/community/blogs/create` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/community/BlogCreate` | `store/apis/communityApi` | DB-backed create flow with validation and redirect to created blog after Phase 2M |
| `/profile` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/profile/Profile` | `store/apis/authApi` | DB-backed profile/password/avatar forms after Phase 2O |
| `/notifications` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/notifications/Notifications` | `store/apis/communityApi` | Route-aligned; DB-backed list/read after Phase 2K |
| `/upgrade` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/upgrade/Upgrade` | `store/apis/travelerPackageApi` | DB-backed catalog/current/history and simulated activation after Phase 2S |
| `/provider/registration` | `AuthenticatedGuard` + `ConsumerLayout` | `modules/provider/ProviderRegistration` | `store/apis/providerApi` | DB-backed registration with existing-status redirect after Phase 2Q |

### 2.3 Premium and AI routes

| Path | Guard/Layout | Component | API modules | Verdict |
|---|---|---|---|---|
| `/ai/planner` | `PremiumGuard` + `ConsumerLayout` | `modules/ai/Planner` | `api/aiApi`, `store/apis/plannerApi` | DB-aware itinerary preview after Phase 2L; accept creates real trip/timeline |
| `/ai/chat` | `PremiumGuard` + `ConsumerLayout` | `modules/ai/Assistant` | `api/aiApi` | DB-aware assistant reply after Phase 2L |

Related active imports:

- `modules/ai/AIRoutePanel.jsx` still imports `api/tripApi`, but is not imported by active router/pages.
- `modules/ai/AIBudgetPanel.jsx` calls `POST /ai/analyze-budget`, backend DB-backed after Phase 2L, but component is not active-routed.

### 2.4 Provider routes

| Path | Guard/Layout | Component | API modules | Verdict |
|---|---|---|---|---|
| `/provider/pending` | `ProviderPendingGuard` + `ConsumerLayout` | `modules/provider/ProviderPending` | `store/apis/providerApi` | DB-backed status polling/redirect after Phase 2Q |
| `/provider/dashboard` | `ProviderGuard` + `ProviderLayout` | `modules/provider/Dashboard` | `store/apis/authApi`, `store/apis/providerApi`, `store/apis/exploreApi` | Route-aligned; stats real-ish after Phase 2B, current package DB-backed after Phase 2I |
| `/provider/services` | `ProviderGuard` + `ProviderLayout` | `modules/provider/ServicesManager` | `store/apis/serviceApi` | Route-aligned to DB-backed `/provider/services`; delete enabled after Phase 2J soft-delete |
| `/provider/services/create` | `ProviderGuard` + `ProviderLayout` | `modules/provider/ProviderServiceCreate` | `store/apis/serviceApi`, `store/apis/exploreApi` | DB-backed create form with real place search after Phase 2Q |
| `/provider/services/:id/edit` | `ProviderGuard` + `ProviderLayout` | `modules/provider/ProviderServiceEdit` | `store/apis/serviceApi`, `store/apis/exploreApi` | DB-backed ownership-scoped edit form after Phase 2Q |
| `/provider/reviews` | `ProviderGuard` + `ProviderLayout` | `modules/provider/ReviewsManager` | `store/apis/providerApi` | Route-aligned; backend reads provider-owned reviews and writes replies |
| `/provider/packages` | `ProviderGuard` + `ProviderLayout` | `modules/provider/Packages` | `store/apis/providerApi` | Route-aligned, DB-backed package list/current/subscribe after Phase 2I |
| `/provider/current-package` | `ProviderGuard` + `ProviderLayout` | `modules/provider/CurrentPackage` | `store/apis/providerApi` | Route-aligned, DB-backed current package after Phase 2I |
| `/provider/package-history` | `ProviderGuard` + `ProviderLayout` | `modules/provider/PackageHistory` | `store/apis/providerApi` | Route-aligned, DB-backed package history after Phase 2I |
| `/provider/payment-history` | `ProviderGuard` + `ProviderLayout` | `modules/provider/PaymentHistory` | `store/apis/providerApi` | Route-aligned, DB-backed payment history after Phase 2I |

Extra route-link issues:

- Known active route-link issues from Phase 0 were fixed in Phase 1.

### 2.5 Admin routes

| Path | Guard/Layout | Component | API modules | Verdict |
|---|---|---|---|---|
| `/admin` | `AdminGuard` + `AdminLayout` | Redirect | None | Redirects to `/admin/dashboard` |
| `/admin/dashboard` | `AdminGuard` + `AdminLayout` | `modules/admin/Dashboard` | `store/apis/adminApi` | Route-aligned; stats DB-backed after Phase 2F |
| `/admin/users` | `AdminGuard` + `AdminLayout` | `modules/admin/UserManager` | `store/apis/adminApi` | Route-aligned; user list/status DB-backed after Phase 2F |
| `/admin/moderation` | `AdminGuard` + `AdminLayout` | `modules/admin/AdminModeration` | `store/apis/adminApi` | DB-backed report resolution and provider approve/reject tabs after Phase 2R |
| `/admin/categories` | `AdminGuard` + `AdminLayout` | `modules/admin/AdminCategories` | `store/apis/adminApi` | DB-backed tag list/create/delete/filter UI after Phase 2R |
| `/admin/provider-packages` | `AdminGuard` + `AdminLayout` | `modules/admin/PackageManager` | `store/apis/adminApi` | DB-backed catalog list/search/create/edit/activate/deactivate after Phase 2W |

Not active in router:

- `modules/admin/PromotionsPreview.jsx`
- `modules/admin/ProviderApproval.jsx`
- `modules/admin/PlacesManager.jsx`
- `modules/admin/BlogModeration.jsx`
- `modules/admin/ServiceModeration.jsx`
- `modules/admin/Reports.jsx`

Several remaining inactive admin components import hooks that are not exported by active `store/apis/adminApi.ts`. They do not break the current build because they are not active chunks, but they will break if routed without API cleanup. `PackageManager.jsx` was rewritten and activated in Phase 2W.

---

## 3. Active Frontend API Endpoint Map

Base:

- `WebClient/src/api/client.ts`: `VITE_API_URL || '/api'`
- Vite dev proxy maps `/api` to `http://localhost:5000`
- `WebClient/src/api/baseApi.ts` uses axios base query, so RTK endpoints like `/auth/login` become `/api/auth/login`

### 3.1 Store APIs

#### `WebClient/src/store/apis/authApi.ts`

| Frontend endpoint | Backend verdict |
|---|---|
| `POST /auth/login` | OK, real-ish |
| `POST /auth/register` | OK, real-ish |
| `POST /auth/verify-otp` | OK, DB-backed OTP validation after Phase 2H |
| `POST /auth/resend-otp` | OK, DB-backed OTP regeneration after Phase 2H |
| `POST /auth/forgot-password` | OK, DB-backed reset OTP generation after Phase 2H |
| `POST /auth/reset-password` | OK, DB-backed OTP validation + password update after Phase 2H |
| `GET /profile` | OK route, real-ish DB read from `NguoiDung` and provider info |
| `PUT /profile` | OK route, real-ish DB update for name/phone |
| `PUT /profile/password` | OK route, BCrypt verify/hash and DB update |
| `POST /profile/avatar` | OK route, avatar URL DB update |

#### `WebClient/src/store/apis/plannerApi.ts`

| Frontend endpoint | Backend verdict |
|---|---|
| `GET /trips` | OK route, DB-backed owner/shared list |
| `GET /trips/{id}` | OK route, DB-backed owner/shared/public detail |
| `POST /trips` | OK route, DB-backed create with frontend aliases |
| `POST /trips/{id}/clone` | OK route, DB-backed graph clone |
| `DELETE /trips/{id}` | OK route, DB-backed soft archive |
| `GET /trips/{id}/timeline` | OK route, DB-backed days/items graph for owner/shared/public trips |
| `PUT /trips/{id}/timeline` | OK route, DB-backed replace timeline for owner or `EDITOR` collaborator |
| `GET /trips/{id}/collaborators` | OK route, DB-backed owner + shared users |
| `POST /trips/{id}/collaborators` | OK route, DB-backed add/update/remove collaborators |
| `GET /traveler/dashboard/stats` | OK route, DB-backed counts |
| `GET /trips/upcoming` | OK route, DB-backed upcoming list |

#### `WebClient/src/store/apis/exploreApi.ts`

| Frontend endpoint | Backend verdict |
|---|---|
| `GET /categories/regions` | OK, real-ish |
| `GET /categories/tags` | OK, DB-backed tag list |
| `GET /explore` | OK, DB-backed places/services grid; empty params return provider promotion badges |
| `GET /destinations/{id}` | OK, real-ish detail |
| `GET /destinations/{id}/services` | OK, DB-backed active services |
| `GET /services/{id}` | OK route, DB-backed service detail |
| `GET /services/{id}/reviews` | OK route, DB-backed service reviews |
| `POST /services/{id}/reviews` | OK route, DB-backed review create |
| `GET /public/home/trending-destinations` | OK route, DB-backed top destinations with Home compatibility aliases |
| `GET /public/home/trending-trips` | OK via Phase 1 specific YARP route; DB-backed public trips after Phase 2E |

#### `WebClient/src/store/apis/communityApi.ts`

| Frontend endpoint | Backend verdict |
|---|---|
| `GET /notifications` | OK route, DB-backed `THONG_BAO` list after Phase 2K |
| `PUT /notifications/{id}/read` | OK route, ownership-checked DB-backed mark-read after Phase 2K |
| `GET /community/feed` | OK route, DB-backed public trip feed after Phase 2E |
| `POST /trips/{id}/like` | OK via Phase 1 specific YARP route; DB-backed trip like toggle after Phase 2E |
| `GET /trips/{id}/comments` | OK via Phase 2X higher-priority Community route; access-checked DB-backed list |
| `POST /trips/{id}/comments` | OK via Phase 2X higher-priority Community route; validation/ownership-checked DB write |
| `POST /trips/{id}/clone` | OK route, DB-backed graph clone after Phase 2C |
| `GET /blogs` | OK route, DB-backed published blogs after Phase 2E |
| `GET /blogs/{id}` | OK route, DB-backed published blog detail after Phase 2E |
| `POST /blogs` | OK route, DB-backed published blog create after Phase 2E |
| `GET /blogs/{id}/comments` | OK route, DB-backed comments after Phase 2E |
| `POST /blogs/{id}/comments` | OK route, DB-backed comment create after Phase 2E |
| `GET /community/top-bloggers` | OK route, DB-backed ranking after Phase 2E |
| `POST /users/{id}/follow` | OK via Phase 1 specific YARP route; DB-backed follow toggle after Phase 2E |

#### `WebClient/src/store/apis/providerApi.ts`

| Frontend endpoint | Backend verdict |
|---|---|
| `POST /provider/register` | OK route, creates minimal pending `MULTI_SERVICE` provider profile |
| `POST /provider/upload-docs` | Multipart PDF/JPG/PNG storage + metadata after Phase 2U; active pending UI |
| `GET /provider/documents/{id}/download` | JWT owner/Admin protected file stream after Phase 2U |
| `GET /provider/status` | Provider status plus current document metadata after Phase 2U |
| `GET /provider/stats` | OK route, real-ish service stats |
| `GET /provider/services` | OK route, real-ish DB list; accepts `category`/`keyword` |
| `POST /provider/services` | OK route, creates provider-owned `DichVu` |
| `PUT /provider/services/{id}` | OK route, ownership-checked DB update |
| `DELETE /provider/services/{id}` | OK route, ownership-checked soft-delete after Phase 2J |
| `GET /provider/reviews` | OK route, provider-owned service reviews |
| `POST /provider/reviews/{id}/reply` | OK route, creates/updates provider review reply |
| `GET /packages/provider` | OK route, DB-backed active provider packages after Phase 2I |
| `GET /provider/packages/current` | OK route, DB-backed current provider package after Phase 2I |
| `GET /provider/packages/history` | OK route, DB-backed package history after Phase 2I |
| `GET /provider/packages/payments` | OK route, DB-backed payment history after Phase 2I |
| `POST /provider/packages/subscribe-simulated` | OK route, DB-backed demo payment subscription after Phase 2I |

#### `WebClient/src/store/apis/adminApi.ts`

| Frontend endpoint | Backend verdict |
|---|---|
| `GET /admin/users` | OK route, DB-backed after Phase 2F |
| `PUT /admin/users/{id}/status` | OK route; Phase 1 fixed caller shape, Phase 2F made it DB-backed |
| `PUT /admin/users/{id}/role` | OK route, DB-backed after Phase 2F |
| `GET /admin/stats` | OK route, DB-backed after Phase 2F |
| `GET /admin/alerts` | OK route, DB-backed after Phase 2F |
| `GET /admin/providers/pending` | OK route, DB-backed after Phase 2R |
| `PUT /admin/providers/{id}/status` | OK route, DB-backed approve/reject after Phase 2R |
| `GET /admin/moderation` | OK route, DB-backed after Phase 2F |
| `POST /admin/moderation/{id}/resolve` | OK route, DB-backed after Phase 2F |
| `GET /admin/categories` | OK route, DB-backed after Phase 2F |
| `POST /admin/categories` | OK route, DB-backed after Phase 2F |
| `DELETE /admin/categories/{id}` | OK route, DB-backed after Phase 2F |
| `GET /admin/provider-packages` | OK route, DB-backed active/inactive catalog after Phase 2W |
| `POST /admin/provider-packages` | OK route, validated DB-backed create after Phase 2W |
| `PUT /admin/provider-packages/{id}` | OK route, validated DB-backed update after Phase 2W |
| `PUT /admin/provider-packages/{id}/status` | OK route, non-destructive activate/deactivate after Phase 2W |

#### `WebClient/src/store/apis/serviceApi.ts`

| Frontend endpoint | Backend verdict |
|---|---|
| `GET /provider/services` | OK route, DB-backed list with `category`/`keyword` query |
| `POST /provider/services` | OK route, DB-backed create |
| `PUT /provider/services/{id}` | OK route, DB-backed ownership-checked update |
| `DELETE /provider/services/{id}` | OK route, DB-backed ownership-checked soft-delete |

This module is actively imported by `/provider/services`. Delete is enabled in the UI after Phase 2J.

### 3.2 Legacy API/router cluster quarantined after Phase 2V

The following files no longer participate in type-check/build/runtime imports and are retained only as `.txt` history:

- `WebClient/src/api_legacy/authApi.ts.txt`
- `WebClient/src/api_legacy/exploreApi.ts.txt`
- `WebClient/src/api_legacy/providerApi.ts.txt`
- `WebClient/src/api_legacy/tripApi.ts.txt`
- `WebClient/src/routes_legacy/index.jsx.txt`
- `WebClient/src/modules_legacy/provider/Analytics.jsx.txt`
- `WebClient/src/modules_legacy/ai/AIRoutePanel.jsx.txt`
- `WebClient/src/modules_legacy/ai/AIBudgetPanel.jsx.txt`
- `WebClient/src/modules_legacy/ai/History.jsx.txt`

Why quarantined:

- They referenced missing `/places/*`, `/auth/me`, `/provider/analytics`, `/trips/{id}/reorder`, and item-level Trip mutation contracts.
- Their only consumers were also absent from `src/router/index.jsx`.
- Active AI keeps verified `src/api/aiApi.ts`; Provider document download keeps verified `src/api/providerDocuments.ts`.

---

## 4. Runtime Findings After Phase 1

### Finding 1 - Resolved: Explore no longer calls missing `/places/*` APIs

Before Phase 1, `/explore` imported both:

- `@/api/exploreApi`
- `@/store/apis/exploreApi`

Phase 1 changed `ExploreWorkspace.jsx` to use `@/store/apis/exploreApi` only. Phase 2D made current `/api/explore` DB-backed for places/services and kept empty-params `/api/explore` returning promoted provider badge data for Provider/Home compatibility.

Phase 2N update:

- Explore grid cards now open real destination/service detail routes.
- Both detail pages use current `store/apis/exploreApi` hooks and expose loading/error/empty states.

### Finding 2 - Resolved: Provider services page no longer calls category CRUD APIs

Before Phase 1, `/provider/services` called:

- `GET /places/{category}/search`
- `POST /places/{category}`
- `PUT /places/{category}/{id}`
- `DELETE /places/{category}/{id}`

Phase 1 changed `store/apis/serviceApi.ts` to call:

- `GET /provider/services`
- `POST /provider/services`
- `PUT /provider/services/{id}`
- `DELETE /provider/services/{id}` after Phase 2J

Phase 2B + Phase 2J update:

- Provider service list/create/update now uses DB-backed `/api/provider/services` with owner checks.
- Provider service delete now uses ownership-checked soft-delete and is enabled in `ServicesManager.jsx`.

### Finding 3 - Resolved for active planner: Trip planner uses current timeline contract

Phase 1 changed `/trips/:id/planner` to import `store/apis/plannerApi`.
Phase 2C implemented the active backend trip contract:

- `GET /trips`
- `POST /trips`
- `GET /trips/{id}`
- `GET /trips/{id}/timeline`
- `PUT /trips/{id}/timeline`
- `DELETE /trips/{id}`
- `POST /trips/{id}/clone`
- `GET /trips/upcoming`
- `GET /traveler/dashboard/stats`

Phase 2G added:

- `GET /trips/{id}/collaborators`
- `POST /trips/{id}/collaborators`
- Shared-user read access for private trips.
- Timeline write access for owner or `EDITOR` collaborator only.

Quarantined `src/api_legacy/tripApi.ts.txt` records the former missing endpoints:

- `PUT /trips/{id}`
- `PUT /trips/{id}/reorder`
- `POST /trips/{id}/locations`
- `DELETE /trips/{id}/items/{itemId}`

The inactive `AIRoutePanel` consumer is also quarantined at `src/modules_legacy/ai/AIRoutePanel.jsx.txt`; neither file participates in build/runtime.

### Finding 4 - Resolved: Community cross-domain paths now have YARP routes

Phase 1 added specific YARP routes for:

- `POST /api/trips/{id}/like` in CommunityService
- `GET /api/public/home/trending-trips` in CommunityService
- `POST /api/users/{id}/follow` in CommunityService

Phase 2E update:

- Backend community services no longer return empty/stub values for feed, trending trips, top bloggers, trip like, follow, blogs, and comments.
- Feed remains trip-based by design; direct Trip comments are resolved in Phase 2X on active TripDetails.

### Finding 5 - Resolved: Admin users mutation now passes the right argument shape

`store/apis/adminApi.ts` expects:

```ts
updateUserStatus({ id, body })
```

Before Phase 1, `modules/admin/UserManager.jsx` called:

```js
lockUser(userId)
```

Phase 1 changed it to call `{ id, body }`. Phase 2F made backend user status updates DB-backed.

### Finding 6 - Resolved: Active router no longer includes page-only placeholders

Known active page placeholders: none after Phase 2T.

Impact:

- Home section-level placeholders are resolved; inactive legacy components still exist but are not imported by active routes.

### Finding 7 - Resolved: Known active links to inactive paths were fixed

Phase 1 fixed:

- `Home.jsx` CTA from `/planner` to `/trips/create`.
- `AI Planner` accept flow from `/planner` to `/trips/{id}/planner`; Phase 2L now creates a real trip/timeline before navigating.
- `ProviderDashboard.jsx` link from `/provider/promotions` to `/provider/packages`.

Remaining:

- Legacy/inactive layouts still contain old links, but they are not used by the active router.

### Finding 8 - Resolved: Provider and Admin package hooks are active

Resolved in Phase 2I:

- `modules/provider/CurrentPackage.jsx`
- `modules/provider/PackageHistory.jsx`
- `modules/provider/PaymentHistory.jsx`

Resolved in Phase 2W:

- `modules/admin/PackageManager.jsx` now imports current catalog hooks only.
- `/admin/provider-packages` is active and build/runtime-tested.
- Admin mutations invalidate both `Admin` and `Provider` tags so Provider pricing refreshes against the same catalog.

`modules/admin/PromotionsPreview.jsx` remains inactive and is not part of the package-management route.

---

## 5. Post Phase 2W Frontend Cleanup Status

Done in Phase 1:

- Replaced active `/explore` legacy imports with current `@/store/apis/exploreApi`.
- Replaced active provider dashboard/reviews/service management calls with current store APIs.
- Fixed gateway routing for community cross-domain actions.
- Fixed `UserManager.jsx` mutation argument shape.
- Fixed known active links to inactive `/planner` and `/provider/promotions` paths.
- Phase 2I exposes active provider package routes for packages/current/history/payments and wires them to DB-backed `store/apis/providerApi` hooks.
- Phase 2J enables provider service delete in `ServicesManager.jsx` via `useDeleteProviderServiceMutation`.
- Phase 2K wires header notifications and `/notifications` page to DB-backed `store/apis/communityApi` hooks.
- Phase 2M wires `/community/blogs`, `/community/blogs/:id`, and `/community/blogs/create` to DB-backed blog/comment hooks with cache invalidation.
- Phase 2N wires destination/service detail routes and service review submit to `store/apis/exploreApi`, and makes Explore grid cards navigate to those routes.
- Phase 2O wires `/profile` and `/trips/create` to current DB-backed auth/planner APIs with cache invalidation and real planner redirect.
- Phase 2P removes hardcoded Traveler dashboard business data and wires stats, upcoming trips, and notification summary to current store APIs.
- Phase 2Q wires provider registration/pending/service create-edit routes to current provider/service/explore APIs and removes the obsolete legacy service form/modal.
- Phase 2R wires admin moderation/categories/provider approval to current APIs and exposes both operational routes in the admin sidebar.
- Phase 2S replaces `/upgrade` with DB-backed Traveler package catalog/current/history/subscription UI and refreshes Premium permissions from profile state.
- Phase 2T replaces Home destination/trip/community/blog placeholders with current API data, active links, and per-section loading/error/empty states.
- Phase 2U wires Provider legal registration, pending document upload/replace/status/download, Admin review/download/approval, and rejected-provider guard re-entry.
- Phase 2V fixes route-param Planner hydration, active control names/page headings, Explore no-key map fallback, and responsive Planner action bar.
- Phase 2V quarantines inactive legacy API/router/component clusters under `.txt` paths.
- Phase 2V full-stack matrix passes `/`, `/explore`, Trips list/detail/planner, Provider dashboard/services, and Admin users at desktop/mobile.
- Phase 2W activates `/admin/provider-packages` with current RTK Query hooks and removes stale package-assignment hook imports from the active manager.
- Phase 2W Playwright creates, edits, and deactivates a package from the active Admin UI at desktop, then verifies the mobile route with no API/console/page/overflow/checked-accessibility failures.
- Phase 2X activates Trip comment list/post on `/trips/:id`, including loading/error/empty states and cache invalidation.
- Phase 2X Playwright verifies desktop comment post and mobile read-back with no API/console/page/overflow/checked-accessibility failures.

Still remaining:

1. Publish the current unfinished CRD workflow backlog in root `README.md`.
2. Audit and normalize the visual/interaction quality of every active route.
3. Resume business work only from end-to-end CRD tasks.

---

## 6. Runtime Definition Of Done

Latest verification run through Phase 2X:

- `npm run type-check` pass
- `npm run build` pass
- `dotnet build ezTravel.slnx` pass
- `dotnet test ezTravel.slnx --no-build` pass
- Full Gateway Provider acceptance passed against isolated LocalDB and physical BookingService storage.
- Playwright active matrix passed all 8 required routes at `1440x900` and `390x844` with no API/console/page/overflow/accessibility failures in the checked rules.
- Phase 2W focused Playwright passed Admin package UI create/edit/deactivate at `1440x900` and route/accessibility/overflow checks at `390x844`.
- Phase 2X focused Playwright passed Trip comment post/read at `1440x900` and `390x844`.
- Configured SQLEXPRESS deployment still needs an external valid Windows/SSMS session; LocalDB acceptance has all three current migrations applied.

Remaining definition for product-level runtime cleanup:

Frontend route/API cleanup is done when:

- Every active route page imports only verified API modules.
- Every active route can load without 404 API calls through `http://localhost:5000`.
- Every button/link in active pages resolves to an active router path.
- Placeholder pages are either completed, hidden, or explicitly marked as under construction in route planning.
- No active component imports hooks that do not exist in the referenced API module.
- `npm run type-check` and `npm run build` still pass after cleanup.
- At least one smoke test covers:
  - `/`
  - `/explore`
  - `/trips`
  - `/trips/:id`
  - `/trips/:id/planner`
  - `/provider/dashboard`
  - `/provider/services`
  - `/admin/users`
  - `/admin/provider-packages`

## 2026-06-22 Runtime Addendum

- `/auth/login` writes only the refresh session to an HttpOnly cookie; the access token remains in memory.
- A full browser reload calls `/api/auth/refresh`, rotates the cookie, hydrates `/api/profile`, and preserves the authenticated route.
- A rotated refresh-token replay returns `401`; logout revokes the current token and removes the cookie.
- `/trips/:id/planner` now loads real Explore resources, supports create/edit/delete plus DnD reorder/move, persists budget/timeline mutations, and restores identical semantic state after reload.
- Playwright verified the Planner interaction loop at `1440x900` and the populated timeline at `390x844` without relevant console/page/API failures.
