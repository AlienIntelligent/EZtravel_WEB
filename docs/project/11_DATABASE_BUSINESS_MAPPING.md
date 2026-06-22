# 11 – MAPPING CƠ SỞ DỮ LIỆU VÀ NGHIỆP VỤ (Database Business Mapping)

**Phiên bản**: 1.0  
**Ngày tạo**: 2026-06-07  
**Nguồn chân lý**: Database Schema (`database/archive/schema_EZtravel.sql`) — 37 bảng  
**Đối chiếu**: CRD_EZtravel_v3.docx, Backend Services, Frontend Components  
**Ràng buộc**: Database LOCKED — KHÔNG sửa đổi schema dưới bất kỳ hình thức nào

---

## 1. MỤC ĐÍCH

Tài liệu này biến **database schema kỹ thuật** thành **ngôn ngữ nghiệp vụ** để:

- Developer mới hiểu ý nghĩa từng bảng trong 10 phút
- Frontend developer biết bảng nào liên quan đến trang nào
- Business Analyst đối chiếu database ↔ CRD nhanh chóng
- Sprint Planning xác định phạm vi dữ liệu cho mỗi tính năng

---

## 2. QUY TẮC ĐỌC DATABASE

### 2.1 Tên bảng → Nghiệp vụ

| Ký pháp | Ý nghĩa |
|---|---|
| `NGUOI_DUNG` | Người dùng (user) |
| `NHA_CUNG_CAP` | Nhà cung cấp (provider) |
| `LICH_TRINH` | Lịch trình du lịch (trip) |
| `DIA_DIEM` | Địa điểm du lịch (place) |
| `DICH_VU` | Dịch vụ NCC (service) |
| `DANH_GIA` | Đánh giá/review |
| `BAI_VIET` | Bài viết blog (post) |
| `GOI_DICH_VU_NCC` | Gói quảng bá NCC (provider package) |
| `GOI_DICH_VU` | Gói dịch vụ Traveler (traveler subscription) |

### 2.2 Quy tắc quan trọng

1. **Database = Chân lý dữ liệu** — sau CRD trong thứ tự ưu tiên
2. **Database LOCKED** — không thêm bảng, cột, index, constraint
3. **Phân biệt rõ**:
   - `GOI_DICH_VU` / `DANG_KY_GOI` / `LICH_SU_AI` = **Traveler Subscription** (gói người dùng)
   - `GOI_DICH_VU_NCC` / `DANG_KY_GOI_NCC` / `THANH_TOAN_NCC` = **Provider Promotion** (gói quảng bá NCC)
4. Hai hệ thống monetization **hoạt động độc lập**

---

## 3. NHÓM AUTHENTICATION (3 bảng)

### NGUOI_DUNG

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Lưu thông tin tất cả người dùng hệ thống: Traveler, Provider, Admin |
| **Entity C#** | `NguoiDung` |
| **CRUD** | Register, Login, GetMe, LockUser, GetAllUsers |
| **API sử dụng** | `AuthController` (Register, Login, GetMe), `AdminController` (GetUsers, LockUser) |
| **Frontend sử dụng** | `Login.tsx`, `Register.tsx`, `UserManager.tsx`, `AdminDashboard.tsx` |
| **CRD** | §3.1.1 (Đăng ký), §3.1.2 (Đăng nhập), §3.1.4 (Hồ sơ), §3.7.2 (Admin quản lý user) |

### OTP_XAC_THUC

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Lưu mã OTP 6 số để xác thực email khi đăng ký / quên mật khẩu |
| **Entity C#** | `OtpXacThuc` |
| **CRUD** | Create (khi gửi OTP), Read (khi verify), Delete (khi hết hạn) |
| **API sử dụng** | `AuthController` (verify-otp, forgot-password) |
| **Frontend sử dụng** | `OtpVerification.tsx`, `ForgotPassword.tsx` |
| **CRD** | §3.1.1 (OTP 6 số, 10 phút hết hạn, 5 lần sai khóa 15p) |

