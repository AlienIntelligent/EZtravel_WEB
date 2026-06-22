# 04 – MA TRẬN TRUY VẾT CRD (CRD Traceability Matrix)

**Nguồn chân lý**: CRD_EZtravel_v3.docx  
**Đối chiếu**: SRS_ezTravel_v1_4.docx, Database, Backend, Frontend  
**Ngày**: 2026-06-07

---

## Quy ước trạng thái

| Status | Ý nghĩa |
|---|---|
| **Done** | DB + Backend + Frontend đều hoàn thành |
| **Partial** | Có triển khai nhưng chưa đầy đủ hoặc frontend chưa wire đúng |
| **Missing** | CRD yêu cầu nhưng frontend chưa triển khai (backend có thể có hoặc không) |
| **Deferred** | CRD yêu cầu nhưng đã quyết định hoãn triển khai (VD: AI chưa chọn provider) |
| **Excluded** | CRD §7.2 loại rõ ràng — không triển khai |

---

## PHASE 1 – MVP (CRD: ✅ Bắt buộc)

### 1A. Quản lý Tài khoản (CRD §3.1)

| CRD ID | Yêu cầu | UC SRS | DB | API | UI | Status | Sprint |
|---|---|---|---|---|---|---|---|
| CRD-3.1.1 | Đăng ký tài khoản (email, OTP 6 số, 10 phút hết hạn, 5 lần sai khóa 15p) | UC001 | `NGUOI_DUNG`, `OTP_XAC_THUC` | `POST /auth/register`, `POST /auth/verify-otp` | `Register.tsx`, `OtpVerification.tsx` | **Done** | — |
| CRD-3.1.2 | Đăng nhập JWT (Access 15-30p, Refresh 7-30 ngày) | UC002 | `REFRESH_TOKEN` | `POST /auth/login`, `POST /auth/refresh-token` | `Login.tsx` | **Done** | — |
| CRD-3.1.3 | Quên mật khẩu (link token, 15 phút) | UC003 | `OTP_XAC_THUC` | `POST /auth/forgot-password` | `ForgotPassword.tsx`, `ResetPassword.tsx` | **Done** | — |
| CRD-3.1.4 | Quản lý hồ sơ cá nhân (avatar, tên, phone, slug) | UC004 | `NGUOI_DUNG` | `GET /auth/me` | Profile page | **Partial** | Sprint 4 |
| CRD-3.1.5 | Mô hình Freemium (Free vs Premium Traveler) | — | `GOI_DICH_VU`, `DANG_KY_GOI` | Không có endpoint | Không có UI | **Deferred** | — |

### 1B. Quản lý Lịch trình (CRD §3.2)

| CRD ID | Yêu cầu | UC SRS | DB | API | UI | Status | Sprint |
|---|---|---|---|---|---|---|---|
| CRD-3.2.1 | Tạo lịch trình mới (tên, ngày, timeline theo ngày) | UC005 | `LICH_TRINH`, `NGAY_LICH_TRINH` | `POST /trips` | `TripPlannerWorkspace` | **Done** | — |
| CRD-3.2.2 | Thêm địa điểm Drag & Drop + ghi chú + chi phí | UC006 | `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH` | `POST /trips/{id}/locations` | DnD trong Planner | **Done** | — |
| CRD-3.2.3 | Sắp xếp Drag & Drop (trong ngày, giữa các ngày) | UC007 | — | `PUT /trips/{id}/reorder` | DnD reorder | **Done** | — |
| CRD-3.2.4 | Quản lý ngân sách realtime (cảnh báo vượt) | UC008 | `CHI_PHI_DICH_VU_LICH_TRINH` | `GET /trips/{id}/cost` | Budget panel | **Done** | — |
| CRD-3.2.5 | Cộng tác realtime (SignalR, View/Edit permission) | UC017 | `CHIA_SE_LICH_TRINH` | Không có SignalR Hub | Không có UI cộng tác | **Deferred** | — |
| CRD-3.2.6 | Clone lịch trình công khai | UC010, UC015 | `LICH_SU_CLONE` | `POST /trips/{id}/clone` | Clone button | **Done** | — |

### 1C. Khám phá Địa điểm & Dịch vụ (CRD §3.3)

| CRD ID | Yêu cầu | UC SRS | DB | API | UI | Status | Sprint |
|---|---|---|---|---|---|---|---|
| CRD-3.3.1 | Tìm kiếm đa tiêu chí (keyword, tỉnh, loại, giá, rating, tag) | UC011 | `DIA_DIEM`, `DICH_VU`, `TINH_THANH`, `TAG` | `GET /places/search`, `GET /places/hotels/search`, etc. | `ExploreWorkspace` | **Done** | — |
| CRD-3.3.2 | Trang chi tiết dịch vụ (gallery, giá, liên hệ, review) | UC011 ext. | — | `GET /places/{id}`, `GET /reviews/place/{id}` | Explore detail | **Partial** | Sprint 4 |
| CRD-3.3.3 | Xu hướng và gợi ý | — | — | `POST /trips/recommendations` | Recommendation section | **Partial** | Sprint 4 |

