# ezTravel

Current source of truth: CRD v3 plus the live DB, backend, Gateway, active router, tests, and runtime evidence.

## Documentation
- **Core Requirements:** `docs/CRD_EZtravel_v3.docx`, `docs/SRS_ezTravel_v1_4.docx`
- **Project Guidelines:** `docs/project/01_PROJECT_CONSTITUTION.md`
- **Screenshots:** `docs/screenshot/` (Latest full system screenshots for all roles and themes)

## End-to-End Definition Of Done

A business workflow is complete only when its schema/migration, service logic, controller contract, Gateway route, active UI, validation/security, automated tests, and desktop/mobile runtime acceptance all pass. A backend-only endpoint or a UI-only screen is not complete.

## Unfinished CRD Business Work

### P0 - Identity And Trip MVP

- [ ] **CRD 3.1.1 / 3.1.3 - Finish production verification deployment:** SMTP delivery, five-failure/15-minute OTP lock, 60-second resend cooldown, and development-only `devOtp` are implemented. Remaining: deploy real SMTP credentials, add purpose/window metadata from `database/migrations/MIGRATION_REQUIREMENTS.md`, and acceptance-test register/reset against the production mail provider.
- [x] **CRD 3.1.2 - JWT session lifecycle MVP:** refresh tokens are hashed and rotated for 14 days in `REFRESH_TOKEN`, delivered through an HttpOnly/Secure/SameSite cookie, revoked by logout, and automatically refreshed by the client; access tokens are held in memory instead of Web Storage. Gateway acceptance rejects replay of a rotated token. Optional token-family audit columns remain documented as hardening.
- [ ] **CRD 3.1.4 - Public profile by slug:** expose `/profile/{slug}` with privacy-safe user activity, validate unique slug changes, and connect follow/community navigation to the real profile route.
- [ ] **CRD 3.2.1-3.2.4 - Finish the remaining Planner mutation loop:** add/edit/delete/move/reorder/time/note/cost changes now autosave through `PUT /trips/{id}/timeline`; budget edits persist through `PUT /trips/{id}`, warnings render immediately, real Explore resources replace mocks, and reload reproduces DB state. Remaining: explicit day deletion/date-range editing plus the complete owner/editor/viewer acceptance matrix.
- [ ] **CRD 3.2.3 - Real map and routing workflow:** render all day markers, calculate route/distance/travel time by transport mode with an approved map/routing provider, synchronize route order with the Planner, and provide a usable no-key fallback.
- [ ] **CRD 3.2.5 - Realtime collaboration:** create share links and invite management for View Only/Editor, add update/remove collaborator contracts, proxy SignalR/WebSocket through Gateway, synchronize edits across browsers, and test authorization plus reconnect/conflict behavior.
- [ ] **CRD 3.2.1 / 3.4.1 - Publish lifecycle:** wire Draft/Public transitions from Planner and Trip detail, validate ownership and publish readiness, make public trips searchable in Community, send moderation state when required, and verify unpublish hides the trip without data loss.

### P1 - Discovery And Community

- [ ] **CRD 3.3.1 - Complete map/list discovery:** support radius and all combined filters, synchronize map markers with list focus/selection, preserve filters in navigation, and verify ranked results on desktop/mobile.
- [ ] **CRD 3.3.2 - Complete destination/service detail:** provide real galleries, provider contact data, structured type-specific details, related public trips, and a working Add to Planner command that persists into the selected trip.
- [ ] **CRD 3.3.3 - Personalized recommendations:** rank destinations and services from saved traveler style/audience/budget plus popularity and package priority, expose an active recommendation surface, and test deterministic fallback behavior.
- [ ] **CRD 3.4.2 - Full review workflow:** add component scores, real image upload/storage, review edit/delete ownership, automatic policy checks, Admin moderation, Provider reply visibility, aggregate recalculation, and active UI acceptance.
- [ ] **CRD 3.4.3 - Complete blog publishing:** upload multiple images, link a trip and place, manage topic tags, save as draft, submit to Admin moderation instead of auto-publishing, notify the author of decisions, and add blog like/save interactions.
- [ ] **CRD 3.4.4 - Complete community interactions:** implement trip save/bookmark and saved-trip UI, personalized followed-user activity feed, blog like/save, and fresh-read count consistency across Home, Community, Trip, and Blog pages.

### P2 - AI And Traveler Freemium

- [ ] **CRD 3.5.1 - Real AI trip generation:** select an approved model provider, ground results in current places/services, generate structured day/service/cost data, validate malformed output, save only after explicit acceptance, and test timeout/quota/fallback paths.
- [ ] **CRD 3.5.2 - Real route optimization:** activate the optimizer UI inside Planner, use coordinates and travel-time constraints, explain the proposed order, require user confirmation, and persist the accepted timeline.
- [ ] **CRD 3.5.3 - Real budget advisor:** activate the budget panel, analyze category allocation from DB costs, return concrete adjustments, and connect accepted suggestions to editable Planner data.
- [ ] **CRD 3.5.4 / 3.1.5 - AI chat and quota enforcement:** allow Free users up to 20,000 tokens/day, keep Premium unlimited while active, include current trip context, record actual token usage, enforce expiry/role changes server-side, and expose remaining quota in UI.
- [ ] **CRD Phase 3 - Subscription payment boundary:** replace unconditional simulated success with the approved subscription payment flow or formally retain simulation only for demo environments; verify callbacks/idempotency/failure/expiry before claiming production completion.