### REFRESH_TOKEN

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Lưu refresh token JWT để tự động gia hạn phiên đăng nhập |
| **Entity C#** | `RefreshToken` |
| **CRUD** | Create (khi login), Read (khi refresh), Delete (khi logout/hết hạn) |
| **API sử dụng** | `AuthController` (refresh-token) |
| **Frontend sử dụng** | `api/authApi.ts` (auto refresh interceptor) |
| **CRD** | §3.1.2 (Access 15-30p, Refresh 7-30 ngày) |

---

## 4. NHÓM TRAVELER — LỊCH TRÌNH (9 bảng)

### LICH_TRINH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Lưu lịch trình du lịch do Traveler tạo — bảng trung tâm của domain Trip |
| **Entity C#** | `LichTrinh` |
| **CRUD** | Create, Read, Update, Delete, Clone |
| **API sử dụng** | `TripsController` (GetMyTrips, GetTrip, CreateTrip, UpdateTrip, DeleteTrip, CloneTrip) |
| **Frontend sử dụng** | `TripPlannerWorkspace.tsx`, `api/tripApi.ts` |
| **CRD** | §3.2.1 (Tạo lịch trình), §3.2.6 (Clone), §3.4.1 (Chia sẻ công khai) |

### NGAY_LICH_TRINH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Mỗi ngày trong lịch trình — chia timeline theo ngày |
| **Entity C#** | `NgayLichTrinh` |
| **CRUD** | Tạo/xóa khi sửa lịch trình |
| **API sử dụng** | `TripsController` (nested trong Trip CRUD) |
| **Frontend sử dụng** | `TripPlannerWorkspace.tsx` (DayTabBar, DayCanvas) |
| **CRD** | §3.2.1 (Timeline theo ngày) |

### DIA_DIEM_LICH_TRINH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Địa điểm được thêm vào một ngày cụ thể trong lịch trình |
| **Entity C#** | `DiaDiemLichTrinh` |
| **CRUD** | AddLocation, RemoveLocation, Reorder |
| **API sử dụng** | `TripsController` (AddLocation, RemoveLocation, ReorderItems) |
| **Frontend sử dụng** | `TripPlannerWorkspace.tsx` (DnD, PlaceCard) |
| **CRD** | §3.2.2 (Drag & Drop), §3.2.3 (Sắp xếp) |

### DICH_VU_LICH_TRINH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Dịch vụ (KS/NH/PT/HĐ) được thêm vào một ngày trong lịch trình |
| **Entity C#** | `DichVuLichTrinh` |
| **CRUD** | Tương tự DIA_DIEM_LICH_TRINH |
| **API sử dụng** | `TripsController` (nested) |
| **Frontend sử dụng** | `TripPlannerWorkspace.tsx` |
| **CRD** | §3.2.2 |

### CHI_PHI_DICH_VU_LICH_TRINH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Chi phí của từng dịch vụ trong lịch trình — cơ sở tính ngân sách |
| **Entity C#** | `ChiPhiDichVuLichTrinh` |
| **CRUD** | Tạo/cập nhật khi thêm dịch vụ |
| **API sử dụng** | `TripsController` (CalculateTotalCost) |
| **Frontend sử dụng** | `TripPlannerWorkspace.tsx` (BudgetPanel) |
| **CRD** | §3.2.4 (Quản lý ngân sách realtime) |

### CHIA_SE_LICH_TRINH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Quản lý chia sẻ lịch trình (View/Edit permission) cho cộng tác |
| **Entity C#** | `ChiaSeLichTrinh` |
| **CRUD** | — (Backend LOCKED — không có share endpoint) |
| **API sử dụng** | ❌ Không có API |
| **Frontend sử dụng** | ❌ Chưa sử dụng |
| **CRD** | §3.2.5 UC017 (Cộng tác realtime) — **Deferred** |

