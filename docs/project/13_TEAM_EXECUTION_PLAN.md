# 13 – KẾ HOẠCH TRIỂN KHAI NHÓM (Team Execution Plan)

**Phiên bản**: 1.0  
**Ngày tạo**: 2026-06-07  
**Phạm vi**: Sprint 4 → Sprint 7  
**Ràng buộc**: Database LOCKED, Backend LOCKED  
**Tầng triển khai**: Frontend only  
**Nguồn chân lý**: CRD_EZtravel_v3.docx → `07_SPRINT_BACKLOG.md` → `09_FRONTEND_GAP_ANALYSIS.md`

---

## 1. MỤC TIÊU

Hoàn thiện Frontend EZTravel từ **44.1%** lên **100%** (34 màn hình có thể triển khai, loại bỏ Deferred + Blocked) qua 4 Sprint:

| Sprint | Mục tiêu chính | Target |
|---|---|---|
| **Sprint 4** | Admin Core + Provider Services | Sửa Admin Panel + Build ServicesManager |
| **Sprint 5** | Cộng đồng & Review | Community Feed, Reviews, Provider Analytics |
| **Sprint 6** | Admin Nâng cao | Package Manager, Promotions, Coming Soon pages |
| **Sprint 7** | Polish & Hoàn thiện | Responsive, Cleanup, UX, Profile |

**KPI cuối Sprint 7**:
- 34/34 màn hình triển khai được → Done
- 0 endpoint gọi sai
- `tsc --noEmit` pass
- Responsive trên 375px, 768px, 1920px

---

## 2. HIỆN TRẠNG

### 2.1 Frontend Completion

```
Done:      15 / 42 = 35.7%
Partial:   11 / 42 = 26.2%
Missing:   14 / 42 = 33.3%
Blocked:    2 / 42 =  4.8%
Deferred:   6 / 42 = 14.3%

Tiến độ thực tế: 15/34 = 44.1%
(không tính Deferred + Blocked)
```

### 2.2 Rủi ro khẩn cấp

| Rủi ro | Mức độ | Tác động |
|---|---|---|
| Admin Panel gọi 10+ endpoint sai | **KHẨN CẤP** | Admin không thể quản lý hệ thống |
| Provider ServicesManager là stub | **KHẨN CẤP** | NCC không thể đăng dịch vụ |
| Hai tầng API layer | **CAO** | Bug ẩn, endpoint shadowing |
| Community domain trống | **TRUNG BÌNH** | Trải nghiệm cộng đồng nghèo |

### 2.3 Tài nguyên giả định

| Vai trò | Số lượng | Ghi chú |
|---|---|---|
| Frontend Team A | 2-3 người | Admin domain |
| Frontend Team B | 2-3 người | Provider + Community domain |
| QA/Tester | 1 người | Kiểm tra responsive, API integration |
| Tech Lead | 1 người | Review, kiến trúc, quyết định kỹ thuật |

---

## 3. SPRINT 4 — ADMIN CORE + PROVIDER SERVICES

**Thời gian**: 2 tuần  
**Focus**: Sửa Admin Panel wire đúng backend + Build Provider Services Manager

### User Stories

---

#### US-4.1: Sửa Admin Dashboard

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | AD-01 AdminDashboard |
| **CRD** | §3.7.5 UC021 |
| **Story Point** | 5 |
| **Owner** | Frontend Team A |
| **Dependency** | `GET /admin/dashboard` (tồn tại, response giới hạn) |
| **Risk** | Backend chỉ trả TotalUsers + TotalTrips — frontend phải ẩn KPI thiếu |

**API**: `GET /admin/dashboard` → `AdminDashboardDto { totalUsers, totalTrips, totalBookings=0, totalRevenue=0 }`

**Done khi**:
- [ ] Dashboard hiển thị đúng `TotalUsers` và `TotalTrips` từ backend
- [ ] KPI backend chưa cung cấp hiển thị `—` hoặc "Chưa có dữ liệu"
- [ ] Không hiển thị `totalBookings` và `totalRevenue` (Booking ngoài CRD)
- [ ] Loading State, Error State
- [ ] Responsive (375px, 768px, 1920px)
- [ ] Import từ `store/apis/adminApi.ts` (không phải `src/api/adminApi.ts`)
- [ ] Type check pass (`tsc --noEmit`)
- [ ] Lint pass
- [ ] Build pass

