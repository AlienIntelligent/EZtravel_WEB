# 07 – SPRINT BACKLOG CHÍNH THỨC

**Nguồn chân lý**: CRD_EZtravel_v3.docx  
**Ràng buộc**: Database LOCKED, Backend LOCKED  
**Tầng triển khai duy nhất**: Frontend  
**Ngày tạo**: 2026-06-07

---

## QUY TẮC SPRINT

1. Mỗi Sprint chỉ triển khai **Frontend** trên nền CRD + Database + Backend hiện tại.
2. Không được gọi API endpoint **chưa tồn tại** trong backend.
3. Nếu backend thiếu endpoint → hiển thị "Tính năng đang phát triển" hoặc wire đến endpoint gần nhất có sẵn.
4. Không tự suy diễn nghiệp vụ — mọi logic lấy từ backend response.

---

## SPRINT 4 – ADMIN CORE + PROVIDER SERVICES

### Mục tiêu

Hoàn thành Admin Panel cốt lõi (CRD §3.7) và Provider Services Manager (CRD §3.6.2), wire đúng đến backend API đã tồn tại.

### Phạm vi (IN SCOPE)

- Sửa Admin Dashboard wire đúng dữ liệu backend
- Sửa Admin User Management wire đúng endpoint
- Sửa Admin Provider Approval wire đúng endpoint
- Build Provider Services Manager page
- Consolidate API layer cho Admin (từ `src/api/adminApi.ts` sang `src/store/apis/`)

### Loại trừ (OUT OF SCOPE)

- Tạo mới backend endpoint
- Sửa Backend DTO
- Service moderation, Blog moderation, Review moderation (Sprint 6)
- Admin Package Manager UI (Sprint 6)
- AI implementation
- Booking, Notification, Follow, Coupon

---

### US-4.1: Sửa Admin Dashboard

**CRD**: §3.7.5 UC021  
**Mô tả**: Admin Dashboard hiện render 8+ KPI fields nhưng backend `GET /admin/dashboard` chỉ trả về `TotalUsers` và `TotalTrips`. Cần điều chỉnh dashboard hiển thị đúng dữ liệu backend cung cấp.

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Lấy thống kê | `GET /admin/dashboard` | GET |

**Backend response hiện tại** (từ `AdminService.cs` L46-52):
```json
{
  "totalUsers": number,
  "totalTrips": number,
  "totalBookings": 0,
  "totalRevenue": 0
}
```

**Acceptance Criteria**:
- [ ] Dashboard hiển thị `Tổng người dùng` và `Tổng lịch trình` từ backend
- [ ] Các KPI backend chưa cung cấp (totalProviders, totalServices, etc.) hiển thị `—` hoặc "Chưa có dữ liệu"
- [ ] Không hiển thị `totalBookings` và `totalRevenue` (Booking ngoài phạm vi CRD)
- [ ] Có Loading State, Error State
- [ ] Responsive trên mobile

**Deliverables**: `modules/admin/Dashboard.tsx` (sửa)

---

### US-4.2: Sửa Admin User Management

**CRD**: §3.7.2 UC018  
**Mô tả**: `UserManager.tsx` gọi `PUT /admin/users/{id}/status` — endpoint không tồn tại. Backend có `GET /admin/users` (danh sách) và `POST /admin/users/{id}/lock` (khóa/mở khóa).

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Danh sách user | `GET /admin/users` | GET |
| Khóa user | `POST /admin/users/{id}/lock` | POST |

**Backend response** (từ `AdminService.cs` L18-27):
```json
[
  {
    "id": number,
    "hoTen": string,
    "email": string,
    "role": string,
    "createdAt": string
  }
]
```

**Lưu ý**: Backend `LockUserAsync` là stub (trả về `true` mà không thay đổi trạng thái). Frontend vẫn wire vào endpoint này. Khi backend được sửa, frontend sẽ tự động hoạt động đúng.

**Acceptance Criteria**:
- [ ] Danh sách user hiển thị đúng từ `GET /admin/users`
- [ ] Nút "Khóa" gọi `POST /admin/users/{id}/lock`
- [ ] Frontend lọc/tìm kiếm user ở phía client (backend chưa hỗ trợ pagination)
- [ ] Tạo RTK Query hook mới trong `store/apis/adminApi.ts`
- [ ] Xóa import từ `src/api/adminApi.ts`
- [ ] Loading State, Error State, Empty State
- [ ] Responsive