### LUU_LICH_TRINH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Bookmark/save lịch trình — Traveler lưu lịch trình yêu thích |
| **Entity C#** | `LuuLichTrinh` |
| **CRUD** | — (Endpoint chưa rõ) |
| **API sử dụng** | ⚠️ Có thể qua `FeedsController` (chưa xác nhận) |
| **Frontend sử dụng** | ❌ Chưa sử dụng — SavedItems page chưa tồn tại |
| **CRD** | §3.4.4 (Like/Save lịch trình) |

### THICH_LICH_TRINH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Like lịch trình trong community feed |
| **Entity C#** | `ThichLichTrinh` |
| **CRUD** | Create/Delete (toggle like) |
| **API sử dụng** | `FeedsController` (LikeTrip) |
| **Frontend sử dụng** | ⚠️ Partial — feed nhúng trong Explore |
| **CRD** | §3.4.4 |

### LICH_SU_CLONE

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Ghi lại lịch sử clone lịch trình — tracking tham chiếu |
| **Entity C#** | `LichSuClone` |
| **CRUD** | Create (khi clone) |
| **API sử dụng** | `TripsController` (CloneTrip) |
| **Frontend sử dụng** | ✅ Clone button trong TripPlanner |
| **CRD** | §3.2.6 |

---

## 5. NHÓM PLANNER — KHÁM PHÁ (5 bảng)

### DIA_DIEM

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Danh mục địa điểm du lịch — kho dữ liệu chính cho Explore |
| **Entity C#** | `DiaDiem` |
| **CRUD** | Search, GetById, Create, Update, Delete |
| **API sử dụng** | `PlacesController` (Search, GetById, CRUD) |
| **Frontend sử dụng** | `ExploreWorkspace.tsx`, `api/exploreApi.ts` |
| **CRD** | §3.3.1 (Tìm kiếm), §3.3.2 (Chi tiết), §3.7.3 (Admin quản lý) |

### ANH_DIA_DIEM

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Ảnh của địa điểm — dùng cho gallery và thumbnail |
| **Entity C#** | `AnhDiaDiem` |
| **CRUD** | Nested trong Place CRUD |
| **API sử dụng** | `PlacesController` (nested) |
| **Frontend sử dụng** | ⚠️ Thumbnail only — ImageGallery chưa hoàn thiện |
| **CRD** | §3.3.2 |

### TINH_THANH

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Tỉnh/thành phố — bộ lọc chính trong Explore |
| **Entity C#** | `TinhThanh` |
| **CRUD** | GetAll, GetById, Create, Update, Delete |
| **API sử dụng** | `PlacesController` (Categories endpoints) |
| **Frontend sử dụng** | `ExploreWorkspace.tsx` (filter), `PlacesManager.tsx` (admin CRUD) |
| **CRD** | §3.3.1, §3.7.3 UC020 |

### TAG

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Tag du lịch (ẩm thực, nghỉ dưỡng, mạo hiểm...) — bộ lọc bổ sung |
| **Entity C#** | `Tag` |
| **CRUD** | Read (lọc) |
| **API sử dụng** | `PlacesController` (nested trong search) |
| **Frontend sử dụng** | `ExploreWorkspace.tsx` (FilterPanel) |
| **CRD** | §3.3.1 |

### DIA_DIEM_TAG

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Bảng liên kết N-N giữa địa điểm và tag |
| **Entity C#** | Join table (không có entity riêng) |
| **CRUD** | Tự động khi tạo/sửa địa điểm |
| **API sử dụng** | `PlacesController` (nested) |
| **Frontend sử dụng** | `ExploreWorkspace.tsx` (tag filter) |
| **CRD** | §3.3.1 |

---

## 6. NHÓM EXPLORE — DỊCH VỤ (2 bảng)

