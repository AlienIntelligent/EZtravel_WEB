# 02 – SYSTEM BASELINE (Đóng Băng Trạng Thái Hệ Thống)

**Phiên bản**: 1.0  
**Ngày đóng băng**: 2026-06-07  
**Mục đích**: Ghi nhận trạng thái chính xác của hệ thống tại thời điểm đóng băng, làm cơ sở cho mọi Sprint phát triển Frontend tiếp theo.

---

## I. DATABASE BASELINE

### 1.1 Tổng quan

- **DBMS**: SQL Server
- **Schema file**: `database/archive/schema_EZtravel.sql`
- **Tổng số bảng**: 37
- **Trạng thái**: LOCKED

### 1.2 Danh sách bảng theo domain

#### Domain: Identity & Auth

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `NGUOI_DUNG` | `NguoiDung` | Người dùng (Traveler / NCC / Admin) |
| `OTP_XAC_THUC` | `OtpXacThuc` | Mã OTP xác thực |
| `REFRESH_TOKEN` | `RefreshToken` | Token làm mới JWT |

#### Domain: Trip Planning

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `LICH_TRINH` | `LichTrinh` | Lịch trình du lịch |
| `NGAY_LICH_TRINH` | `NgayLichTrinh` | Từng ngày trong lịch trình |
| `DIA_DIEM_LICH_TRINH` | `DiaDiemLichTrinh` | Địa điểm trong ngày |
| `DICH_VU_LICH_TRINH` | `DichVuLichTrinh` | Dịch vụ trong ngày |
| `CHI_PHI_DICH_VU_LICH_TRINH` | `ChiPhiDichVuLichTrinh` | Chi phí từng dịch vụ |
| `CHIA_SE_LICH_TRINH` | `ChiaSeLichTrinh` | Chia sẻ lịch trình |
| `LUU_LICH_TRINH` | `LuuLichTrinh` | Lưu/bookmark lịch trình |
| `THICH_LICH_TRINH` | `ThichLichTrinh` | Like lịch trình |
| `LICH_SU_CLONE` | `LichSuClone` | Lịch sử clone |

#### Domain: Discovery

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `DIA_DIEM` | `DiaDiem` | Địa điểm du lịch |
| `ANH_DIA_DIEM` | `AnhDiaDiem` | Ảnh địa điểm |
| `TINH_THANH` | `TinhThanh` | Tỉnh/thành phố |
| `TAG` | `Tag` | Tag du lịch |
| `DIA_DIEM_TAG` | (Join table) | Liên kết địa điểm – tag |

#### Domain: Service (Dịch vụ NCC)

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `DICH_VU` | `DichVu` | Dịch vụ (4 loại: Khách sạn, Nhà hàng, Phương tiện, Hoạt động) |
| `ANH_DICH_VU` | `AnhDichVu` | Ảnh dịch vụ |

#### Domain: Community

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `DANH_GIA` | `DanhGia` | Đánh giá (review) |
| `ANH_DANH_GIA` | `AnhDanhGia` | Ảnh đính kèm đánh giá |
| `PHAN_HOI_DANH_GIA` | `PhanHoiDanhGia` | Phản hồi của NCC |
| `BAI_VIET` | `BaiViet` | Bài viết blog |
| `ANH_BAI_VIET` | `AnhBaiViet` | Ảnh bài viết |
| `BINH_LUAN_BAI_VIET` | `BinhLuanBaiViet` | Bình luận bài viết |
| `THICH_BAI_VIET` | `ThichBaiViet` | Like bài viết |
| `BAO_CAO_NOI_DUNG` | `BaoCaoNoiDung` | Báo cáo vi phạm |
| `DUYET_NOI_DUNG` | `DuyetNoiDung` | Kiểm duyệt nội dung |

#### Domain: Social

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `THEO_DOI_NGUOI_DUNG` | `TheoDoiNguoiDung` | Follow người dùng |
| `THONG_BAO` | `ThongBao` | Thông báo |