**Deliverables**: `modules/admin/UserManager.tsx` (sửa), `store/apis/adminApi.ts` (thêm hooks)

---

### US-4.3: Sửa Admin Provider Approval

**CRD**: §3.7.1 UC019 (Kiểm duyệt đăng ký NCC)  
**Mô tả**: `ProviderApproval.tsx` gọi `GET /admin/providers` và `PUT /admin/providers/{id}/status` — đều không tồn tại. Backend có sẵn endpoint đúng trong `ProvidersController.cs`.

**API Mapping**:

| Hành động | API Backend | Method | Auth |
|---|---|---|---|
| Danh sách NCC chờ duyệt | `GET /providers/pending` | GET | Admin |
| Tất cả NCC | `GET /providers` | GET | Admin |
| Duyệt NCC | `POST /providers/{id}/approve` | POST | Admin |
| Từ chối NCC | `POST /providers/{id}/reject` | POST | Admin |

**Request body Approve** (từ `ProvidersController.cs` L155-158):
```json
{ "approvedBy": number }
```

**Request body Reject** (từ `ProvidersController.cs` L164-167):
```json
{ "reason": string }
```

**Acceptance Criteria**:
- [ ] Hiển thị danh sách NCC chờ duyệt từ `GET /providers/pending`
- [ ] Nút "Duyệt" gọi `POST /providers/{id}/approve` với `approvedBy` = admin user ID
- [ ] Nút "Từ chối" gọi `POST /providers/{id}/reject` với modal nhập lý do
- [ ] Tạo RTK Query hooks mới trong `store/apis/providerApi.ts` hoặc `store/apis/adminProviderApi.ts`
- [ ] Xóa import từ `src/api/adminApi.ts`
- [ ] Loading State, Error State, Empty State
- [ ] Responsive

**Deliverables**: `modules/admin/ProviderApproval.tsx` (sửa), `store/apis/` (thêm hooks)

---

### US-4.4: Build Provider Services Manager

**CRD**: §3.6.2 SP003-SP005, §3.6.3 Tab Dịch vụ  
**Mô tả**: `ServicesManager.tsx` hiện là stub "Coming Soon". CRD yêu cầu NCC quản lý dịch vụ theo 4 loại. Backend có sẵn CRUD API cho từng loại.

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Lấy khách sạn của NCC | `GET /places/hotels/search?providerId={id}` | GET |
| Lấy nhà hàng | `GET /places/restaurants/search?providerId={id}` | GET |
| Lấy hoạt động | `GET /places/activities/search?providerId={id}` | GET |
| Lấy phương tiện | `GET /places/vehicles/search?providerId={id}` | GET |
| Tạo khách sạn | `POST /places/hotels` | POST |
| Tạo nhà hàng | `POST /places/restaurants` | POST |
| Tạo hoạt động | `POST /places/activities` | POST |
| Tạo phương tiện | `POST /places/vehicles` | POST |
| Cập nhật | `PUT /places/hotels/{id}` (tương tự cho loại khác) | PUT |
| Xóa | `DELETE /places/hotels/{id}` | DELETE |

**Lưu ý**: Cần kiểm tra xem các search endpoint có hỗ trợ filter theo `providerId` hay `maNhaCungCap` không. Nếu backend chưa hỗ trợ filter → fetch tất cả và lọc client-side, hoặc hiển thị "Đang phát triển" cho phần listing.

**Acceptance Criteria**:
- [ ] Page hiển thị 4 tab: Khách sạn, Nhà hàng, Phương tiện, Hoạt động
- [ ] Mỗi tab liệt kê dịch vụ của NCC hiện tại
- [ ] Hiển thị trạng thái kiểm duyệt (Pending / Approved / Rejected)
- [ ] Nút "Thêm dịch vụ" mở form nhập liệu
- [ ] Nút "Ẩn/Hiện" cho từng dịch vụ
- [ ] Nút "Chỉnh sửa" cho từng dịch vụ
- [ ] Tạo RTK Query hooks cho 4 loại dịch vụ
- [ ] Loading State, Error State, Empty State
- [ ] Responsive

**Deliverables**: `modules/provider/ServicesManager.tsx` (rewrite), `store/apis/serviceApi.ts` (mới)

---

### US-4.5: Consolidate Admin API Layer

