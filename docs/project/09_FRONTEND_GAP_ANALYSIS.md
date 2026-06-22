# 09 – FRONTEND GAP ANALYSIS

**Vai trò**: Senior Solution Architect, Technical Lead, Frontend Architect, Business Analyst  
**Ngôn ngữ**: Tiếng Việt  
**Nguồn chân lý**: CRD_EZtravel_v3.docx → Database → Backend → Frontend  
**Tham chiếu**: 01–08 trong `docs/project/`

---

## 1. MỤC ĐÍCH TÀI LIỆU

Tài liệu này phân tích khoảng cách giữa:

| | Mô tả | Nguồn |
|---|---|---|
| **Current State** | Frontend hiện đang tồn tại trong `WebClient/src/` | `03_CURRENT_REALITY_REPORT.md` |
| **Target State** | Frontend hoàn chỉnh theo CRD | `08_FRONTEND_MASTER_PLAN.md` |

Kết quả phân tích cho phép một lập trình viên mới hiểu:

- Hệ thống đang ở đâu
- Còn thiếu gì
- Sprint nào xử lý phần nào

**Ràng buộc bất biến**:

- Backend LOCKED — frontend phải thích nghi
- Database LOCKED — không tạo bảng mới
- Không mock API, không fake data, không hardcode business data
- Nếu backend không hỗ trợ → Coming Soon / Blocked By Backend / Deferred

---

## 2. PHƯƠNG PHÁP ĐÁNH GIÁ

```
CRD_EZtravel_v3.docx
       │
       ▼
Screen Inventory (08_FRONTEND_MASTER_PLAN.md: 42 màn hình)
       │
       ▼
Frontend hiện tại (03_CURRENT_REALITY_REPORT.md)
       │
       ▼
Gap Analysis (tài liệu này)
       │
       ▼
Sprint Backlog (07_SPRINT_BACKLOG.md: Sprint 4→7)
```

**Quy ước đánh giá**:

| Trạng thái | Định nghĩa |
|---|---|
| **Done** | Màn hình hoạt động đúng: gọi API đúng, render đúng, có Loading/Error/Empty state |
| **Partial** | Màn hình tồn tại nhưng gọi sai endpoint, thiếu state, hoặc render sai dữ liệu |
| **Missing** | Màn hình chưa tồn tại hoặc là stub |
| **Blocked** | CRD yêu cầu nhưng backend không có endpoint → Coming Soon |
| **Deferred** | CRD yêu cầu nhưng đã quyết định hoãn (VD: AI chưa chọn provider) |

---

## 3. TỔNG QUAN MỨC ĐỘ HOÀN THIỆN

| Domain | Tổng màn hình | Done | Partial | Missing | Blocked | Deferred |
|---|---|---|---|---|---|---|
| **Public** | 7 | 2 | 2 | 3 | 0 | 0 |
| **Auth** | 5 | 5 | 0 | 0 | 0 | 0 |
| **Traveler** | 5 | 2 | 1 | 2 | 0 | 0 |
| **Explore** | 3 | 1 | 2 | 0 | 0 | 0 |
| **Community** | 3 | 0 | 1 | 2 | 0 | 0 |
| **AI** | 5 | 0 | 0 | 0 | 0 | 5 |
| **Provider** | 8 | 4 | 2 | 2 | 0 | 0 |
| **Admin** | 12 | 1 | 3 | 5 | 2 | 1 |
| **TỔNG** | **42** | **15** | **11** | **14** | **2** | **6** |

### Tóm tắt

```
Done:     15 / 42 = 35.7%
Partial:  11 / 42 = 26.2%
Missing:  14 / 42 = 33.3%
Blocked:   2 / 42 =  4.8%
Deferred:  6 / 42 = 14.3% (không tính vào tiến độ chính)

Tiến độ thực tế (không tính Deferred + Blocked):
Done / (Tổng - Deferred - Blocked) = 15 / 34 = 44.1%
```

---

## 4. GAP ANALYSIS THEO DOMAIN

### 4.1 PUBLIC DOMAIN

#### Đã hoàn thành (Done)
| Màn hình | Bằng chứng |
|---|---|
| P-01 Home | `modules/home/Home.tsx` — hiển thị trending, gợi ý, NCC nổi bật |
| P-02 ExploreWorkspace | `modules/explore/ExploreWorkspace.tsx` — tìm kiếm, grid, map |

#### Chưa hoàn thành (Partial)
| Màn hình | Hiện trạng | Thiếu |
|---|---|---|
| P-03 ExploreDetail | Trang chi tiết địa điểm cơ bản | Thiếu gallery ảnh đầy đủ, giá tham khảo, ReviewSummary breakdown, nút "Thêm vào lịch trình" |
| P-07 PublicProfile | Không tồn tại riêng — profile hiện nhúng trong Auth layout | Thiếu trang public profile với lịch trình đã chia sẻ, blog, thống kê |

#### Thiếu hoàn toàn (Missing)
| Màn hình | CRD | Gap | Sprint |
|---|---|---|---|
| P-04 CommunityFeed | §3.4.1 | Không có route `/community`. Feed hiện nhúng một phần trong Explore | Sprint 5 |
| P-05 BlogDetail | §3.4.3 | Không có route `/community/blog/:id` | Sprint 5 |
| P-06 TripDetail (public) | §3.4.1 | Không có route `/community/trip/:id` — lịch trình public chưa có trang riêng | Sprint 5 |

#### Phụ thuộc Backend
Không có — tất cả API cần thiết (feeds, reviews, places) đều tồn tại.

---