#### Domain: Provider (NCC)

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `NHA_CUNG_CAP` | `NhaCungCap` | Nhà cung cấp dịch vụ |

#### Domain: Provider Promotion (Monetization B)

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `GOI_DICH_VU_NCC` | `GoiDichVuNcc` | Cấu hình gói quảng bá NCC |
| `DANG_KY_GOI_NCC` | `DangKyGoiNcc` | Lịch sử đăng ký gói NCC |
| `THANH_TOAN_NCC` | `ThanhToanNcc` | Thanh toán gói quảng bá |

#### Domain: Traveler Subscription (Monetization A)

| Bảng | Entity C# | Mô tả |
|---|---|---|
| `GOI_DICH_VU` | `GoiDichVu` | Gói dịch vụ Traveler (Free/Premium) |
| `DANG_KY_GOI` | `DangKyGoi` | Đăng ký gói Traveler |
| `LICH_SU_AI` | `LichSuAi` | Lịch sử sử dụng AI |

---

## II. BACKEND BASELINE

### 2.1 Kiến trúc

- **Framework**: ASP.NET Core 8 (Web API)
- **Kiến trúc**: Microservices (6 service) + YARP API Gateway
- **ORM**: Entity Framework Core 8
- **Auth**: JWT Bearer + Refresh Token
- **Trạng thái**: LOCKED

### 2.2 Microservices

| Service | Port | Project |
|---|---|---|
| API Gateway | — | `ezTravel.ApiGateway` |
| Auth Service | 7001 | `ezTravel.AuthService` |
| Trip Service | 7002 | `ezTravel.TripService` |
| Place Service | 7003 | `ezTravel.PlaceService` |
| Booking Service | 7004 | `ezTravel.BookingService` (chứa Provider + Package) |
| Community Service | 7005 | `ezTravel.CommunityService` |
| Admin Service | 7006 | `ezTravel.AdminService` |

### 2.3 API Endpoints đang tồn tại

#### Auth Service (`api/auth`)
- `POST /register` — Đăng ký
- `POST /login` — Đăng nhập
- `POST /refresh-token` — Làm mới token
- `POST /verify-otp` — Xác thực OTP
- `GET /me` — Lấy thông tin user

#### Trip Service (`api/trips`)
- `GET /` — Lấy lịch trình của user
- `GET /{id}` — Chi tiết lịch trình
- `POST /` — Tạo lịch trình
- `PUT /{id}` — Cập nhật lịch trình
- `DELETE /{id}` — Xóa lịch trình
- `POST /{id}/locations` — Thêm địa điểm
- `DELETE /{id}/items/{itemId}` — Xóa địa điểm
- `PUT /{id}/reorder` — Sắp xếp lại
- `GET /{id}/cost` — Tính chi phí
- `POST /{id}/clone` — Clone lịch trình
- `GET /metadata/styles` — Phong cách du lịch
- `GET /metadata/targets` — Đối tượng du lịch
- `GET /metadata/budgets` — Mức ngân sách
- `POST /recommendations` — Gợi ý

#### Place Service (`api/places`)
- `GET /search` — Tìm kiếm địa điểm
- `GET /{id}` — Chi tiết
- `GET /nearby` — Gần đây
- `POST /` — Tạo địa điểm
- `PUT /{id}` — Cập nhật
- `DELETE /{id}` — Xóa
- `GET /categories` — Danh mục tỉnh/thành
- `GET /categories/{id}` — Chi tiết tỉnh/thành
- `POST /categories` — Tạo tỉnh/thành
- `PUT /categories/{id}` — Cập nhật
- `DELETE /categories/{id}` — Xóa

Tương tự cho `api/places/hotels`, `api/places/restaurants`, `api/places/activities`, `api/places/vehicles`.