**Deliverables**: `modules/admin/Dashboard.tsx` (sửa)

---

#### US-4.2: Sửa Admin User Management

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | AD-02 UserManager |
| **CRD** | §3.7.2 UC018 |
| **Story Point** | 8 |
| **Owner** | Frontend Team A |
| **Dependency** | `GET /admin/users`, `POST /admin/users/{id}/lock` (cả hai tồn tại) |
| **Risk** | `LockUserAsync` là stub (trả true mà không khóa) — wire đúng endpoint, chờ backend sửa |

**API**:
- `GET /admin/users` → `List<UserDto>`
- `POST /admin/users/{id}/lock` → `bool`

**Done khi**:
- [ ] Danh sách user hiển thị đúng từ `GET /admin/users`
- [ ] Nút "Khóa" gọi `POST /admin/users/{id}/lock`
- [ ] Client-side search/filter (backend chưa có pagination)
- [ ] Tạo RTK Query hooks mới trong `store/apis/adminApi.ts`
- [ ] Xóa import từ `src/api/adminApi.ts`
- [ ] Loading State, Error State, Empty State
- [ ] Responsive
- [ ] Type check pass
- [ ] Lint pass
- [ ] Build pass

**Deliverables**: `modules/admin/UserManager.tsx` (sửa), `store/apis/adminApi.ts` (thêm hooks)

---

#### US-4.3: Sửa Admin Provider Approval

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | AD-04 ProviderModeration |
| **CRD** | §3.7.1 UC019 |
| **Story Point** | 8 |
| **Owner** | Frontend Team A |
| **Dependency** | `GET /providers/pending`, `POST /providers/{id}/approve`, `POST /providers/{id}/reject` |
| **Risk** | Endpoint nằm ở BookingService, không phải AdminService — cần routing đúng |

**API**:
- `GET /providers/pending` → `List<NhaCungCap>`
- `POST /providers/{id}/approve` → `{ approvedBy: number }`
- `POST /providers/{id}/reject` → `{ reason: string }`

**Done khi**:
- [ ] Danh sách NCC chờ duyệt từ `GET /providers/pending`
- [ ] Nút "Duyệt" gọi `POST /providers/{id}/approve` với `approvedBy` = admin ID
- [ ] Nút "Từ chối" mở modal nhập lý do → gọi `POST /providers/{id}/reject`
- [ ] RTK Query hooks mới trong `store/apis/`
- [ ] Loading State, Error State, Empty State
- [ ] Responsive
- [ ] Type check pass
- [ ] Build pass

**Deliverables**: `modules/admin/ProviderApproval.tsx` (sửa), `store/apis/` (hooks)

---

#### US-4.4: Build Provider Services Manager

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | SP-02 ServicesManager + SP-03 ServiceForm |
| **CRD** | §3.6.2 SP003-SP005 |
| **Story Point** | 13 |
| **Owner** | Frontend Team B |
| **Dependency** | `GET/POST/PUT/DELETE /places/hotels\|restaurants\|activities\|vehicles` (tất cả tồn tại) |
| **Risk** | Search endpoint chưa xác nhận hỗ trợ `providerId` filter — cần test trước |

**API**:
- `GET /places/hotels/search?providerId={id}` → List
- `POST /places/hotels` → Create
- `PUT /places/hotels/{id}` → Update
- `DELETE /places/hotels/{id}` → Delete
- (Tương tự cho restaurants, activities, vehicles)

**Done khi**:
- [ ] Page hiển thị 4 tab: Khách sạn, Nhà hàng, Phương tiện, Hoạt động
- [ ] Mỗi tab liệt kê dịch vụ của NCC hiện tại
- [ ] Trạng thái kiểm duyệt (Pending / Approved / Rejected)
- [ ] Nút "Thêm dịch vụ" → form nhập liệu đặc thù theo loại
- [ ] Nút "Ẩn/Hiện" + "Chỉnh sửa" cho từng dịch vụ
- [ ] RTK Query hooks cho 4 loại dịch vụ
- [ ] Loading State, Error State, Empty State
- [ ] Responsive
- [ ] Type check pass
- [ ] Build pass