**Mô tả**: Loại bỏ dependency của Admin pages vào `src/api/adminApi.ts` (gọi endpoint sai). Tất cả Admin pages phải dùng `src/store/apis/adminApi.ts`.

**Acceptance Criteria**:
- [ ] `modules/admin/Dashboard.tsx` không import từ `src/api/adminApi.ts`
- [ ] `modules/admin/UserManager.tsx` không import từ `src/api/adminApi.ts`
- [ ] `modules/admin/ProviderApproval.tsx` không import từ `src/api/adminApi.ts`
- [ ] Tất cả hooks cần thiết được thêm vào `store/apis/adminApi.ts`
- [ ] Không còn endpoint URL sai trong code

**Deliverables**: Các file Admin đã sửa, `store/apis/adminApi.ts` mở rộng

---

## SPRINT 5 – CỘNG ĐỒNG & REVIEW

### Mục tiêu

Hoàn thiện tính năng cộng đồng (CRD §3.4): đánh giá, bình luận, community feed. Cải thiện Provider Analytics.

### Phạm vi (IN SCOPE)

- Cải thiện Review section (UC013)
- Community feed improvements (bình luận, like lịch trình)
- Provider Analytics wire đến dữ liệu thực (SP009)
- NCC phản hồi đánh giá (SP008)
- Trang chi tiết dịch vụ cải thiện (CRD §3.3.2)

### Loại trừ (OUT OF SCOPE)

- Blog writing/editing (nếu backend không có endpoint tạo blog)
- Admin moderation (Sprint 6)
- AI implementation
- SignalR realtime
- Booking, Notification

---

### US-5.1: Cải thiện Review Section

**CRD**: §3.4.2 UC013  
**Mô tả**: Traveler viết đánh giá cho địa điểm/dịch vụ. Backend có sẵn endpoint.

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Gửi đánh giá | `POST /reviews` | POST |
| Xem review địa điểm | `GET /reviews/place/{id}` | GET |
| Xem review dịch vụ | `GET /reviews/service/{id}` | GET |

**Acceptance Criteria**:
- [ ] Form đánh giá: sao (1-5), nội dung text, upload ảnh
- [ ] Hiển thị danh sách review trên trang chi tiết địa điểm/dịch vụ
- [ ] Điểm trung bình hiển thị đúng
- [ ] Loading/Error/Empty states

**Deliverables**: Review component cải thiện, RTK Query hooks

---

### US-5.2: Community Feed

**CRD**: §3.4.4  
**Mô tả**: Traveler tương tác cộng đồng: like, bình luận lịch trình.

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Xem feed | `GET /feeds` | GET |
| Like lịch trình | `POST /feeds/{tripId}/like` | POST |
| Bình luận | `POST /feeds/{tripId}/comment` | POST |
| Xem bình luận | `GET /feeds/{tripId}/comments` | GET |

**Acceptance Criteria**:
- [ ] Feed hiển thị lịch trình cộng đồng
- [ ] Nút Like hoạt động
- [ ] Section bình luận hoạt động
- [ ] Loading/Error/Empty states

**Deliverables**: Community feed component, RTK Query hooks

---

### US-5.3: Provider Analytics Wire

**CRD**: §3.6.3 Tab Analytics, SP009  
**Mô tả**: Wire Provider Analytics đến dữ liệu thực từ `GET /providers/{id}/dashboard`.

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Thống kê NCC | `GET /providers/{id}/dashboard` hoặc `GET /providers/user/{userId}/dashboard` | GET |

**Backend response** (từ `ProviderService.cs` L139-147):
```json
{
  "totalServices": number,
  "activeServices": number,
  "totalReviews": number,
  "averageRating": number,
  "monthlyRevenue": 0,
  "pendingBookings": 0
}
```

**Lưu ý**: `monthlyRevenue` và `pendingBookings` = 0 (hardcode trong backend, ngoài phạm vi CRD). Frontend chỉ hiển thị `totalServices`, `activeServices`, `totalReviews`, `averageRating`.

**Acceptance Criteria**:
- [ ] Analytics hiển thị dữ liệu thực từ backend
- [ ] Không hiển thị `monthlyRevenue` và `pendingBookings` (Booking ngoài phạm vi)
- [ ] Không dùng mock data
- [ ] Loading/Error/Empty states

**Deliverables**: `modules/provider/Analytics.tsx` (sửa), RTK Query hooks nếu cần

---

### US-5.4: Trang Chi tiết Dịch vụ