#### Provider Management (`api/providers`)
- `GET /{id}` — Lấy NCC theo ID
- `GET /{id}/dashboard` — Dashboard stats
- `GET /user/{userId}` — Lấy NCC theo userId
- `GET /user/{userId}/dashboard` — Dashboard stats theo userId
- `GET /featured` — NCC nổi bật
- `GET /explore-promoted` — NCC quảng bá Explore
- `GET /` — (Admin) Tất cả NCC
- `GET /pending` — (Admin) NCC chờ duyệt
- `POST /` — Đăng ký NCC
- `PUT /{id}` — Cập nhật NCC
- `DELETE /{id}` — Xóa NCC
- `POST /{id}/approve` — Duyệt NCC
- `POST /{id}/reject` — Từ chối NCC

#### Provider Package (`api/provider`)
- `GET /packages` — Danh sách gói
- `GET /current-package` — Gói hiện tại
- `GET /package-history` — Lịch sử gói
- `POST /register-package` — Đăng ký gói
- `GET /payment-history` — Lịch sử thanh toán

#### Community (`api/feeds`, `api/reviews`)
- `GET /feeds` — Feed cộng đồng
- `POST /feeds/{tripId}/like` — Like lịch trình
- `POST /feeds/{tripId}/comment` — Bình luận
- `GET /feeds/{tripId}/comments` — Danh sách bình luận
- `POST /reviews` — Đăng đánh giá
- `GET /reviews/place/{id}` — Đánh giá địa điểm
- `GET /reviews/service/{id}` — Đánh giá dịch vụ

#### Admin (`api/admin`)
- `GET /users` — Danh sách user
- `POST /users/{id}/lock` — Khóa user
- `GET /dashboard` — Dashboard thống kê
- `GET /bookings` — (trả về rỗng)
- `GET /payments` — (trả về rỗng)

#### Admin Provider Packages (`api/admin/provider-packages`)
- `GET /providers` — Danh sách NCC
- `GET /providers/{providerId}` — Chi tiết NCC
- `GET /packages` — Danh sách gói
- `POST /assign` — Cấp gói cho NCC
- `POST /extend` — Gia hạn gói
- `POST /expire` — Hết hạn gói
- `GET /statistics` — Thống kê gói
- `GET /promotions-preview` — Xem trước promotion

### 2.4 Business Services

| Service | File | Phương thức chính |
|---|---|---|
| `AuthService` | `Services/Auth/AuthService.cs` | Register, Login, VerifyOtp, RefreshToken, GetMe |
| `TripService` | `Services/Trips/TripService.cs` | CRUD Trip, AddLocation, Reorder, Clone, CalculateCost |
| `PlaceService` | `Services/Places/PlaceService.cs` | Search, CRUD Place, CRUD TinhThanh |
| `ProviderService` | `Services/Providers/ProviderService.cs` | CRUD Provider, Approve, Reject, DashboardStats |
| `NccPackageService` | `Services/Providers/NccPackageService.cs` | CRUD Package, Register, Payment, Admin operations |
| `PromotionService` | `Services/Promotion/PromotionService.cs` | FeaturedProviders, ExplorePromoted, BadgeType, PromotionScore |
| `AdminService` | `Services/Admin/AdminService.cs` | GetAllUsers, LockUser, DashboardStats |
| `CommunityService` | `Services/Community/CommunityService.cs` | Reviews, Feeds, Likes, Comments |

---

## III. FRONTEND BASELINE

### 3.1 Công nghệ

| Thành phần | Phiên bản |
|---|---|
| React | 19.2.5 |
| Vite | 8.0.10 |
| TypeScript | 6.0.3 |
| React Router DOM | 7.1.5 |
| Redux Toolkit (RTK) | 2.12.0 |
| TailwindCSS | 4.3.0 |
| Lucide React | Icons |

### 3.2 Layouts