### 4.2 AUTH DOMAIN

#### Đã hoàn thành (Done)
| Màn hình | Bằng chứng |
|---|---|
| A-01 Login | `modules/auth/Login.tsx` — `POST /auth/login` ✅ |
| A-02 Register | `modules/auth/Register.tsx` — `POST /auth/register` ✅ |
| A-03 ForgotPassword | `modules/auth/ForgotPassword.tsx` ✅ |
| A-04 OtpVerification | `modules/auth/OtpVerification.tsx` — `POST /auth/verify-otp` ✅ |
| A-05 ResetPassword | `modules/auth/ResetPassword.tsx` ✅ |

#### Chưa hoàn thành: Không có
#### Thiếu hoàn toàn: Không có
#### Phụ thuộc Backend: Không có

**Kết luận**: Auth Domain hoàn thành 100%.

---

### 4.3 TRAVELER DOMAIN

#### Đã hoàn thành (Done)
| Màn hình | Bằng chứng |
|---|---|
| T-02 MyTrips (tương đương) | `modules/trip/TripPlannerWorkspace.tsx` — liệt kê và quản lý lịch trình |
| T-03 TripPlanner | `modules/trip/TripPlannerWorkspace.tsx` — DnD, budget, clone, bản đồ |

#### Chưa hoàn thành (Partial)
| Màn hình | Hiện trạng | Thiếu |
|---|---|---|
| T-05 MyProfile | Profile nhúng trong Auth (`GET /auth/me`). Thiếu trang chỉnh sửa riêng | Thiếu AvatarUpload, ChangePasswordForm, SlugPreview |

#### Thiếu hoàn toàn (Missing)
| Màn hình | CRD | Gap | Sprint |
|---|---|---|---|
| T-01 TravelerDashboard | §3.2 | Không có route `/dashboard` riêng cho Traveler. Hiện chuyển thẳng vào Planner | Sprint 7 |
| T-04 SavedItems | §3.4.4 | Không có route `/saved`. Bảng `LUU_LICH_TRINH` tồn tại nhưng chưa có UI | Sprint 5 |

#### Phụ thuộc Backend
- `CollaborationBar` (SignalR) → Blocked By Backend (không có SignalR Hub)
- `InviteModal` (share trip) → Blocked By Backend (không có share endpoint)

---

### 4.4 EXPLORE DOMAIN

#### Đã hoàn thành (Done)
| Màn hình | Bằng chứng |
|---|---|
| P-02 ExploreWorkspace | `modules/explore/ExploreWorkspace.tsx` — search, grid, map, NCC promoted |

#### Chưa hoàn thành (Partial)
| Màn hình | Hiện trạng | Thiếu |
|---|---|---|
| P-03 ExploreDetail | Chi tiết địa điểm cơ bản | ImageGallery swipeable, PriceInfo, ContactInfo, ReviewSummary breakdown, RelatedTrips, AddToPlannerButton |
| Reviews (tích hợp) | Review hiển thị cơ bản trong Explore | WriteReviewForm hoàn chỉnh, SubRatings, ReviewImageUpload, ProviderReply |

#### Thiếu hoàn toàn: Không có (trang đều tồn tại ở mức cơ bản)
#### Phụ thuộc Backend: Không có — API reviews và places đều tồn tại.

---

### 4.5 COMMUNITY DOMAIN

#### Đã hoàn thành (Done): Không có

#### Chưa hoàn thành (Partial)
| Màn hình | Hiện trạng | Thiếu |
|---|---|---|
| CommunityFeed (partial) | Feed nhúng trong Explore qua `GET /feeds` | Trang riêng `/community`, tabs (Lịch trình / Blog / Xu hướng), LikeButton, SaveButton, CommentSection |

#### Thiếu hoàn toàn (Missing)
| Màn hình | CRD | Gap | Sprint |
|---|---|---|---|
| P-05 BlogDetail | §3.4.3 | Không có trang chi tiết blog | Sprint 5 |
| P-06 TripDetail (public) | §3.4.1 | Không có trang xem lịch trình công khai read-only | Sprint 5 |

#### Phụ thuộc Backend
- Blog CRUD: Backend có `GET /feeds` nhưng không rõ endpoint tạo/sửa blog → Kiểm tra `CommunityService`
- Trip sharing: Backend không có endpoint đặt visibility → Blocked By Backend

---

### 4.6 AI DOMAIN

#### Toàn bộ DEFERRED

| Màn hình | CRD | Hiện trạng | Lý do |
|---|---|---|---|
| AI-01 AIChat | §3.5.4 | `modules/ai/Assistant.tsx` — UI skeleton tồn tại | Chưa chọn AI Provider |
| AI-02 AITripGenerator | §3.5.1 | `modules/ai/Planner.tsx` — UI skeleton tồn tại | Chưa chọn AI Provider |
| AI-03 AIRouteOptimizer | §3.5.2 | `modules/ai/AIRoutePanel.tsx` — UI skeleton tồn tại | Chưa chọn AI Provider |
| AI-04 AIBudgetAdvisor | §3.5.3 | `modules/ai/AIBudgetPanel.tsx` — UI skeleton tồn tại | Chưa chọn AI Provider |
| AI-05 AIHistory | §3.5 | `modules/ai/History.tsx` — UI skeleton tồn tại | Chưa chọn AI Provider |

**Lưu ý**: UI skeleton đã tồn tại cho 5/5 trang. Khi chọn AI Provider, chỉ cần wire API.

---

### 4.7 PROVIDER DOMAIN