### P3 - Provider Platform

- [ ] **CRD 3.6.2 - Provider business profile/settings:** let an approved Provider update business/contact/logo/banner data with ownership validation, document status history, active route/UI, and fresh profile hydration.
- [ ] **CRD 3.6.2 - Type-specific service completeness:** support hotel rooms/amenities, restaurant menu/hours/capacity, vehicle seats/pricing/coverage, and activity duration/capacity/conditions with images, validation, persistence, edit, hide/show, and detail-page rendering.
- [ ] **CRD 3.6.2 / 3.7.1 - Provider service approval lifecycle:** create new services as Pending, add Admin approve/reject with reason and audit row, notify the Provider, prevent unapproved services from public search, and allow corrected resubmission.
- [ ] **CRD 3.6.3 - Provider analytics:** add event persistence for impressions, bookmarks, Add to Planner, AI appearances, and clicks; calculate CTR by date range; expose line chart/table UI; and verify events from real Traveler actions.
- [ ] **CRD 3.6.4 - Promotion behavior:** apply the exact SearchScore formula consistently to all discovery types, use package priority only as an AI recommendation tiebreaker, handle package expiry automatically, and test ranking before/after activation.
- [ ] **CRD Provider package operations - Admin assignment lifecycle:** add Admin provider subscription lookup/assign/extend/expire actions if retained by product, connect the inactive operational dialogs to current APIs, and preserve payment/subscription audit history.

### P4 - Admin Operations

- [ ] **CRD 3.7.1 - Four moderation queues:** provide separate pending Provider, service, review, and public trip/blog queues with preview/download, approve/reject reason, `DUYET_NOI_DUNG` audit, target status update, notification, filters, and runtime acceptance.
- [ ] **CRD 3.7.2 - Complete user operations:** add server-side search/paging, user activity/detail view, lock/unlock reason, emergency password reset with secure delivery, immutable audit history, and protection against unsafe Admin self-actions.
- [ ] **CRD 3.7.3 - Complete shared catalogs:** manage service types, featured destinations, travel tags, and provinces/cities with reference-safe create/edit/activate/deactivate UI and validation; current Admin Categories covers tags only.
- [ ] **CRD 3.7.4 - Premium coupon management:** design the missing coupon/redemption schema and migrations, implement validity/usage/expiry rules, Admin CRUD UI, subscription checkout application, concurrency-safe redemption, and tests.
- [ ] **CRD 3.7.5 - Operational dashboard:** add date-range filters and real Free-to-Premium conversion, active users, content trends, top destinations/trips, AI usage, Traveler subscription revenue, and Provider package revenue without booking KPIs.
- [ ] **CRD 3.7.5 - Excel/PDF export:** generate the filtered Admin report from server-side data, authorize and stream safe files, expose export controls/progress/errors, and verify the downloaded content.

## Explicitly Excluded By CRD 7.2

Do not add these to the implementation backlog: booking engine, room/seat availability, booking checkout/payment gateway, Provider wallet, Provider withdrawal, commission, OTA settlement/reconciliation, native mobile apps, or chat between Traveler and Provider.

## Current Verification Baseline

- Backend build: 0 warnings.
- Automated tests: 23 unit + 1 integration passing.
- Frontend type-check and production build passing.
- Current DB migrations: Provider verification documents, runtime query performance, and Trip comments.
- Latest completed business slices: Phase 2W Admin provider-package catalog and Phase 2X Trip comments, both accepted through Gateway, LocalDB, and active UI.

## Completed 2026-06-22 - Auth And Planner Slice

- Fixed the Planner runtime crash caused by the `Map` icon shadowing the JavaScript `Map` constructor.
- Added real resource loading, activity editor, timeline deletion/reorder/move reducers, budget editing, debounced persistence, save/error state, budget-overrun warning, and DB-stable reload behavior.
- Fixed Trip cost persistence to use the database's allowed `LUU_TRU`, `AN_UONG`, `THAM_QUAN`, `DI_CHUYEN`, and `KHAC` values.
- Added Trip metadata update and exposed maximum budget separately from estimated cost.
- Added refresh-token rotation/replay rejection/logout, in-memory access-token handling, SMTP OTP delivery adapter, resend cooldown, and 15-minute OTP lock.
- Corrected Auth form, OTP, and checkbox dimensions and verified responsive Login/Planner rendering.

## System Endpoints

### AdminController (Microservices)