| Layout | File | Phạm vi |
|---|---|---|
| `MainLayout` | `layouts/MainLayout.tsx` | Trang công khai (Home, Explore, Planner) |
| `AuthLayout` | `layouts/AuthLayout.tsx` | Đăng nhập/đăng ký |
| `AdminLayout` | `layouts/AdminLayout.tsx` | Admin panel |
| `ProviderLayout` | `layouts/ProviderLayout.tsx` | Provider portal |
| `AILayout` | `layouts/AILayout.tsx` | AI assistant |
| `PublicLayout` | `layouts/PublicLayout.tsx` | Layout công khai thay thế |

### 3.3 Routes đã đăng ký

**Nguồn**: `routes/index.tsx`

| Route | Component | Guard |
|---|---|---|
| `/` | `Home` | Public |
| `/explore` | `ExploreWorkspace` | Public |
| `/planner` | `TripPlannerWorkspace` | Public |
| `/planner/:id` | `TripPlannerWorkspace` | Public |
| `/login` | `Login` | GuestGuard |
| `/register` | `Register` | GuestGuard |
| `/forgot-password` | `ForgotPassword` | GuestGuard |
| `/verify-otp` | `OtpVerification` | GuestGuard |
| `/reset-password` | `ResetPassword` | GuestGuard |
| `/admin` | `AdminDashboard` | ProtectedRoute + RoleGuard("ADMIN") |
| `/admin/users` | `UserManager` | ProtectedRoute + RoleGuard("ADMIN") |
| `/admin/places` | `PlacesManager` | ProtectedRoute + RoleGuard("ADMIN") |
| `/admin/providers` | `ProviderApproval` | ProtectedRoute + RoleGuard("ADMIN") |
| `/admin/services` | `ServiceModeration` | ProtectedRoute + RoleGuard("ADMIN") |
| `/admin/blogs` | `BlogModeration` | ProtectedRoute + RoleGuard("ADMIN") |
| `/admin/reports` | `Reports` | ProtectedRoute + RoleGuard("ADMIN") |
| `/admin/provider-packages` | `AdminPackagesManager` | ProtectedRoute + RoleGuard("ADMIN") |
| `/admin/promotions-preview` | `AdminPromotionsPreview` | ProtectedRoute + RoleGuard("ADMIN") |
| `/provider/dashboard` | `ProviderDashboard` | ProtectedRoute + RoleGuard("PROVIDER") |
| `/provider/packages` | `ProviderPackages` | ProtectedRoute + RoleGuard("PROVIDER") |
| `/provider/current-package` | `ProviderCurrentPackage` | ProtectedRoute + RoleGuard("PROVIDER") |
| `/provider/package-history` | `ProviderPackageHistory` | ProtectedRoute + RoleGuard("PROVIDER") |
| `/provider/payment-history` | `ProviderPaymentHistory` | ProtectedRoute + RoleGuard("PROVIDER") |
| `/provider/promotions` | `ProviderPromotions` | ProtectedRoute + RoleGuard("PROVIDER") |
| `/provider/services` | `ServicesManager` | ProtectedRoute + RoleGuard("PROVIDER") |
| `/ai` | `Assistant` | Public |
| `/ai/planner` | `AIPlanner` | Public |
| `/ai/history` | `History` | Public |

### 3.4 RTK Query API Layers

**Có HAI tầng API song song:**

| Thư mục | File | Phạm vi | Ghi chú |
|---|---|---|---|
| `src/api/` | `adminApi.ts` | Admin legacy | Gọi endpoint KHÔNG tồn tại |
| `src/api/` | `providerApi.ts` | Provider legacy | Gọi endpoint một phần đúng |
| `src/api/` | `exploreApi.ts` | Explore | Đang hoạt động |
| `src/api/` | `tripApi.ts` | Trip Planner | Đang hoạt động |
| `src/api/` | `authApi.ts` | Auth | Đang hoạt động |
| `src/api/` | `aiApi.ts` | AI | Đang hoạt động |
| `src/store/apis/` | `providerApi.ts` | Provider Sprint 3 | Đúng endpoint |
| `src/store/apis/` | `adminApi.ts` | Admin packages Sprint 3 | Đúng endpoint |
| `src/store/apis/` | `exploreApi.ts` | Explore promoted | Đúng endpoint |