#### Đã hoàn thành (Done)
| Màn hình | Bằng chứng |
|---|---|
| SP-01 ProviderDashboard | `modules/provider/Dashboard.tsx` — badge từ `promoInfo.badgeType`, KPI từ dashboard API |
| SP-04 ProviderPackages | `modules/provider/Packages.tsx` — `GET /provider/packages`, `POST /provider/register-package` |
| SP-05 ProviderPromotions (cơ bản) | `modules/provider/Promotions.tsx` — badge, promotion info |
| (PackageHistory + PaymentHistory) | `modules/provider/PackageHistory.tsx`, `PaymentHistory.tsx` — API đúng |

#### Chưa hoàn thành (Partial)
| Màn hình | Hiện trạng | Thiếu |
|---|---|---|
| SP-05 ProviderPromotions | Hiển thị promotion info cơ bản | Thiếu 5 chỉ số CRD (Impressions, Bookmarks, Planner adds, AI, CTR), biểu đồ, DateRangePicker |
| SP-07 ProviderProfile | Profile nhúng trong Provider layout | Thiếu trang chỉnh sửa hồ sơ doanh nghiệp riêng (logo, mô tả, liên hệ) |

#### Thiếu hoàn toàn (Missing)
| Màn hình | CRD | Gap | Sprint |
|---|---|---|---|
| SP-02 ServicesManager | §3.6.2 | Stub "Coming Soon" (701 bytes). Backend có sẵn CRUD API 4 loại dịch vụ | Sprint 4 |
| SP-03 ServiceForm | §3.6.2 | Không tồn tại. Cần form tạo/sửa dịch vụ theo 4 loại | Sprint 4 |
| SP-06 ProviderReviews | SP008 | Không có trang NCC xem + phản hồi review | Sprint 5 |
| SP-08 ProviderRegistration | SP001 | Legacy flow — cần trang đăng ký NCC chính thức | Sprint 4 |

#### Phụ thuộc Backend
- Analytics 5 chỉ số (Impressions, Bookmarks, etc.) → Backend chỉ trả `totalServices`, `avgRating` → Blocked By Backend cho phần analytics nâng cao

---

### 4.8 ADMIN DOMAIN

#### Đã hoàn thành (Done)
| Màn hình | Bằng chứng |
|---|---|
| AD-09 CategoryManager | `modules/admin/PlacesManager.tsx` — CRUD tỉnh/thành, `api/places/categories/*` |

#### Chưa hoàn thành (Partial)
| Màn hình | Hiện trạng | Thiếu |
|---|---|---|
| AD-01 AdminDashboard | `modules/admin/Dashboard.tsx` — render 8+ KPI nhưng backend chỉ trả 2 | Wire đúng `GET /admin/dashboard`, ẩn KPI backend chưa cung cấp |
| AD-02 UserManager | `modules/admin/UserManager.tsx` — gọi `PUT /admin/users/{id}/status` (sai) | Wire đúng `GET /admin/users` + `POST /admin/users/{id}/lock` |
| AD-04 ProviderModeration | `modules/admin/ProviderApproval.tsx` — gọi `GET /admin/providers` (sai) | Wire đúng `GET /providers/pending` + `POST /providers/{id}/approve\|reject` |

#### Thiếu hoàn toàn (Missing)
| Màn hình | CRD | Gap | Sprint |
|---|---|---|---|
| AD-03 ModerationHub | §3.7.1 | Không tồn tại — cần trang tổng quan 4 luồng kiểm duyệt | Sprint 6 |
| AD-05 ServiceModeration | §3.7.1 | `modules/admin/ServiceModeration.tsx` gọi endpoint sai — cần rewrite | Sprint 6 |
| AD-06 ReviewModeration | §3.7.1 | Không tồn tại | Sprint 6 |
| AD-07 BlogModeration | §3.7.1 | `modules/admin/BlogModeration.tsx` gọi endpoint sai — cần rewrite | Sprint 6 |
| AD-11 AdminPackageManager | §3.6.4 | Stub 11 dòng. Backend + RTK hooks đầy đủ. Chỉ cần build UI | Sprint 6 |

#### Blocked By Backend
| Màn hình | CRD | Lý do |
|---|---|---|
| AD-05 ServiceModeration | §3.7.1 | Backend không có endpoint admin moderation cho dịch vụ → Coming Soon |
| AD-06 ReviewModeration | §3.7.1 | Backend không có endpoint admin moderation cho review → Coming Soon |
| AD-07 BlogModeration | §3.7.1 | Backend không có endpoint admin moderation cho blog → Coming Soon |
| AD-08 TripModeration | §3.7.1 | Backend không có endpoint admin moderation cho trip → Coming Soon |

#### Deferred
| Màn hình | CRD | Lý do |
|---|---|---|
| AD-10 CouponManager | §3.7.4 | Database không có bảng `MA_GIAM_GIA`, backend không có endpoint → Deferred |
| AD-12 ReportsExport | §3.7.5 | Backend không có export endpoint → Deferred |

---

## 5. GAP ANALYSIS THEO SCREEN