**Deliverables**: `modules/provider/ServicesManager.tsx` (rewrite), `store/apis/serviceApi.ts` (mới)

---

#### US-4.5: Consolidate Admin API Layer

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | Kiến trúc (cross-cutting) |
| **Story Point** | 5 |
| **Owner** | Frontend Team A |
| **Dependency** | US-4.1, US-4.2, US-4.3 phải hoàn thành trước |
| **Risk** | Thấp — chỉ chuyển import |

**Done khi**:
- [ ] `modules/admin/Dashboard.tsx` không import từ `src/api/adminApi.ts`
- [ ] `modules/admin/UserManager.tsx` không import từ `src/api/adminApi.ts`
- [ ] `modules/admin/ProviderApproval.tsx` không import từ `src/api/adminApi.ts`
- [ ] Tất cả hooks cần thiết có trong `store/apis/adminApi.ts`
- [ ] Không còn endpoint URL sai trong code
- [ ] Type check pass
- [ ] Build pass

**Deliverables**: Sửa imports, mở rộng `store/apis/adminApi.ts`

---

### Sprint 4 Tổng hợp

| User Story | SP | Owner | Component | API | Done? |
|---|---|---|---|---|---|
| US-4.1 | 5 | Team A | AdminDashboard | `GET /admin/dashboard` | |
| US-4.2 | 8 | Team A | UserManager | `GET /admin/users`, `POST .../lock` | |
| US-4.3 | 8 | Team A | ProviderApproval | `GET /providers/pending`, approve/reject | |
| US-4.4 | 13 | Team B | ServicesManager | Hotels/Restaurants/Activities/Vehicles CRUD | |
| US-4.5 | 5 | Team A | API Layer | Cross-cutting | |
| **Tổng** | **39** | | | | |

---

## 4. SPRINT 5 — CỘNG ĐỒNG & REVIEW

**Thời gian**: 2 tuần  
**Focus**: Community Feed, Reviews, Provider Analytics, Service Detail

### User Stories

---

#### US-5.1: Cải thiện Review Section

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | Reviews (tích hợp ExploreDetail) |
| **CRD** | §3.4.2 UC013 |
| **Story Point** | 8 |
| **Owner** | Frontend Team B |
| **Dependency** | `POST /reviews`, `GET /reviews/place/{id}`, `GET /reviews/service/{id}` |
| **Risk** | Thấp — API tồn tại đầy đủ |

**Done khi**:
- [ ] Form đánh giá: sao (1-5), nội dung text, upload ảnh
- [ ] Danh sách review trên trang chi tiết
- [ ] Điểm trung bình hiển thị đúng
- [ ] Loading/Error/Empty states
- [ ] Type check pass, Build pass

---

#### US-5.2: Community Feed Page

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | P-04 CommunityFeed, P-06 TripDetail (public) |
| **CRD** | §3.4.1, §3.4.4 |
| **Story Point** | 13 |
| **Owner** | Frontend Team B |
| **Dependency** | `GET /feeds`, `POST /feeds/{id}/like`, `POST /feeds/{id}/comment`, `GET /feeds/{id}/comments` |
| **Risk** | Blog CRUD endpoint chưa xác nhận — có thể chỉ hiển thị read-only feed |

**Done khi**:
- [ ] Route `/community` tồn tại
- [ ] Feed hiển thị lịch trình cộng đồng
- [ ] Like button hoạt động
- [ ] Comment section hoạt động
- [ ] Trip detail public (read-only timeline)
- [ ] Loading/Error/Empty states
- [ ] Type check pass, Build pass

---

#### US-5.3: Provider Analytics Wire

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | SP-05 ProviderPromotions |
| **CRD** | §3.6.3 Tab Analytics, SP009 |
| **Story Point** | 5 |
| **Owner** | Frontend Team B |
| **Dependency** | `GET /providers/{id}/dashboard` |
| **Risk** | Backend chỉ trả 2/5 chỉ số CRD — frontend hiển thị dữ liệu có sẵn, ẩn phần thiếu |