### DICH_VU

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Dịch vụ NCC — 4 loại: Khách sạn, Nhà hàng, Phương tiện, Hoạt động |
| **Entity C#** | `DichVu` |
| **CRUD** | Search, GetById, Create, Update, Delete (theo 4 controller riêng) |
| **API sử dụng** | `HotelsController`, `RestaurantsController`, `ActivitiesController`, `VehiclesController` |
| **Frontend sử dụng** | `ExploreWorkspace.tsx` (search) — `ServicesManager.tsx` = **Stub** |
| **CRD** | §3.3.1 (Explore), §3.6.2 SP003-SP005 (NCC quản lý dịch vụ) |

### ANH_DICH_VU

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Ảnh của dịch vụ NCC — gallery ảnh dịch vụ |
| **Entity C#** | `AnhDichVu` |
| **CRUD** | Nested trong Service CRUD |
| **API sử dụng** | Hotels/Restaurants/Activities/Vehicles Controllers |
| **Frontend sử dụng** | ❌ Chưa sử dụng — Service image gallery chưa hiển thị |
| **CRD** | §3.6.2 |

---

## 7. NHÓM COMMUNITY (9 bảng)

### DANH_GIA

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Đánh giá/review của Traveler cho địa điểm hoặc dịch vụ |
| **Entity C#** | `DanhGia` |
| **CRUD** | Create (PostReview), Read (GetPlaceReviews, GetServiceReviews) |
| **API sử dụng** | `ReviewsController` (Post, GetByPlace, GetByService) |
| **Frontend sử dụng** | ⚠️ Partial — review cơ bản trong Explore |
| **CRD** | §3.4.2 UC013 (1-5 sao, text, ảnh) |

### ANH_DANH_GIA

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Ảnh đính kèm trong đánh giá |
| **Entity C#** | `AnhDanhGia` |
| **CRUD** | Nested trong Review CRUD |
| **API sử dụng** | `ReviewsController` (nested) |
| **Frontend sử dụng** | ❌ ReviewImageUpload chưa có |
| **CRD** | §3.4.2 |

### PHAN_HOI_DANH_GIA

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Phản hồi của NCC cho đánh giá từ khách hàng |
| **Entity C#** | `PhanHoiDanhGia` |
| **CRUD** | Create (NCC reply) |
| **API sử dụng** | ⚠️ Chưa rõ endpoint phản hồi |
| **Frontend sử dụng** | ❌ ProviderReply chưa có |
| **CRD** | §3.4.2 SP008 |

### BAI_VIET

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Bài viết blog du lịch trong cộng đồng |
| **Entity C#** | `BaiViet` |
| **CRUD** | Read (trong feeds) |
| **API sử dụng** | `FeedsController` (GetFeeds — bao gồm blog) |
| **Frontend sử dụng** | ⚠️ Partial — feed nhúng |
| **CRD** | §3.4.3 |

### ANH_BAI_VIET

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Ảnh đính kèm bài viết blog |
| **Entity C#** | `AnhBaiViet` |
| **CRUD** | Nested |
| **API sử dụng** | `FeedsController` (nested) |
| **Frontend sử dụng** | ❌ Blog gallery chưa có |
| **CRD** | §3.4.3 |

### BINH_LUAN_BAI_VIET

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Bình luận trên bài viết blog |
| **Entity C#** | `BinhLuanBaiViet` |
| **CRUD** | Create/Read |
| **API sử dụng** | `FeedsController` (Comment, GetComments) |
| **Frontend sử dụng** | ❌ BlogComments chưa có |
| **CRD** | §3.4.3 |

### THICH_BAI_VIET

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Like bài viết blog |
| **Entity C#** | `ThichBaiViet` |
| **CRUD** | Create/Delete (toggle) |
| **API sử dụng** | ⚠️ Chưa rõ endpoint riêng |
| **Frontend sử dụng** | ❌ BlogLikeButton chưa có |
| **CRD** | §3.4.3 |