| # | Screen | CRD | Current Route | Trạng thái | Gap | Sprint |
|---|---|---|---|---|---|---|
| P-01 | Home | §3.3.3 | `/` | **Done** | — | — |
| P-02 | ExploreWorkspace | §3.3.1 | `/explore` | **Done** | — | — |
| P-03 | ExploreDetail | §3.3.2 | `/explore` (partial) | **Partial** | Thiếu gallery, giá, review breakdown, AddToPlanner | Sprint 5 |
| P-04 | CommunityFeed | §3.4.1 | Không có | **Missing** | Trang riêng `/community` chưa tồn tại | Sprint 5 |
| P-05 | BlogDetail | §3.4.3 | Không có | **Missing** | Route `/community/blog/:id` chưa tồn tại | Sprint 5 |
| P-06 | TripDetail (public) | §3.4.1 | Không có | **Missing** | Route `/community/trip/:id` chưa tồn tại | Sprint 5 |
| P-07 | PublicProfile | §3.1.4 | Không có | **Missing** | Route `/profile/:slug` chưa tồn tại | Sprint 7 |
| A-01 | Login | §3.1.2 | `/login` | **Done** | — | — |
| A-02 | Register | §3.1.1 | `/register` | **Done** | — | — |
| A-03 | ForgotPassword | §3.1.3 | `/forgot-password` | **Done** | — | — |
| A-04 | OtpVerification | §3.1.1 | `/verify-otp` | **Done** | — | — |
| A-05 | ResetPassword | §3.1.3 | `/reset-password` | **Done** | — | — |
| T-01 | TravelerDashboard | §3.2 | Không có | **Missing** | Route `/dashboard` chưa tồn tại | Sprint 7 |
| T-02 | MyTrips | §3.2.1 | `/planner` (merged) | **Done** | Merged vào TripPlanner | — |
| T-03 | TripPlanner | §3.2.2-5 | `/planner/:id` | **Done** | DnD, budget, map hoạt động | — |
| T-04 | SavedItems | §3.4.4 | Không có | **Missing** | Route `/saved` chưa tồn tại | Sprint 5 |
| T-05 | MyProfile | §3.1.4 | Không có riêng | **Partial** | Profile nhúng Auth, thiếu edit form riêng | Sprint 7 |
| AI-01 | AIChat | §3.5.4 | `/ai` | **Deferred** | UI skeleton có, chưa chọn AI Provider | — |
| AI-02 | AITripGenerator | §3.5.1 | `/ai/planner` | **Deferred** | UI skeleton có | — |
| AI-03 | AIRouteOptimizer | §3.5.2 | `/ai` (panel) | **Deferred** | UI skeleton có | — |
| AI-04 | AIBudgetAdvisor | §3.5.3 | `/ai` (panel) | **Deferred** | UI skeleton có | — |
| AI-05 | AIHistory | §3.5 | `/ai/history` | **Deferred** | UI skeleton có | — |
| SP-01 | ProviderDashboard | §3.6.3 | `/provider/dashboard` | **Done** | Badge từ badgeType ✅ | — |
| SP-02 | ServicesManager | §3.6.2 | `/provider/services` | **Missing** | Stub Coming Soon | Sprint 4 |
| SP-03 | ServiceForm | §3.6.2 | Không có | **Missing** | Chưa tồn tại | Sprint 4 |
| SP-04 | ProviderPackages | §3.6.4 | `/provider/packages` | **Done** | — | — |
| SP-05 | ProviderPromotions | §3.6.3 | `/provider/promotions` | **Partial** | Thiếu 5 chỉ số analytics | Sprint 5 |
| SP-06 | ProviderReviews | SP008 | Không có | **Missing** | Chưa tồn tại | Sprint 5 |
| SP-07 | ProviderProfile | SP002 | Không có riêng | **Partial** | Profile nhúng, thiếu edit business info | Sprint 4 |
| SP-08 | ProviderRegistration | SP001 | Legacy | **Partial** | Legacy flow, cần chuẩn hóa | Sprint 4 |
| AD-01 | AdminDashboard | §3.7.5 | `/admin` | **Partial** | Render sai KPI (8 fields vs backend 2 fields) | Sprint 4 |
| AD-02 | UserManager | §3.7.2 | `/admin/users` | **Partial** | Gọi sai endpoint | Sprint 4 |
| AD-03 | ModerationHub | §3.7.1 | Không có | **Missing** | Chưa tồn tại | Sprint 6 |
| AD-04 | ProviderModeration | §3.7.1 | `/admin/providers` | **Partial** | Gọi sai endpoint | Sprint 4 |
| AD-05 | ServiceModeration | §3.7.1 | `/admin/services` | **Blocked** | Backend không có endpoint | Sprint 6 |
| AD-06 | ReviewModeration | §3.7.1 | Không có | **Blocked** | Backend không có endpoint | Sprint 6 |
| AD-07 | BlogModeration | §3.7.1 | `/admin/blogs` | **Blocked** | Backend không có endpoint | Sprint 6 |
| AD-08 | TripModeration | §3.7.1 | Không có | **Blocked** | Backend không có endpoint | Sprint 6 |
| AD-09 | CategoryManager | §3.7.3 | `/admin/places` | **Done** | — | — |
| AD-10 | CouponManager | §3.7.4 | Không có | **Deferred** | DB + Backend thiếu | — |
| AD-11 | AdminPackageManager | §3.6.4 | `/admin/provider-packages` | **Missing** | Stub. Backend + RTK hooks sẵn | Sprint 6 |
| AD-12 | ReportsExport | §3.7.5 | `/admin/reports` | **Deferred** | Backend không có export endpoint | — |

---

## 6. GAP ANALYSIS THEO COMPONENT