**CRD**: §3.3.2  
**Mô tả**: Cải thiện trang chi tiết: gallery ảnh, giá tham khảo, liên hệ NCC, review tổng hợp.

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Chi tiết địa điểm | `GET /places/{id}` | GET |
| Chi tiết khách sạn | `GET /places/hotels/{id}` | GET |
| Reviews | `GET /reviews/place/{id}` hoặc `GET /reviews/service/{id}` | GET |

**Acceptance Criteria**:
- [ ] Gallery ảnh hiển thị đúng
- [ ] Thông tin giá tham khảo
- [ ] Thông tin liên hệ NCC
- [ ] Section review tích hợp
- [ ] Nút "Thêm vào lịch trình" (chuyển đến Planner)
- [ ] Responsive

**Deliverables**: Service detail page component

---

## SPRINT 6 – ADMIN NÂNG CAO + CONTENT MODERATION

### Mục tiêu

Hoàn thiện Admin Panel nâng cao: content moderation, admin package management, và promotions preview.

### Phạm vi (IN SCOPE)

- Admin Package Manager (wire đến backend đã có)
- Admin Promotions Preview (wire đến backend đã có)
- Admin Service Moderation (Coming Soon hoặc wire nếu có endpoint)
- Admin Blog Moderation (Coming Soon hoặc wire nếu có endpoint)
- Admin Reports (Coming Soon hoặc wire nếu có endpoint)

### Loại trừ (OUT OF SCOPE)

- Tạo backend endpoint mới
- Review moderation (backend không có endpoint)
- AI, Booking, Notification

---

### US-6.1: Admin Package Manager

**CRD**: Quản lý gói NCC  
**Mô tả**: Wire `AdminPackagesManager.tsx` (stub) đến backend `AdminProviderPackageController` đầy đủ. RTK Query hooks đã có sẵn trong `store/apis/adminApi.ts`.

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Danh sách NCC | `GET /admin/provider-packages/providers` | GET |
| Chi tiết NCC | `GET /admin/provider-packages/providers/{providerId}` | GET |
| Danh sách gói | `GET /admin/provider-packages/packages` | GET |
| Cấp gói cho NCC | `POST /admin/provider-packages/assign` | POST |
| Gia hạn | `POST /admin/provider-packages/extend` | POST |
| Hết hạn | `POST /admin/provider-packages/expire` | POST |
| Thống kê | `GET /admin/provider-packages/statistics` | GET |

**RTK Query hooks đã có** (từ `store/apis/adminApi.ts`):
- `useGetAdminProvidersQuery`
- `useGetAdminPackagesQuery`
- `useAssignPackageMutation`
- `useExtendPackageMutation`
- `useExpirePackageMutation`
- `useGetAdminStatisticsQuery`

**Acceptance Criteria**:
- [ ] Danh sách NCC với gói hiện tại
- [ ] Nút Cấp gói / Gia hạn / Hết hạn hoạt động
- [ ] Thống kê gói quảng bá hiển thị
- [ ] Loading/Error/Empty states
- [ ] Responsive

**Deliverables**: `modules/admin/AdminPackagesManager.tsx` (rewrite)

---

### US-6.2: Admin Promotions Preview

**CRD**: §3.6.4  
**Mô tả**: Wire `AdminPromotionsPreview.tsx` (stub) đến backend endpoint preview.

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Preview promotion | `GET /admin/provider-packages/promotions-preview` | GET |

**RTK Query hook đã có**: `useGetAdminPromotionsPreviewQuery`

**Acceptance Criteria**:
- [ ] Hiển thị preview danh sách NCC được promote
- [ ] Badge type hiển thị từ backend (không tự tính)
- [ ] Loading/Error/Empty states

**Deliverables**: `modules/admin/AdminPromotionsPreview.tsx` (rewrite)

---

### US-6.3: Admin Content Moderation Pages

**CRD**: §3.7.1 UC019  
**Mô tả**: Backend LOCKED — không có endpoint admin cho service/blog/review moderation. Frontend cần xử lý phù hợp.

**Phương án**:
- Nếu backend có endpoint tương đương (VD: filter services by status) → wire đến endpoint đó
- Nếu không có endpoint nào → hiển thị "Tính năng đang phát triển" với UI placeholder chuyên nghiệp