### BAO_CAO_NOI_DUNG

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Báo cáo nội dung vi phạm (report abuse) |
| **Entity C#** | `BaoCaoNoiDung` |
| **CRUD** | Create (report), Read (admin) |
| **API sử dụng** | ❌ Không có endpoint |
| **Frontend sử dụng** | ❌ Report content UI chưa có |
| **CRD** | §3.7.1 UC019 |

### DUYET_NOI_DUNG

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Kiểm duyệt nội dung (Admin approve/reject content) |
| **Entity C#** | `DuyetNoiDung` |
| **CRUD** | Create (moderation decision) |
| **API sử dụng** | ❌ Không có admin moderation endpoint |
| **Frontend sử dụng** | ❌ Moderation UI chưa hoàn thiện |
| **CRD** | §3.7.1 UC019 |

---

## 8. NHÓM REVIEWS (đã gộp trong Nhóm Community mục 7)

> Các bảng review (`DANH_GIA`, `ANH_DANH_GIA`, `PHAN_HOI_DANH_GIA`) đã được mô tả chi tiết trong mục 7 — Nhóm Community.

---

## 9. NHÓM PROVIDER (1 bảng core)

### NHA_CUNG_CAP

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Nhà cung cấp dịch vụ du lịch — đăng ký, được Admin duyệt, quản lý dịch vụ và gói quảng bá |
| **Entity C#** | `NhaCungCap` |
| **CRUD** | Create, Read, Update, Delete, Approve, Reject |
| **API sử dụng** | `ProvidersController` (13 endpoints) |
| **Frontend sử dụng** | `ProviderDashboard.tsx`, `ProviderApproval.tsx`, `store/apis/providerApi.ts` |
| **CRD** | §3.6.1 SP001 (Đăng ký), §3.6.2 SP002 (Hồ sơ), §3.7.1 UC019 (Admin duyệt) |

---

## 10. NHÓM PROMOTION — GÓI QUẢNG BÁ NCC (3 bảng)

> **⚠️ ĐÂY LÀ GÓI QUẢNG BÁ CỦA NHÀ CUNG CẤP** — KHÔNG phải Traveler Subscription

### GOI_DICH_VU_NCC

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Cấu hình gói quảng bá NCC: Free / Standard / Premium — mỗi gói có `HeSoUuTien` (SearchScore) |
| **Entity C#** | `GoiDichVuNcc` |
| **Hệ thống** | **Provider Promotion Platform** (Monetization B) |
| **CRUD** | Read (GetPackages), Admin CRUD |
| **API sử dụng** | `ProviderPackageController` (GetPackages), `AdminProviderPackageController` (GetPackages) |
| **Frontend sử dụng** | `ProviderPackages.tsx`, `store/apis/providerApi.ts` |
| **CRD** | §3.6.4 |

### DANG_KY_GOI_NCC

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Lịch sử đăng ký gói quảng bá của NCC — tracking gói hiện tại và lịch sử |
| **Entity C#** | `DangKyGoiNcc` |
| **Hệ thống** | **Provider Promotion Platform** (Monetization B) |
| **CRUD** | Create (RegisterPackage), Read (CurrentPackage, History), Admin (Assign, Extend, Expire) |
| **API sử dụng** | `ProviderPackageController`, `AdminProviderPackageController` |
| **Frontend sử dụng** | `CurrentPackage.tsx`, `PackageHistory.tsx`, `store/apis/providerApi.ts` |
| **CRD** | §3.6.4 SP010 |

### THANH_TOAN_NCC

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Thanh toán gói quảng bá NCC — ghi nhận mỗi lần thanh toán |
| **Entity C#** | `ThanhToanNcc` |
| **Hệ thống** | **Provider Promotion Platform** (Monetization B) |
| **CRUD** | Create (khi thanh toán), Read (PaymentHistory) |
| **API sử dụng** | `ProviderPackageController` (GetPaymentHistory) |
| **Frontend sử dụng** | `PaymentHistory.tsx`, `store/apis/providerApi.ts` |
| **CRD** | §3.6.4 SP011 |