| Component (Target) | Hiện trạng | Thiếu gì | Sprint |
|---|---|---|---|
| `PartnerBadge` | ✅ `components/ui/PartnerBadge.tsx` — render từ `badgeType` | — | Done |
| `ExploreMap` | ✅ Leaflet map trong ExploreWorkspace | Đồng bộ click marker ↔ scroll card chưa hoàn hảo | Sprint 5 |
| `ExploreCard` | ✅ Hoạt động | Thiếu badge NCC trên card | Sprint 5 |
| `TripPlanner (DnD)` | ✅ DnD hoạt động, budget, clone, reorder | Thiếu CollaborationBar (Blocked), ServiceSlot template | — |
| `BudgetPanel` | ✅ Hoạt động | Thiếu BudgetAlert (cảnh báo đỏ vượt ngân sách) | Sprint 7 |
| `SearchPanel` (Planner) | ✅ Hoạt động | — | Done |
| `ImageGallery` | ❌ Chưa tồn tại | Gallery ảnh swipeable cho ExploreDetail | Sprint 5 |
| `WriteReviewForm` | ❌ Chưa tồn tại | Form viết review: sao, text, upload ảnh | Sprint 5 |
| `StarRating` | ⚠️ Hiển thị sao read-only | Thiếu mode write (chọn sao) | Sprint 5 |
| `CommentSection` | ⚠️ Cơ bản | Thiếu reply, pagination | Sprint 5 |
| `CommunityFeed` | ❌ Chưa tồn tại riêng | Trang feed cộng đồng + tabs | Sprint 5 |
| `BlogContent` | ❌ Chưa tồn tại | Rich text renderer cho blog | Sprint 5 |
| `TripTimeline` (read-only) | ❌ Chưa tồn tại | Timeline read-only cho trip public | Sprint 5 |
| `ServiceTable` | ❌ Chưa tồn tại | Bảng dịch vụ NCC (4 tabs, CRUD, ẩn/hiện) | Sprint 4 |
| `ServiceForm` (4 loại) | ❌ Chưa tồn tại | Form đặc thù: Hotel/Restaurant/Vehicle/Activity | Sprint 4 |
| `AdminDashboard KPI` | ⚠️ Render sai | Wire đúng 2 fields từ backend, ẩn phần còn lại | Sprint 4 |
| `UserTable` (Admin) | ⚠️ Gọi sai endpoint | Wire đúng `GET /admin/users` + `POST /.../lock` | Sprint 4 |
| `PendingProviderList` | ⚠️ Gọi sai endpoint | Wire đúng `GET /providers/pending` | Sprint 4 |
| `ApproveButton` / `RejectWithReasonDialog` | ⚠️ Gọi sai endpoint | Wire đúng `POST /providers/{id}/approve\|reject` | Sprint 4 |
| `AdminPackageTable` | ❌ Stub | Wire đến `store/apis/adminApi.ts` (hooks sẵn) | Sprint 6 |
| `PromotionsPreviewPanel` | ❌ Stub | Wire đến `useGetAdminPromotionsPreviewQuery` (hook sẵn) | Sprint 6 |
| `ModerationCard` | ❌ Chưa tồn tại | Thẻ tổng quan kiểm duyệt (pending count) | Sprint 6 |
| `DataTable` (shared) | ❌ Chưa tồn tại | Bảng dữ liệu chung: pagination, sort, filter, responsive | Sprint 4 |
| `Modal` (shared) | ✅ Tồn tại | — | Done |
| `Drawer` (shared) | ✅ `components/ui/sheet.tsx` | — | Done |
| `Toast` (shared) | ✅ `components/ui/toast.tsx` | — | Done |
| `DateRangePicker` | ❌ Chưa tồn tại | Cho analytics, reports | Sprint 5 |
| `MapLocationPicker` | ❌ Chưa tồn tại | Chọn vị trí trên map cho ServiceForm | Sprint 4 |

---

## 7. GAP ANALYSIS THEO API

### 7.1 API Backend → Frontend Integration