**Done khi**:
- [ ] Analytics hiển thị `totalServices`, `activeServices`, `totalReviews`, `averageRating` từ backend
- [ ] Không hiển thị `monthlyRevenue` và `pendingBookings` (Booking ngoài CRD)
- [ ] Không dùng mock data
- [ ] Loading/Error/Empty states
- [ ] Type check pass, Build pass

---

#### US-5.4: Trang Chi tiết Dịch vụ Cải thiện

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | P-03 ExploreDetail |
| **CRD** | §3.3.2 |
| **Story Point** | 8 |
| **Owner** | Frontend Team B |
| **Dependency** | `GET /places/{id}`, `GET /reviews/place/{id}` |
| **Risk** | Thấp |

**Done khi**:
- [ ] Gallery ảnh swipeable
- [ ] Giá tham khảo
- [ ] Thông tin liên hệ NCC
- [ ] Review section tích hợp
- [ ] Nút "Thêm vào lịch trình"
- [ ] Responsive
- [ ] Type check pass, Build pass

---

#### US-5.5: Saved Items Page

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | T-04 SavedItems |
| **CRD** | §3.4.4 |
| **Story Point** | 5 |
| **Owner** | Frontend Team B |
| **Dependency** | API save/bookmark chưa xác nhận |
| **Risk** | Nếu không có API → hiển thị Coming Soon |

**Done khi**:
- [ ] Route `/saved` tồn tại
- [ ] Danh sách lịch trình đã bookmark
- [ ] Hoặc Coming Soon nếu API không có
- [ ] Loading/Error/Empty states
- [ ] Type check pass, Build pass

---

### Sprint 5 Tổng hợp

| User Story | SP | Owner | Component |
|---|---|---|---|
| US-5.1 | 8 | Team B | Review Section |
| US-5.2 | 13 | Team B | Community Feed |
| US-5.3 | 5 | Team B | Provider Analytics |
| US-5.4 | 8 | Team B | ExploreDetail |
| US-5.5 | 5 | Team B | SavedItems |
| **Tổng** | **39** | | |

---

## 5. SPRINT 6 — ADMIN NÂNG CAO + CONTENT MODERATION

**Thời gian**: 2 tuần  
**Focus**: Admin Package Manager, Promotions Preview, Moderation Coming Soon pages

### User Stories

---

#### US-6.1: Admin Package Manager

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | AD-11 AdminPackageManager |
| **CRD** | Quản lý gói NCC |
| **Story Point** | 13 |
| **Owner** | Frontend Team A |
| **Dependency** | `api/admin/provider-packages/*` (8 endpoints, RTK hooks sẵn) |
| **Risk** | Thấp — backend + hooks đầy đủ, chỉ cần build UI |

**Done khi**:
- [ ] Danh sách NCC với gói hiện tại
- [ ] Nút Cấp gói / Gia hạn / Hết hạn hoạt động
- [ ] Thống kê gói quảng bá
- [ ] Loading/Error/Empty states
- [ ] Responsive
- [ ] Type check pass, Build pass

---

#### US-6.2: Admin Promotions Preview

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | AdminPromotionsPreview |
| **CRD** | §3.6.4 |
| **Story Point** | 5 |
| **Owner** | Frontend Team A |
| **Dependency** | `GET /admin/provider-packages/promotions-preview` (RTK hook sẵn) |
| **Risk** | Thấp |

**Done khi**:
- [ ] Preview danh sách NCC được promote
- [ ] Badge type hiển thị từ backend (không tự tính)
- [ ] Loading/Error/Empty states
- [ ] Type check pass, Build pass

---

#### US-6.3: Admin Content Moderation Pages

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | AD-03 ModerationHub, AD-05→AD-08 |
| **CRD** | §3.7.1 UC019 |
| **Story Point** | 13 |
| **Owner** | Frontend Team A |
| **Dependency** | Backend LOCKED — không có admin moderation endpoints |
| **Risk** | CAO — Backend không có endpoint → buộc Coming Soon |