---

## 11. NHÓM ADMIN (Sử dụng các bảng đã liệt kê ở trên)

Admin không có bảng riêng mà sử dụng dữ liệu từ các bảng khác:

| Chức năng Admin | Bảng sử dụng | API |
|---|---|---|
| Quản lý user | `NGUOI_DUNG` | `AdminController` (GetUsers, LockUser) |
| Dashboard thống kê | `NGUOI_DUNG`, `LICH_TRINH` | `AdminController` (GetDashboardStats) |
| Duyệt NCC | `NHA_CUNG_CAP` | `ProvidersController` (GetPending, Approve, Reject) |
| Quản lý gói NCC | `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC` | `AdminProviderPackageController` (8 endpoints) |
| Quản lý danh mục | `TINH_THANH`, `TAG`, `DIA_DIEM` | `PlacesController` (Categories CRUD) |
| Kiểm duyệt nội dung | `DUYET_NOI_DUNG`, `BAO_CAO_NOI_DUNG` | ❌ Chưa có endpoint |

---

## 12. NHÓM AI — TRAVELER SUBSCRIPTION (3 bảng)

> **⚠️ ĐÂY LÀ GÓI ĐĂNG KÝ CỦA TRAVELER** — KHÔNG phải Provider Promotion

### GOI_DICH_VU

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Cấu hình gói dịch vụ Traveler: Free / Premium — xác định quota sử dụng AI |
| **Entity C#** | `GoiDichVu` |
| **Hệ thống** | **Traveler Subscription** (Monetization A) |
| **CRUD** | ❌ Chưa có API |
| **API sử dụng** | ❌ Chưa có endpoint |
| **Frontend sử dụng** | ❌ Chưa sử dụng |
| **CRD** | §3.1.5 (Freemium) — **Deferred** |
| **Trạng thái** | Planned — Waiting AI Provider Selection |

### DANG_KY_GOI

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Đăng ký gói Traveler — tracking subscription status |
| **Entity C#** | `DangKyGoi` |
| **Hệ thống** | **Traveler Subscription** (Monetization A) |
| **CRUD** | ❌ Chưa có API |
| **API sử dụng** | ❌ Chưa có endpoint |
| **Frontend sử dụng** | ❌ Chưa sử dụng |
| **CRD** | §3.1.5 — **Deferred** |
| **Trạng thái** | Planned — Waiting AI Provider Selection |

### LICH_SU_AI

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Lịch sử sử dụng AI của Traveler — tracking token usage, lịch sử chat, lịch trình AI đã sinh |
| **Entity C#** | `LichSuAi` |
| **Hệ thống** | **Traveler Subscription** (Monetization A) |
| **CRUD** | ❌ Chưa có API |
| **API sử dụng** | ❌ Chưa có endpoint |
| **Frontend sử dụng** | ❌ UI skeleton có (`modules/ai/History.tsx`) nhưng chưa wire |
| **CRD** | §3.5 (Phase 3 AI) — **Deferred** |
| **Trạng thái** | Planned — Waiting AI Provider Selection |

> **⚠️ QUAN TRỌNG**: 3 bảng AI KHÔNG bị loại khỏi hệ thống. Đây là nghiệp vụ chính thức trong CRD. Trạng thái: **Planned — Waiting AI Provider Selection**. KHÔNG được ghi Removed / Cancelled / Out of Scope.

---

## 13. NHÓM SUBSCRIPTION TRAVELER (Đã mô tả trong mục 12)

> Xem mục 12 để biết chi tiết 3 bảng: `GOI_DICH_VU`, `DANG_KY_GOI`, `LICH_SU_AI`.