| API | Route | Backend | Frontend | Trạng thái |
|---|---|---|---|---|
| Auth Register | `POST /auth/register` | ✅ | ✅ `api/authApi.ts` | **Implemented** |
| Auth Login | `POST /auth/login` | ✅ | ✅ `api/authApi.ts` | **Implemented** |
| Auth Refresh | `POST /auth/refresh-token` | ✅ | ✅ `api/authApi.ts` | **Implemented** |
| Auth OTP | `POST /auth/verify-otp` | ✅ | ✅ `api/authApi.ts` | **Implemented** |
| Auth Me | `GET /auth/me` | ✅ | ✅ `api/authApi.ts` | **Implemented** |
| Trips CRUD | `api/trips/*` (13 endpoints) | ✅ | ✅ `api/tripApi.ts` | **Implemented** |
| Places Search | `GET /places/search` | ✅ | ✅ `api/exploreApi.ts` | **Implemented** |
| Places CRUD | `api/places/*` | ✅ | ✅ `api/exploreApi.ts` | **Implemented** |
| Hotels Search | `GET /places/hotels/search` | ✅ | ✅ `api/exploreApi.ts` | **Implemented** |
| Restaurants Search | `GET /places/restaurants/search` | ✅ | ✅ `api/exploreApi.ts` | **Implemented** |
| Activities Search | `GET /places/activities/search` | ✅ | ✅ `api/exploreApi.ts` | **Implemented** |
| Vehicles Search | `GET /places/vehicles/search` | ✅ | ✅ `api/exploreApi.ts` | **Implemented** |
| Hotels CRUD | `POST/PUT/DELETE /places/hotels/*` | ✅ | ❌ | **Missing** |
| Restaurants CRUD | `POST/PUT/DELETE /places/restaurants/*` | ✅ | ❌ | **Missing** |
| Activities CRUD | `POST/PUT/DELETE /places/activities/*` | ✅ | ❌ | **Missing** |
| Vehicles CRUD | `POST/PUT/DELETE /places/vehicles/*` | ✅ | ❌ | **Missing** |
| Categories CRUD | `api/places/categories/*` | ✅ | ✅ `api/exploreApi.ts` | **Implemented** |
| Feeds | `GET /feeds` | ✅ | ⚠️ Partial (nhúng) | **Partial** |
| Like Trip | `POST /feeds/{id}/like` | ✅ | ⚠️ Partial | **Partial** |
| Comment Trip | `POST /feeds/{id}/comment` | ✅ | ⚠️ Partial | **Partial** |
| Get Comments | `GET /feeds/{id}/comments` | ✅ | ⚠️ Partial | **Partial** |
| Post Review | `POST /reviews` | ✅ | ⚠️ Partial | **Partial** |
| Get Place Reviews | `GET /reviews/place/{id}` | ✅ | ⚠️ Partial | **Partial** |
| Get Service Reviews | `GET /reviews/service/{id}` | ✅ | ❌ | **Missing** |
| Provider GetById | `GET /providers/{id}` | ✅ | ✅ | **Implemented** |
| Provider Dashboard | `GET /providers/user/{userId}/dashboard` | ✅ | ✅ | **Implemented** |
| Provider Create | `POST /providers` | ✅ | ⚠️ Legacy | **Partial** |
| Provider Update | `PUT /providers/{id}` | ✅ | ⚠️ Legacy | **Partial** |
| Provider Featured | `GET /providers/featured` | ✅ | ✅ `store/apis/exploreApi.ts` | **Implemented** |
| Provider Explore Promoted | `GET /providers/explore-promoted` | ✅ | ✅ `store/apis/exploreApi.ts` | **Implemented** |
| Provider Pending | `GET /providers/pending` | ✅ | ❌ Frontend gọi sai URL | **Missing** |
| Provider Approve | `POST /providers/{id}/approve` | ✅ | ❌ Frontend gọi sai URL | **Missing** |
| Provider Reject | `POST /providers/{id}/reject` | ✅ | ❌ Frontend gọi sai URL | **Missing** |
| Provider Packages | `GET /provider/packages` | ✅ | ✅ `store/apis/providerApi.ts` | **Implemented** |
| Current Package | `GET /provider/current-package` | ✅ | ✅ | **Implemented** |
| Package History | `GET /provider/package-history` | ✅ | ✅ | **Implemented** |
| Register Package | `POST /provider/register-package` | ✅ | ✅ | **Implemented** |
| Payment History | `GET /provider/payment-history` | ✅ | ✅ | **Implemented** |
| Admin Users | `GET /admin/users` | ✅ | ⚠️ Gọi đúng URL | **Partial** |
| Admin Lock User | `POST /admin/users/{id}/lock` | ✅ | ❌ Frontend gọi sai | **Missing** |
| Admin Dashboard | `GET /admin/dashboard` | ✅ | ⚠️ Field mismatch | **Partial** |
| Admin Pkg Providers | `GET /admin/provider-packages/providers` | ✅ | ✅ RTK hook sẵn, UI stub | **Partial** |
| Admin Pkg Packages | `GET /admin/provider-packages/packages` | ✅ | ✅ RTK hook sẵn, UI stub | **Partial** |
| Admin Assign | `POST /admin/provider-packages/assign` | ✅ | ✅ RTK hook sẵn, UI stub | **Partial** |
| Admin Extend | `POST /admin/provider-packages/extend` | ✅ | ✅ RTK hook sẵn, UI stub | **Partial** |
| Admin Expire | `POST /admin/provider-packages/expire` | ✅ | ✅ RTK hook sẵn, UI stub | **Partial** |
| Admin Statistics | `GET /admin/provider-packages/statistics` | ✅ | ✅ RTK hook sẵn, UI stub | **Partial** |
| Admin Promotions Preview | `GET /admin/provider-packages/promotions-preview` | ✅ | ✅ RTK hook sẵn, UI stub | **Partial** |

### 7.2 Tổng hợp

| Trạng thái | Số lượng |
|---|---|
| **Implemented** | 26 |
| **Partial** | 15 |
| **Missing** | 8 |
| **Blocked** | 0 (API tồn tại nhưng frontend chưa gọi) |
| **Tổng API backend** | 49 |

---

## 8. GAP ANALYSIS THEO DATABASE