**Acceptance Criteria**:
- [ ] `ServiceModeration.tsx` — hiển thị Coming Soon hoặc wire đúng endpoint
- [ ] `BlogModeration.tsx` — hiển thị Coming Soon hoặc wire đúng endpoint
- [ ] `Reports.tsx` — hiển thị Coming Soon hoặc wire đúng endpoint
- [ ] Không gọi endpoint không tồn tại
- [ ] UI Coming Soon phải chuyên nghiệp (không phải text trắng)

**Deliverables**: Các file admin moderation (sửa)

---

## SPRINT 7 – POLISH & HOÀN THIỆN

### Mục tiêu

Đánh bóng toàn bộ hệ thống: responsive, error handling, API layer cleanup, trải nghiệm người dùng.

### Phạm vi (IN SCOPE)

- Responsive audit toàn bộ pages
- Error/Loading/Empty state audit
- Xóa API layer cũ (`src/api/adminApi.ts`)
- Xóa mock data còn sót
- Provider Profile page cải thiện
- Hồ sơ cá nhân Traveler cải thiện (CRD §3.1.4)
- Xu hướng và gợi ý (CRD §3.3.3)
- Cải thiện trang chủ (Home)

### Loại trừ (OUT OF SCOPE)

- Tính năng mới ngoài CRD
- Backend changes
- Database changes
- AI implementation
- SignalR realtime

---

### US-7.1: Responsive Audit

**CRD**: §IV (Tương thích: Responsive mobile & desktop)

**Acceptance Criteria**:
- [ ] Tất cả pages test trên 375px, 768px, 1920px
- [ ] Không có overflow horizontal trên mobile
- [ ] Navigation collapse đúng trên mobile
- [ ] Bảng dữ liệu scroll horizontal trên mobile
- [ ] Form full-width trên mobile

**Deliverables**: Sửa responsive toàn bộ pages

---

### US-7.2: Error/Loading/Empty State Audit

**Acceptance Criteria**:
- [ ] Tất cả pages có data fetching đều có Loading State
- [ ] Tất cả pages có data fetching đều có Error State (với nút retry)
- [ ] Tất cả pages có danh sách đều có Empty State
- [ ] Không có trang trắng khi đang tải hoặc lỗi

**Deliverables**: Audit report + sửa các pages thiếu

---

### US-7.3: API Layer Cleanup

**Acceptance Criteria**:
- [ ] Loại bỏ tất cả endpoint sai trong `src/api/adminApi.ts`
- [ ] Tất cả Admin pages dùng `src/store/apis/adminApi.ts`
- [ ] Xóa code gọi endpoint không tồn tại
- [ ] Không còn duplicate RTK Query endpoint

**Deliverables**: `src/api/adminApi.ts` cleanup, các pages sửa import

---

### US-7.4: Hồ sơ cá nhân Traveler

**CRD**: §3.1.4 UC004

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Lấy thông tin | `GET /auth/me` | GET |

**Acceptance Criteria**:
- [ ] Trang hồ sơ hiển thị: avatar, tên, email, phone
- [ ] Form cập nhật thông tin
- [ ] Upload avatar
- [ ] Responsive

**Deliverables**: Profile page component

---

### US-7.5: Trang chủ & Xu hướng

**CRD**: §3.3.3

**API Mapping**:

| Hành động | API Backend | Method |
|---|---|---|
| Gợi ý | `POST /trips/recommendations` | POST |
| NCC nổi bật | `GET /providers/featured` | GET |

**Acceptance Criteria**:
- [ ] Trang chủ hiển thị địa điểm trending
- [ ] Section NCC nổi bật với badge
- [ ] Gợi ý lịch trình
- [ ] CTA "Tạo chuyến đi mới"
- [ ] Responsive, animation

**Deliverables**: `modules/home/Home.tsx` cải thiện

---

## TỔNG HỢP SPRINT

| Sprint | Mục tiêu | User Stories | Focus |
|---|---|---|---|
| **Sprint 4** | Admin Core + Provider Services | US-4.1 → US-4.5 | Wire đúng backend, Services Manager |
| **Sprint 5** | Cộng đồng & Review | US-5.1 → US-5.4 | Review, Feed, Analytics, Service Detail |
| **Sprint 6** | Admin Nâng cao | US-6.1 → US-6.3 | Package Manager, Promotions, Moderation |
| **Sprint 7** | Polish & Hoàn thiện | US-7.1 → US-7.5 | Responsive, Cleanup, UX |