**Phân biệt rõ hai hệ thống monetization:**

| | Traveler Subscription | Provider Promotion |
|---|---|---|
| **Bảng DB** | `GOI_DICH_VU`, `DANG_KY_GOI`, `LICH_SU_AI` | `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC` |
| **Đối tượng** | Khách du lịch (Traveler) | Nhà cung cấp (Provider) |
| **Mục đích** | Đăng ký gói sử dụng AI (Free/Premium) | Đăng ký gói quảng bá tăng hiển thị |
| **Trạng thái** | **Deferred** — chưa chọn AI Provider | **Đã triển khai** (Backend + Frontend) |
| **CRD** | §3.1.5, §3.5 | §3.6.4 |

---

## 14. NHÓM SOCIAL (2 bảng)

### THEO_DOI_NGUOI_DUNG

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Follow/Unfollow người dùng khác |
| **Entity C#** | `TheoDoiNguoiDung` |
| **CRUD** | ❌ Chưa có API |
| **API sử dụng** | ❌ Chưa có endpoint |
| **Frontend sử dụng** | ❌ Follow chưa triển khai |
| **CRD** | — |

### THONG_BAO

| Thuộc tính | Giá trị |
|---|---|
| **Vai trò nghiệp vụ** | Thông báo cho người dùng (like, comment, approve, etc.) |
| **Entity C#** | `ThongBao` |
| **CRUD** | Read (GetMyNotifications), Update (MarkAsRead) |
| **API sử dụng** | `NotificationsController` (GetMyNotifications, MarkAsRead) |
| **Frontend sử dụng** | ❌ Notification UI chưa triển khai |
| **CRD** | — |

---

## 15. MAPPING CRD ↔ DATABASE

| CRD | Yêu cầu | Bảng liên quan | Trạng thái |
|---|---|---|---|
| §3.1.1 | Đăng ký tài khoản + OTP | `NGUOI_DUNG`, `OTP_XAC_THUC` | ✅ Done |
| §3.1.2 | Đăng nhập JWT | `NGUOI_DUNG`, `REFRESH_TOKEN` | ✅ Done |
| §3.1.4 | Hồ sơ cá nhân | `NGUOI_DUNG` | ⚠️ Partial |
| §3.1.5 | Freemium (Free/Premium) | `GOI_DICH_VU`, `DANG_KY_GOI` | ❌ Deferred |
| §3.2.1-4 | Lịch trình CRUD + DnD + Budget | `LICH_TRINH`, `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`, `CHI_PHI_DICH_VU_LICH_TRINH` | ✅ Done |
| §3.2.5 | Cộng tác realtime | `CHIA_SE_LICH_TRINH` | ❌ Deferred |
| §3.2.6 | Clone lịch trình | `LICH_SU_CLONE` | ✅ Done |
| §3.3.1 | Tìm kiếm đa tiêu chí | `DIA_DIEM`, `DICH_VU`, `TINH_THANH`, `TAG`, `DIA_DIEM_TAG` | ✅ Done |
| §3.4.1 | Chia sẻ lịch trình | `CHIA_SE_LICH_TRINH`, `THICH_LICH_TRINH`, `LUU_LICH_TRINH` | ⚠️ Partial |
| §3.4.2 | Đánh giá | `DANH_GIA`, `ANH_DANH_GIA`, `PHAN_HOI_DANH_GIA` | ⚠️ Partial |
| §3.4.3 | Blog | `BAI_VIET`, `ANH_BAI_VIET`, `BINH_LUAN_BAI_VIET`, `THICH_BAI_VIET` | ⚠️ Partial |
| §3.5 | AI Travel Assistant | `LICH_SU_AI`, `GOI_DICH_VU`, `DANG_KY_GOI` | ❌ Deferred |
| §3.6.1-2 | NCC đăng ký + dịch vụ | `NHA_CUNG_CAP`, `DICH_VU`, `ANH_DICH_VU` | ⚠️ Partial |
| §3.6.4 | Gói quảng bá NCC | `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC` | ✅ Done |
| §3.7.1 | Kiểm duyệt nội dung | `DUYET_NOI_DUNG`, `BAO_CAO_NOI_DUNG` | ❌ Missing endpoint |
| §3.7.2 | Quản lý user | `NGUOI_DUNG` | ⚠️ Partial |
| §3.7.3 | Quản lý danh mục | `TINH_THANH`, `TAG`, `DIA_DIEM` | ✅ Done |