| Bảng | Frontend sử dụng | Chưa sử dụng | Ghi chú |
|---|---|---|---|
| `NGUOI_DUNG` | ✅ Auth, Admin Users | — | |
| `OTP_XAC_THUC` | ✅ OTP Verification | — | |
| `REFRESH_TOKEN` | ✅ Auth auto-refresh | — | |
| `LICH_TRINH` | ✅ TripPlanner | — | |
| `NGAY_LICH_TRINH` | ✅ TripPlanner | — | |
| `DIA_DIEM_LICH_TRINH` | ✅ TripPlanner | — | |
| `DICH_VU_LICH_TRINH` | ✅ TripPlanner | — | |
| `CHI_PHI_DICH_VU_LICH_TRINH` | ✅ Budget Panel | — | |
| `CHIA_SE_LICH_TRINH` | — | ❌ | Backend LOCKED — không có share endpoint |
| `LUU_LICH_TRINH` | — | ❌ | SavedItems page chưa tồn tại |
| `THICH_LICH_TRINH` | ⚠️ Partial (like feed) | ⚠️ | CommunityFeed chưa tách riêng |
| `LICH_SU_CLONE` | ✅ Clone trip | — | |
| `DIA_DIEM` | ✅ Explore | — | |
| `ANH_DIA_DIEM` | ⚠️ Thumbnail only | ⚠️ | ImageGallery chưa hoàn thiện |
| `TINH_THANH` | ✅ Explore filter | — | |
| `TAG` | ✅ Explore filter | — | |
| `DIA_DIEM_TAG` | ✅ Explore filter | — | |
| `DICH_VU` | ⚠️ Explore search | ⚠️ | ServicesManager (provider) chưa có |
| `ANH_DICH_VU` | — | ❌ | Service image gallery chưa hiển thị |
| `DANH_GIA` | ⚠️ Review basic | ⚠️ | WriteReviewForm chưa hoàn thiện |
| `ANH_DANH_GIA` | — | ❌ | ReviewImageUpload chưa có |
| `PHAN_HOI_DANH_GIA` | — | ❌ | ProviderReply chưa có |
| `BAI_VIET` | ⚠️ Feed partial | ⚠️ | BlogDetail page chưa có |
| `ANH_BAI_VIET` | — | ❌ | Blog gallery chưa có |
| `BINH_LUAN_BAI_VIET` | — | ❌ | BlogComments chưa có |
| `THICH_BAI_VIET` | — | ❌ | BlogLikeButton chưa có |
| `BAO_CAO_NOI_DUNG` | — | ❌ | Report content chưa có UI |
| `DUYET_NOI_DUNG` | — | ❌ | Moderation UI chưa hoàn thiện |
| `THEO_DOI_NGUOI_DUNG` | — | ❌ | Follow chưa triển khai |
| `THONG_BAO` | — | ❌ | Notification chưa triển khai |
| `NHA_CUNG_CAP` | ✅ Provider portal | — | |
| `GOI_DICH_VU_NCC` | ✅ Provider packages | — | |
| `DANG_KY_GOI_NCC` | ✅ Provider packages | — | |
| `THANH_TOAN_NCC` | ✅ Payment history | — | |
| `GOI_DICH_VU` | — | ❌ | Traveler Subscription — Deferred |
| `DANG_KY_GOI` | — | ❌ | Traveler Subscription — Deferred |
| `LICH_SU_AI` | — | ❌ | AI — Deferred |

### Tổng hợp

| Trạng thái | Số bảng |
|---|---|
| Frontend sử dụng đầy đủ | 19 |
| Frontend sử dụng một phần | 7 |
| Frontend chưa sử dụng | 11 |
| **Tổng** | **37** |

---

## 9. PHÂN TÍCH RỦI RO

### Rủi ro cao

| # | Mô tả | Tác động | Khả năng | Giảm thiểu |
|---|---|---|---|---|
| R-01 | **Admin pages gọi 10+ endpoint không tồn tại** — toàn bộ Admin Panel (trừ PlacesManager) không hoạt động khi kết nối backend thật | Admin không thể quản lý hệ thống | Chắc chắn xảy ra | Sprint 4: wire đúng endpoint |
| R-02 | **Hai tầng API layer** (`src/api/` vs `src/store/apis/`) — Admin pages dùng layer cũ gọi sai endpoint | Bug ẩn, endpoint shadowing, regression khi sửa | Cao | Sprint 4: US-4.5 consolidate API layer |
| R-03 | **Provider ServicesManager là stub** — NCC không thể đăng/quản lý dịch vụ, đây là chức năng core CRD §3.6.2 | NCC không sử dụng được hệ thống | Chắc chắn | Sprint 4: build ServicesManager |

### Rủi ro trung bình

| # | Mô tả | Tác động | Khả năng | Giảm thiểu |
|---|---|---|---|---|
| R-04 | **AdminDashboard render sai KPI** — hiển thị 8 fields nhưng backend chỉ trả 2 | UI hiển thị "undefined" hoặc "0" sai | Chắc chắn | Sprint 4: wire đúng, ẩn fields thiếu |
| R-05 | **4 moderation sub-pages Blocked By Backend** — CRD §3.7.1 yêu cầu 4 luồng kiểm duyệt nhưng backend chỉ có approve/reject NCC | Admin không thể kiểm duyệt service/blog/review/trip | Chắc chắn | Sprint 6: Coming Soon UI chuyên nghiệp |
| R-06 | **Community domain gần như trống** — CRD §3.4 yêu cầu feed, blog, trip sharing nhưng frontend chỉ có nhúng cơ bản | Trải nghiệm cộng đồng nghèo | Cao | Sprint 5: build community pages |
| R-07 | **AI DEFERRED toàn bộ** — 5 trang CRD Phase 3 bị hoãn vô thời hạn | 12% tổng màn hình không hoạt động | Trung bình | Quyết định chọn AI Provider sớm |

### Rủi ro thấp

| # | Mô tả | Tác động | Khả năng | Giảm thiểu |
|---|---|---|---|---|
| R-08 | **AdminService.LockUserAsync là stub** — frontend wire đúng nhưng backend không khóa user thực | Chức năng khóa user không work | Thấp (backend locked) | Chấp nhận, CR cho trưởng nhóm |
| R-09 | **Provider analytics limited** — backend chỉ trả 2 chỉ số thay vì 5 CRD yêu cầu | Dashboard NCC thiếu dữ liệu | Thấp (backend locked) | Wire dữ liệu có sẵn, ẩn phần thiếu |
| R-10 | **Search endpoint chưa xác nhận hỗ trợ providerId filter** — ServicesManager cần lọc theo NCC | List dịch vụ NCC có thể sai | Trung bình | Kiểm tra endpoint trước Sprint 4 |

---

## 10. ROADMAP ĐÓNG GAP