### 1D. Nội dung & Cộng đồng – Core (CRD §3.4.1)

| CRD ID | Yêu cầu | UC SRS | DB | API | UI | Status | Sprint |
|---|---|---|---|---|---|---|---|
| CRD-3.4.1 | Chia sẻ lịch trình công khai (Public/Private) | UC014 | `CHIA_SE_LICH_TRINH` | Không có share endpoint | Không có share UI | **Deferred** | — |
| CRD-3.4.4a | Like/Save lịch trình | — | `THICH_LICH_TRINH`, `LUU_LICH_TRINH` | `POST /feeds/{tripId}/like` (like có, save chưa) | Partial | **Partial** | Sprint 5 |
| CRD-3.4.4b | Bình luận lịch trình | — | — | `POST /feeds/{tripId}/comment`, `GET /feeds/{tripId}/comments` | Partial | **Partial** | Sprint 5 |

---

## PHASE 2 – Blog & Review (CRD: ✅ Bắt buộc)

| CRD ID | Yêu cầu | UC SRS | DB | API | UI | Status | Sprint |
|---|---|---|---|---|---|---|---|
| CRD-3.4.2 | Đánh giá địa điểm/dịch vụ (1-5 sao, text, ảnh) | UC013 | `DANH_GIA`, `ANH_DANH_GIA` | `POST /reviews`, `GET /reviews/place/{id}`, `GET /reviews/service/{id}` | Review section trong Explore | **Partial** | Sprint 5 |
| CRD-3.4.2b | NCC phản hồi đánh giá | SP008 | `PHAN_HOI_DANH_GIA` | Không rõ endpoint phản hồi | Legacy `ReviewsManager.tsx` | **Partial** | Sprint 5 |
| CRD-3.4.3 | Blog du lịch (viết, đăng, tag, kiểm duyệt) | — | `BAI_VIET`, `ANH_BAI_VIET`, `BINH_LUAN_BAI_VIET`, `THICH_BAI_VIET` | `GET /feeds` | Feed trong community | **Partial** | Sprint 5 |

---

## PHASE 3 – AI Travel Assistant (CRD: ⭐ Ưu tiên cao)

| CRD ID | Yêu cầu | UC SRS | DB | API | UI | Status | Sprint |
|---|---|---|---|---|---|---|---|
| CRD-3.5.1 | AI Generate Trip | — | `LICH_SU_AI` | AI module | `/ai/planner` (AIPlanner.tsx) | **Deferred** | — |
| CRD-3.5.2 | AI Optimize Route | — | — | — | `/ai` (AIRoutePanel.tsx) | **Deferred** | — |
| CRD-3.5.3 | AI Budget Advisor | — | — | — | `/ai` (AIBudgetPanel.tsx) | **Deferred** | — |
| CRD-3.5.4 | AI Travel Chat (20000 token/ngày Free, unlimited Premium) | — | `LICH_SU_AI` | AI module | `/ai` (Assistant.tsx) | **Deferred** | — |

**Lưu ý**: AI KHÔNG bị loại khỏi hệ thống. UI skeleton đã có. Trạng thái Deferred vì chưa lựa chọn AI Provider phù hợp.

---

## PHASE 4 – Provider Promotion Platform (CRD: ⭐ Có giới hạn)

| CRD ID | Yêu cầu | UC SRS | DB | API | UI | Status | Sprint |
|---|---|---|---|---|---|---|---|
| CRD-3.6.1 | Đăng ký NCC (form + giấy phép, Admin duyệt 48h) | SP001 | `NHA_CUNG_CAP` | `POST /providers` | Legacy registration | **Partial** | Sprint 4 |
| CRD-3.6.2a | Quản lý hồ sơ doanh nghiệp | SP002 | `NHA_CUNG_CAP` | `PUT /providers/{id}` | `Profile.tsx` (provider) | **Partial** | Sprint 4 |
| CRD-3.6.2b | Đăng tải dịch vụ (4 loại: KS, NH, PT, HĐ) | SP003 | `DICH_VU` | `POST /places/hotels`, `POST /places/restaurants`, etc. | `ServicesManager.tsx` = Stub | **Missing** | Sprint 4 |
| CRD-3.6.2c | Chỉnh sửa dịch vụ | SP004 | `DICH_VU` | `PUT /places/hotels/{id}`, etc. | Stub | **Missing** | Sprint 4 |
| CRD-3.6.2d | Ẩn/Hiện dịch vụ | SP005 | `DICH_VU.TrangThai` | Endpoint tồn tại | Stub | **Missing** | Sprint 4 |
| CRD-3.6.3a | Dashboard NCC – Tab Dịch vụ | — | — | `GET /providers/{id}/dashboard` | Dashboard có KPI, chưa có tab list dịch vụ | **Partial** | Sprint 4 |
| CRD-3.6.3b | Dashboard NCC – Tab Gói quảng bá | SP010 | `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC` | `GET /provider/packages`, `GET /provider/current-package` | `Packages.tsx`, `CurrentPackage.tsx` | **Done** | — |
| CRD-3.6.3c | Dashboard NCC – Tab Analytics (5 chỉ số) | SP009, SP012 | — | `GET /providers/{id}/dashboard` (cơ bản) | `Analytics.tsx` (mock) | **Partial** | Sprint 5 |
| CRD-3.6.4a | Đăng ký gói quảng bá (Free/Standard/Premium) | SP010 | `DANG_KY_GOI_NCC` | `POST /provider/register-package` | `Packages.tsx` | **Done** | — |
| CRD-3.6.4b | Thanh toán gói quảng bá | SP011 | `THANH_TOAN_NCC` | Payment flow trong register-package | Payment flow | **Done** | — |
| CRD-3.6.4c | SearchScore formula | — | `GOI_DICH_VU_NCC.HeSoUuTien` | `PromotionService` L29-33 | — | **Done** | — |