**Done khi**:
- [ ] `ServiceModeration.tsx` → Coming Soon hoặc wire đến endpoint gần nhất
- [ ] `BlogModeration.tsx` → Coming Soon hoặc wire đến endpoint gần nhất
- [ ] `Reports.tsx` → Coming Soon hoặc wire đến endpoint gần nhất
- [ ] ModerationHub → tổng quan 4 luồng (ProviderApproval hoạt động, 3 Coming Soon)
- [ ] Không gọi endpoint không tồn tại
- [ ] Coming Soon UI chuyên nghiệp (không phải text trắng)
- [ ] Responsive
- [ ] Type check pass, Build pass

---

#### US-6.4: Provider Reviews Page

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | SP-06 ProviderReviews |
| **CRD** | SP008 |
| **Story Point** | 8 |
| **Owner** | Frontend Team B |
| **Dependency** | `GET /reviews/service/{id}` |
| **Risk** | Endpoint phản hồi NCC chưa rõ |

**Done khi**:
- [ ] NCC xem đánh giá theo dịch vụ
- [ ] Phản hồi nếu có endpoint, Coming Soon nếu không
- [ ] Loading/Error/Empty states
- [ ] Type check pass, Build pass

---

### Sprint 6 Tổng hợp

| User Story | SP | Owner | Component |
|---|---|---|---|
| US-6.1 | 13 | Team A | AdminPackageManager |
| US-6.2 | 5 | Team A | AdminPromotionsPreview |
| US-6.3 | 13 | Team A | Moderation Pages |
| US-6.4 | 8 | Team B | ProviderReviews |
| **Tổng** | **39** | | |

---

## 6. SPRINT 7 — POLISH & HOÀN THIỆN

**Thời gian**: 2 tuần  
**Focus**: Responsive audit, Error/Loading state audit, API cleanup, Profile pages, Home cải thiện

### User Stories

---

#### US-7.1: Responsive Audit

| Thuộc tính | Giá trị |
|---|---|
| **Story Point** | 8 |
| **Owner** | Team A + Team B |
| **Dependency** | Tất cả pages từ Sprint 4-6 |
| **Risk** | Thấp — chỉ CSS |

**Done khi**:
- [ ] Tất cả pages test trên 375px, 768px, 1920px
- [ ] Không có overflow horizontal trên mobile
- [ ] Navigation collapse đúng trên mobile
- [ ] Bảng dữ liệu scroll horizontal trên mobile
- [ ] Form full-width trên mobile

---

#### US-7.2: Error/Loading/Empty State Audit

| Thuộc tính | Giá trị |
|---|---|
| **Story Point** | 5 |
| **Owner** | Team A + Team B |

**Done khi**:
- [ ] Tất cả pages có data fetching có Loading State
- [ ] Tất cả pages có data fetching có Error State (nút retry)
- [ ] Tất cả danh sách có Empty State
- [ ] Không có trang trắng khi đang tải/lỗi

---

#### US-7.3: API Layer Cleanup

| Thuộc tính | Giá trị |
|---|---|
| **Story Point** | 5 |
| **Owner** | Frontend Team A |

**Done khi**:
- [ ] Loại bỏ endpoint sai trong `src/api/adminApi.ts`
- [ ] Tất cả Admin pages dùng `src/store/apis/adminApi.ts`
- [ ] Xóa code gọi endpoint không tồn tại
- [ ] Không còn duplicate RTK Query endpoint

---

#### US-7.4: Hồ sơ cá nhân Traveler

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | T-05 MyProfile |
| **CRD** | §3.1.4 UC004 |
| **Story Point** | 8 |
| **Owner** | Frontend Team B |
| **Dependency** | `GET /auth/me` |

**Done khi**:
- [ ] Trang hồ sơ hiển thị: avatar, tên, email, phone
- [ ] Form cập nhật thông tin
- [ ] Upload avatar
- [ ] Responsive
- [ ] Type check pass, Build pass

---

#### US-7.5: Trang chủ & Xu hướng

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | P-01 Home |
| **CRD** | §3.3.3 |
| **Story Point** | 8 |
| **Owner** | Frontend Team B |
| **Dependency** | `POST /trips/recommendations`, `GET /providers/featured` |