| Sprint | Mục tiêu | Màn hình | Domain |
|---|---|---|---|
| **Sprint 4** | Admin Core + Provider Services | AD-01 AdminDashboard (wire đúng) | Admin |
| | | AD-02 UserManager (wire đúng) | Admin |
| | | AD-04 ProviderModeration (wire đúng) | Admin |
| | | SP-02 ServicesManager (build mới) | Provider |
| | | SP-03 ServiceForm (build mới) | Provider |
| | | API Layer Consolidation | Kiến trúc |
| **Sprint 5** | Cộng đồng & Explore nâng cao | P-03 ExploreDetail (cải thiện) | Explore |
| | | P-04 CommunityFeed (build mới) | Community |
| | | P-05 BlogDetail (build mới) | Community |
| | | P-06 TripDetail public (build mới) | Community |
| | | T-04 SavedItems (build mới) | Traveler |
| | | SP-05 ProviderPromotions (wire analytics) | Provider |
| | | SP-06 ProviderReviews (build mới) | Provider |
| **Sprint 6** | Admin nâng cao | AD-03 ModerationHub (build mới) | Admin |
| | | AD-05→AD-08 Moderation pages (Coming Soon) | Admin |
| | | AD-11 AdminPackageManager (wire RTK hooks) | Admin |
| | | AdminPromotionsPreview (wire RTK hooks) | Admin |
| **Sprint 7** | Polish & Hoàn thiện | T-01 TravelerDashboard (build mới) | Traveler |
| | | T-05 MyProfile (build đầy đủ) | Traveler |
| | | P-07 PublicProfile (build mới) | Public |
| | | Responsive audit toàn bộ | Tất cả |
| | | Error/Loading/Empty state audit | Tất cả |
| | | Home page cải thiện | Public |

**Khớp với**: `07_SPRINT_BACKLOG.md`

---

## 11. DEFERRED FEATURES

| # | Tính năng | CRD | Lý do hoãn | Điều kiện kích hoạt lại |
|---|---|---|---|---|
| DF-01 | **AI Chat** | §3.5.4 | Chưa chọn AI Provider phù hợp | Trưởng nhóm quyết định AI Provider (OpenAI, Gemini, Claude, etc.) |
| DF-02 | **AI Trip Generator** | §3.5.1 | Chưa chọn AI Provider | Như DF-01 |
| DF-03 | **AI Route Optimizer** | §3.5.2 | Chưa chọn AI Provider | Như DF-01 |
| DF-04 | **AI Budget Advisor** | §3.5.3 | Chưa chọn AI Provider | Như DF-01 |
| DF-05 | **Traveler Subscription** (Free/Premium) | §3.1.5 | Backend LOCKED — không có subscription service | CR mở backend thêm subscription endpoints |
| DF-06 | **Coupon Manager** | §3.7.4 | Database không có bảng `MA_GIAM_GIA`, backend không có endpoint | CR tạo bảng + endpoint |
| DF-07 | **SignalR Realtime Collaboration** | §3.2.5 | Backend LOCKED — không có SignalR Hub | CR mở backend thêm SignalR Hub |
| DF-08 | **Export Excel/PDF** | §3.7.5 | Backend LOCKED — không có export endpoint | CR mở backend thêm export endpoint |
| DF-09 | **Trip Sharing** (Public/Private/Link) | §3.4.1 | Backend LOCKED — không có share service | CR mở backend thêm share endpoints |

**Tổng impact**: 9 tính năng Deferred, ảnh hưởng 8/42 màn hình (19%)

**Điều kiện chung**: Tất cả đều cần **Change Request chính thức** từ Trưởng nhóm để mở khóa Backend hoặc Database.

---

## 12. KẾT LUẬN

### Mức độ hoàn thiện Frontend

```
┌─────────────────────────────────────────────┐
│         FRONTEND COMPLETION STATUS          │
├─────────────────────────────────────────────┤
│                                             │
│  Done ████████████████░░░░░░░░░░░  35.7%   │
│  Partial ██████████░░░░░░░░░░░░░░░  26.2%  │
│  Missing █████████████░░░░░░░░░░░░  33.3%  │
│  Blocked ██░░░░░░░░░░░░░░░░░░░░░░   4.8%  │
│                                             │
│  Deferred (ngoài kiểm soát) ██████  14.3%  │
│                                             │
├─────────────────────────────────────────────┤
│  Tiến độ thực tế: 15/34 = 44.1%            │
│  (không tính Deferred + Blocked)            │
└─────────────────────────────────────────────┘
```

### Số Sprint còn lại: 4 (Sprint 4 → Sprint 7)

### Rủi ro lớn nhất

**R-01: Admin Panel không hoạt động** — Toàn bộ Admin Panel (trừ PlacesManager) gọi endpoint sai hoặc không tồn tại. Đây là rủi ro khẩn cấp nhất vì Admin là CRD Phase 5 "✅ Bắt buộc".

### Ưu tiên tiếp theo

1. **Sprint 4 (KHẨN CẤP)**: Sửa Admin Panel wire đúng backend + build Provider Services Manager
2. **Sprint 5**: Build Community domain + cải thiện Explore/Provider
3. **Sprint 6**: Admin Package Manager + Moderation Coming Soon pages
4. **Sprint 7**: Polish, responsive, UX

### Tóm tắt một dòng

> Frontend đạt 44.1% tiến độ thực tế. Ưu tiên khẩn cấp: Sprint 4 sửa Admin Panel (gọi sai 10+ endpoint) và build Provider Services Manager (stub). 9 tính năng Deferred chờ CR mở Backend/Database.