---

## IV. KNOWN LIMITATIONS (Giới hạn đã biết)

### 4.1 Backend Limitations

| ID | Giới hạn | File | Dòng |
|---|---|---|---|
| BL-001 | `AdminService.LockUserAsync` là stub — trả về `true` mà không thay đổi trạng thái user | `AdminService.cs` | L29-35 |
| BL-002 | `AdminService.GetDashboardStatsAsync` chỉ trả về `TotalUsers` và `TotalTrips` | `AdminService.cs` | L37-53 |
| BL-003 | `AdminService.GetAllBookingsAsync` trả về danh sách rỗng (Booking ngoài phạm vi CRD) | `AdminService.cs` | L55-59 |
| BL-004 | `AdminService.GetAllUsersAsync` không có phân trang | `AdminService.cs` | L16-27 |
| BL-005 | `PlacesController` POST/PUT chưa bật `[Authorize(Roles = "Admin")]` | `PlacesController.cs` | L41, L51 |
| BL-006 | `ProviderService.GetProviderDashboardStatsAsync` trả về `bookingsCount=0`, `monthlyRevenue=0` (hardcode) | `ProviderService.cs` | L134-137 |
| BL-007 | Không có endpoint admin cho service/blog/review moderation | `AdminController.cs` | — |
| BL-008 | `PromotionService.CalculatePromotionScore` không khớp 100% công thức CRD | `PromotionService.cs` | L29-33 |

### 4.2 Frontend Limitations

| ID | Giới hạn | File |
|---|---|---|
| FL-001 | `AdminDashboard` render KPI fields mà backend không trả về | `modules/admin/Dashboard.tsx` |
| FL-002 | `UserManager` gọi endpoint `PUT /admin/users/{id}/status` — không tồn tại | `api/adminApi.ts` L112-119 |
| FL-003 | `ProviderApproval` gọi endpoint `GET /admin/providers` — không tồn tại | `api/adminApi.ts` L34-44 |
| FL-004 | `ServiceModeration` gọi endpoint `GET /admin/services` — không tồn tại | `api/adminApi.ts` L55-65 |
| FL-005 | `BlogModeration` gọi endpoint `GET /admin/blogs` — không tồn tại | `api/adminApi.ts` L122-132 |
| FL-006 | `AdminPackagesManager` là stub (11 dòng) | `modules/admin/AdminPackagesManager.tsx` |
| FL-007 | `AdminPromotionsPreview` là stub (11 dòng) | `modules/admin/AdminPromotionsPreview.tsx` |
| FL-008 | `ServicesManager` là stub Coming Soon | `modules/provider/ServicesManager.tsx` |
| FL-009 | Hai tầng API song song (`src/api/` vs `src/store/apis/`) | — |

---

## V. KNOWN TECHNICAL DEBT (Nợ kỹ thuật đã biết)

| ID | Mô tả | Tầng | Ưu tiên |
|---|---|---|---|
| TD-001 | `PackageStatisticsDto` xác định Premium bằng `TenGoi.Contains("PREMIUM")` (string matching) | Backend | Thấp |
| TD-002 | `ProvidersController` PUT/DELETE dùng `[Authorize]` mà không kiểm tra ownership | Backend | Trung bình |
| TD-003 | `UserDto` không trả về trường `TrangThai` | Backend | Trung bình |
| TD-004 | Hai tầng API layer gây nguy cơ endpoint shadowing | Frontend | Cao |
| TD-005 | CRD khuyến nghị Monolith nhưng hệ thống dùng Microservices | Kiến trúc | Thấp (không ảnh hưởng chức năng) |