**Done khi**:
- [ ] Trang chủ hiển thị địa điểm trending
- [ ] Section NCC nổi bật với badge
- [ ] Gợi ý lịch trình
- [ ] CTA "Tạo chuyến đi mới"
- [ ] Responsive, animation
- [ ] Type check pass, Build pass

---

#### US-7.6: Traveler Dashboard

| Thuộc tính | Giá trị |
|---|---|
| **Màn hình** | T-01 TravelerDashboard |
| **CRD** | §3.2 |
| **Story Point** | 5 |
| **Owner** | Frontend Team B |
| **Dependency** | `GET /trips`, `POST /trips/recommendations` |

**Done khi**:
- [ ] Route `/dashboard` tồn tại
- [ ] Lịch trình gần đây
- [ ] Gợi ý điểm đến
- [ ] Nút "Tạo chuyến đi mới"
- [ ] Responsive
- [ ] Type check pass, Build pass

---

### Sprint 7 Tổng hợp

| User Story | SP | Owner | Component |
|---|---|---|---|
| US-7.1 | 8 | Team A+B | Responsive Audit |
| US-7.2 | 5 | Team A+B | State Audit |
| US-7.3 | 5 | Team A | API Cleanup |
| US-7.4 | 8 | Team B | MyProfile |
| US-7.5 | 8 | Team B | Home Page |
| US-7.6 | 5 | Team B | TravelerDashboard |
| **Tổng** | **39** | | |

---

## 7. OWNERSHIP MATRIX

| Domain | Team | Sprint 4 | Sprint 5 | Sprint 6 | Sprint 7 |
|---|---|---|---|---|---|
| **Admin** | Team A | Dashboard, UserManager, ProviderApproval, API consolidation | — | PackageManager, Promotions, Moderation | API Cleanup |
| **Provider** | Team B | ServicesManager | Analytics | Reviews | — |
| **Community** | Team B | — | Feed, Reviews | — | — |
| **Explore** | Team B | — | Detail, Saved | — | — |
| **Traveler** | Team B | — | — | — | Profile, Dashboard |
| **Home** | Team B | — | — | — | Home cải thiện |
| **Responsive** | Team A+B | — | — | — | Audit |
| **State Audit** | Team A+B | — | — | — | Audit |

---

## 8. STORY POINT TỔNG HỢP

| Sprint | Story Points | User Stories |
|---|---|---|
| Sprint 4 | 39 | US-4.1 → US-4.5 |
| Sprint 5 | 39 | US-5.1 → US-5.5 |
| Sprint 6 | 39 | US-6.1 → US-6.4 |
| Sprint 7 | 39 | US-7.1 → US-7.6 |
| **Tổng** | **156** | **20 User Stories** |

---

## 9. ƯỚC LƯỢNG CÔNG VIỆC

### Velocity giả định

| Metric | Giá trị |
|---|---|
| Team size | 4-6 FE developers |
| Sprint duration | 2 tuần |
| Estimated velocity | ~39 SP / sprint |
| Total sprints | 4 |
| Total delivery time | ~8 tuần |

### Phân bổ công việc theo tuần

| Tuần | Sprint | Hoạt động chính |
|---|---|---|
| Tuần 1-2 | Sprint 4 | Admin fix + ServicesManager build |
| Tuần 3-4 | Sprint 5 | Community + Review + Analytics |
| Tuần 5-6 | Sprint 6 | Admin nâng cao + Coming Soon |
| Tuần 7-8 | Sprint 7 | Polish + Responsive + Cleanup |

---

## 10. RỦI RO