- **GET** `/api/admin/users`
- **PUT** `/api/admin/users/{id}/status`
- **PUT** `/api/admin/users/{id}/role`
- **GET** `/api/admin/stats`
- **GET** `/api/admin/alerts`
- **GET** `/api/admin/providers`
- **GET** `/api/admin/providers/pending`
- **PUT** `/api/admin/providers/{id}/status`
- **PUT** `/api/admin/providers/{id}`
- **DELETE** `/api/admin/providers/{id}`
- **GET** `/api/admin/provider-packages`
- **POST** `/api/admin/provider-packages`
- **PUT** `/api/admin/provider-packages/{id}`
- **PUT** `/api/admin/provider-packages/{id}/status`
- **GET** `/api/admin/moderation`
- **POST** `/api/admin/moderation/{id}/resolve`
- **GET** `/api/admin/categories`
- **POST** `/api/admin/categories`
- **PUT** `/api/admin/categories/{id}`
- **DELETE** `/api/admin/categories/{id}`
- **GET** `/api/admin/destinations`
- **POST** `/api/admin/destinations`
- **PUT** `/api/admin/destinations/{id}`
- **DELETE** `/api/admin/destinations/{id}`
- **GET** `/api/admin/blogs`
- **POST** `/api/admin/blogs`
- **PUT** `/api/admin/blogs/{id}`
- **PUT** `/api/admin/blogs/{id}/status`
- **DELETE** `/api/admin/blogs/{id}`
- **GET** `/api/admin/services`
- **PUT** `/api/admin/services/{id}/status`
- **PUT** `/api/admin/services/{id}`
- **DELETE** `/api/admin/services/{id}`
- **POST** `/api/admin/upload`
- **GET** `/api/admin/uploads/{filename}`

### AuthController (Microservices)

- **POST** `/api/auth/login`
- **POST** `/api/auth/refresh`
- **POST** `/api/auth/logout`
- **POST** `/api/auth/register`
- **POST** `/api/auth/verify-otp`
- **POST** `/api/auth/resend-otp`
- **POST** `/api/auth/forgot-password`
- **POST** `/api/auth/reset-password`

### NotificationController (Microservices)

- **GET** `/api/notifications`
- **PUT** `/api/notifications/{id}/read`

### ProfileController (Microservices)

- **GET** `/api/profile`

### ProviderController (Microservices)

- **POST** `/api/provider/register`
- **POST** `/api/provider/upload-docs`
- **GET** `/api/provider/documents/{id:int}/download`
- **GET** `/api/provider/status`
- **GET** `/api/provider/stats`
- **GET** `/api/provider/services`
- **POST** `/api/provider/services`
- **PUT** `/api/provider/services/{id}`
- **DELETE** `/api/provider/services/{id}`
- **GET** `/api/provider/reviews`
- **POST** `/api/provider/reviews/{id}/reply`
- **GET** `/api/packages/provider`
- **GET** `/api/provider/packages/current`
- **GET** `/api/provider/packages/history`
- **GET** `/api/provider/packages/payments`
- **POST** `/api/provider/packages/subscribe-simulated`

### TravelerPackageController (Microservices)

- **GET** `/api/packages/traveler`
- **GET** `/api/packages/traveler/current`
- **GET** `/api/packages/traveler/history`
- **POST** `/api/packages/traveler/subscribe-simulated`

### BlogController (Microservices)

- **GET** `/api/blogs`
- **GET** `/api/blogs/{id}`
- **POST** `/api/blogs`
- **GET** `/api/blogs/{id}/comments`
- **POST** `/api/blogs/{id}/comments`

### CommunityController (Microservices)

- **GET** `/api/community/feed`
- **POST** `/api/trips/{id}/like`
- **GET** `/api/public/home/trending-trips`
- **GET** `/api/community/top-bloggers`
- **POST** `/api/users/{id}/follow`

### TripCommentController (Microservices)

- **GET** `/api/trips/{tripId:int}/comments`
- **POST** `/api/trips/{tripId:int}/comments`

### ExploreController (Microservices)

- **GET** `/api/categories/regions`
- **GET** `/api/categories/tags`
- **GET** `/api/explore`
- **GET** `/api/destinations/{id:int}`
- **GET** `/api/destinations/{id:int}/services`
- **GET** `/api/public/home/trending-destinations`
- **GET** `/api/explore/nearby`

### ServiceController (Microservices)

- **GET** `/api/services/{id:int}`
- **GET** `/api/services/{id:int}/reviews`
- **POST** `/api/services/{id:int}/reviews`

### AIController (Microservices)

- **POST** `/api/ai/generate`
- **POST** `/api/ai/chat`
- **POST** `/api/ai/optimize-route`
- **POST** `/api/ai/analyze-budget`

### TripCollaboratorController (Microservices)

- **GET** `/api/trips/{id:int}/collaborators`
- **POST** `/api/trips/{id:int}/collaborators`

### TripController (Microservices)

- **GET** `/api/trips`
- **POST** `/api/trips`
- **PUT** `/api/trips/{id:int}`
- **DELETE** `/api/trips/{id:int}`
- **GET** `/api/trips/{id:int}`
- **GET** `/api/trips/{id:int}/timeline`
- **PUT** `/api/trips/{id:int}/timeline`
- **POST** `/api/trips/{id:int}/clone`
- **GET** `/api/trips/upcoming`
- **GET** `/api/traveler/dashboard/stats`