---

## PHASE 5 – Admin (CRD: ✅ Bắt buộc)

| CRD ID | Yêu cầu | UC SRS | DB | API | UI | Status | Sprint |
|---|---|---|---|---|---|---|---|
| CRD-3.7.1a | Kiểm duyệt đăng ký NCC | UC019 | `NHA_CUNG_CAP`, `DUYET_NOI_DUNG` | `GET /providers/pending`, `POST /providers/{id}/approve\|reject` | `ProviderApproval.tsx` (gọi sai endpoint) | **Partial** | Sprint 4 |
| CRD-3.7.1b | Kiểm duyệt dịch vụ NCC | UC019 | `DICH_VU` | Không có admin endpoint cho dịch vụ. Có `GET /places/hotels/search?status=PENDING` | `ServiceModeration.tsx` (gọi sai endpoint) | **Missing** | Sprint 6 |
| CRD-3.7.1c | Kiểm duyệt review | UC019 | `DANH_GIA` | Không có admin endpoint | Không có UI | **Missing** | Sprint 6 |
| CRD-3.7.1d | Kiểm duyệt lịch trình công khai & blog | UC019 | `BAI_VIET`, `LICH_TRINH` | Không có admin endpoint | `BlogModeration.tsx` (gọi sai endpoint) | **Missing** | Sprint 6 |
| CRD-3.7.2 | Quản lý người dùng (danh sách, tìm kiếm, khóa/mở khóa) | UC018 | `NGUOI_DUNG` | `GET /admin/users`, `POST /admin/users/{id}/lock` | `UserManager.tsx` (gọi sai endpoint) | **Partial** | Sprint 4 |
| CRD-3.7.3 | Quản lý danh mục (loại dịch vụ, địa điểm, tag, tỉnh/thành) | UC020 | `TINH_THANH`, `TAG`, `DIA_DIEM` | `api/places/categories/*` | `PlacesManager.tsx` | **Done** | — |
| CRD-3.7.4 | Quản lý mã giảm giá (cho gói Premium Traveler) | UC022 | Không có bảng `MA_GIAM_GIA` | Không có endpoint | Không có UI | **Deferred** | — |
| CRD-3.7.5a | Dashboard thống kê (users, trips, AI, doanh thu) | UC021 | — | `GET /admin/dashboard` (chỉ TotalUsers + TotalTrips) | `Dashboard.tsx` (render sai field) | **Partial** | Sprint 4 |
| CRD-3.7.5b | Xuất báo cáo Excel/PDF | UC021 | — | Không có endpoint | Không có UI | **Deferred** | — |
| CRD-Admin-PKG | Quản lý gói NCC (cấp, gia hạn, hết hạn) | — | `DANG_KY_GOI_NCC` | `api/admin/provider-packages/*` (đầy đủ 8 endpoints) | `AdminPackagesManager.tsx` (stub) | **Missing** | Sprint 6 |

---

## PHASE EXCLUDED (CRD §7.2 – Không triển khai)

| Hạng mục | CRD §7.2 | Status |
|---|---|---|
| Booking Engine | *"Kéo theo inventory, availability, cancellation flow – quá phức tạp"* | **Excluded** |
| Availability/Inventory | *"NCC không cần quản lý tồn kho"* | **Excluded** |
| Payment Gateway cho booking | *"Không có booking thực"* | **Excluded** |
| Ví điện tử NCC | *"Không có dòng tiền booking qua hệ thống"* | **Excluded** |
| Rút tiền NCC | *"Không có ví điện tử NCC"* | **Excluded** |
| Hoa hồng (Commission) | *"Bỏ toàn bộ"* | **Excluded** |
| Đối soát thanh toán | *"Không có giao dịch OTA thực"* | **Excluded** |
| Mobile native | *"Ngoài phạm vi kỹ thuật"* | **Excluded** |

---

## THỐNG KÊ TỔNG HỢP

| Status | Số lượng |
|---|---|
| **Done** | 15 |
| **Partial** | 13 |
| **Missing** | 5 |
| **Deferred** | 8 |
| **Excluded** | 8 |
| **Tổng yêu cầu CRD** | 41 (không tính Excluded) |