| # | Rủi ro | Mức độ | Khả năng | Giảm thiểu |
|---|---|---|---|---|
| R-01 | Search endpoint không hỗ trợ `providerId` filter | Trung bình | Trung bình | Test trước Sprint 4, fallback lọc client-side |
| R-02 | `LockUserAsync` backend là stub — không khóa user thật | Thấp | Chắc chắn | Wire đúng endpoint, chấp nhận stub. Ghi CR |
| R-03 | Backend `Dashboard` chỉ trả 2 KPI | Trung bình | Chắc chắn | Ẩn KPI thiếu, hiển thị "Chưa có dữ liệu" |
| R-04 | 4 moderation pages Blocked By Backend | Cao | Chắc chắn | Coming Soon UI chuyên nghiệp |
| R-05 | Community endpoint tạo blog chưa xác nhận | Trung bình | Cao | Read-only feed, Coming Soon cho blog writing |
| R-06 | Provider analytics chỉ có 2/5 chỉ số CRD | Trung bình | Chắc chắn | Wire dữ liệu có sẵn, ẩn phần thiếu |
| R-07 | AI toàn bộ Deferred | Thấp (cho Sprint 4-7) | N/A | UI skeleton giữ nguyên. Chờ AI Provider |
| R-08 | Developer turnover giữa Sprint | Cao | Thấp | Onboarding guide (12_DEVELOPER_ONBOARDING_GUIDE.md) |
| R-09 | Two API layers gây regression | Trung bình | Trung bình | US-4.5 consolidate, US-7.3 cleanup |
| R-10 | Save/Bookmark endpoint chưa xác nhận | Trung bình | Trung bình | Kiểm tra CommunityService, fallback Coming Soon |

---

## 11. QUY TRÌNH BÀN GIAO

### 11.1 Giữa các Sprint

Cuối mỗi Sprint, team phải bàn giao:

1. **Code merged vào develop** — tất cả PR đã approve
2. **`tsc --noEmit` pass** — không lỗi TypeScript
3. **Demo** — chạy ứng dụng và demo tính năng cho stakeholder
4. **Sprint Report** — tóm tắt:
   - User Stories hoàn thành
   - User Stories chưa hoàn thành + lý do
   - Bug phát hiện
   - Change Request (nếu có)

### 11.2 Checklist bàn giao Sprint

- [ ] Tất cả User Stories đạt Definition of Done
- [ ] `tsc --noEmit` pass
- [ ] Responsive trên mobile (< 768px) và desktop
- [ ] Mọi page có Loading State, Empty State, Error State
- [ ] Code review đã pass
- [ ] Không gọi endpoint không tồn tại
- [ ] Không mock API
- [ ] Không hardcode business data

### 11.3 Cuối Sprint 7

Bàn giao cuối cùng bao gồm:

1. **Production-ready Frontend** — build pass, no errors
2. **API Layer Clean** — chỉ có `store/apis/`, không còn legacy
3. **Responsive Audit Report** — tất cả pages pass
4. **State Audit Report** — tất cả pages có Loading/Error/Empty
5. **Walkthrough Document** — tóm tắt toàn bộ thay đổi Sprint 4→7

---

## 12. DEFINITION OF DONE

Một User Story được coi là **Done** khi thỏa mãn **TẤT CẢ** tiêu chí sau:

### Chức năng
- [ ] Acceptance Criteria trong User Story đều pass
- [ ] API endpoint gọi đúng (URL, method, request/response)
- [ ] Không gọi endpoint không tồn tại
- [ ] Không mock API response
- [ ] Không hardcode business data

### Code Quality
- [ ] `tsc --noEmit` pass — không lỗi TypeScript
- [ ] Không sử dụng `any`
- [ ] Lint pass
- [ ] Build pass (`npm run build`)
- [ ] Component đặt đúng folder structure

### UI/UX
- [ ] Loading State (spinner/skeleton khi đang tải)
- [ ] Error State (thông báo lỗi + nút retry)
- [ ] Empty State (thông báo + hướng dẫn hành động)
- [ ] Responsive trên 375px (mobile), 768px (tablet), 1920px (desktop)
- [ ] Không có trang trắng khi đang tải/lỗi

### Process
- [ ] Code review pass (tối thiểu 1 reviewer approve)
- [ ] PR checklist pass (theo `06_PR_REVIEW_CHECKLIST.md`)
- [ ] Merged vào develop
- [ ] Demo cho stakeholder (nếu yêu cầu)

---

*Tài liệu này là kế hoạch triển khai chính thức cho Sprint 4→7. Mọi thay đổi scope phải được Trưởng nhóm phê duyệt.*