---

## 16. BẢNG CHƯA ĐƯỢC FRONTEND SỬ DỤNG

| # | Bảng | Lý do chưa dùng | Sprint dự kiến |
|---|---|---|---|
| 1 | `CHIA_SE_LICH_TRINH` | Backend LOCKED — không có share endpoint | Deferred |
| 2 | `LUU_LICH_TRINH` | SavedItems page chưa tồn tại | Sprint 5 |
| 3 | `ANH_DICH_VU` | Service image gallery chưa hiển thị | Sprint 4 |
| 4 | `ANH_DANH_GIA` | ReviewImageUpload chưa có | Sprint 5 |
| 5 | `PHAN_HOI_DANH_GIA` | ProviderReply chưa có | Sprint 5 |
| 6 | `ANH_BAI_VIET` | Blog gallery chưa có | Sprint 5 |
| 7 | `BINH_LUAN_BAI_VIET` | BlogComments chưa có | Sprint 5 |
| 8 | `THICH_BAI_VIET` | BlogLikeButton chưa có | Sprint 5 |
| 9 | `BAO_CAO_NOI_DUNG` | Report content UI chưa có | Sprint 6 |
| 10 | `DUYET_NOI_DUNG` | Moderation UI chưa hoàn thiện | Sprint 6 |
| 11 | `THEO_DOI_NGUOI_DUNG` | Follow chưa triển khai | Deferred |
| 12 | `GOI_DICH_VU` | Traveler Subscription — Deferred | Deferred |
| 13 | `DANG_KY_GOI` | Traveler Subscription — Deferred | Deferred |
| 14 | `LICH_SU_AI` | AI — Deferred | Deferred |

**Tổng**: 14/37 bảng chưa được Frontend sử dụng (37.8%)

---

## 17. BẢNG CHƯA ĐƯỢC BACKEND SỬ DỤNG (qua API)

| # | Bảng | Backend Service | Có Entity C# | Có API Endpoint | Ghi chú |
|---|---|---|---|---|---|
| 1 | `CHIA_SE_LICH_TRINH` | ❌ | ✅ | ❌ | Không có share endpoint |
| 2 | `LUU_LICH_TRINH` | ⚠️ | ✅ | ⚠️ Chưa rõ | Cần xác nhận |
| 3 | `BAO_CAO_NOI_DUNG` | ❌ | ✅ | ❌ | Không có report endpoint |
| 4 | `DUYET_NOI_DUNG` | ❌ | ✅ | ❌ | Không có moderation endpoint |
| 5 | `THEO_DOI_NGUOI_DUNG` | ❌ | ✅ | ❌ | Không có follow endpoint |
| 6 | `GOI_DICH_VU` | ❌ | ✅ | ❌ | Traveler Subscription — Deferred |
| 7 | `DANG_KY_GOI` | ❌ | ✅ | ❌ | Traveler Subscription — Deferred |
| 8 | `LICH_SU_AI` | ❌ | ✅ | ❌ | AI — Deferred |

**Tổng**: 8/37 bảng có Entity C# nhưng không có API endpoint hoạt động (21.6%)

---

*Tài liệu này được tạo từ schema database thực tế (`database/archive/schema_EZtravel.sql`) và đối chiếu với source code backend + frontend. Database LOCKED — mọi thay đổi cần Change Request chính thức.*
