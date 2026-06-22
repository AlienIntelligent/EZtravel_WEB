# 12 – HƯỚNG DẪN DEVELOPER MỚI (Developer Onboarding Guide)

**Phiên bản**: 1.0  
**Ngày tạo**: 2026-06-07  
**Đối tượng**: Developer mới tham gia dự án EZTravel  
**Mục tiêu**: Đọc 1 lần, hiểu toàn bộ quy tắc và bắt đầu code

---

## 1. CHÀO MỪNG ĐẾN VỚI EZTRAVEL 🧭

Chào mừng bạn đến với dự án **EZTravel** — nền tảng hỗ trợ lập kế hoạch du lịch thông minh cho người Việt.

EZTravel giúp người dùng:
- **Khám phá** địa điểm và dịch vụ du lịch
- **Lập lịch trình** chi tiết với Drag & Drop
- **Quản lý ngân sách** du lịch realtime
- **Kết nối** với nhà cung cấp dịch vụ
- **Chia sẻ** trải nghiệm trong cộng đồng
- **Sử dụng AI** hỗ trợ lên kế hoạch (sắp ra mắt)

Tài liệu này cung cấp mọi thứ bạn cần để bắt đầu.

---

## 2. TỔNG QUAN HỆ THỐNG

### 2.1 Các tác nhân chính

| Tác nhân | Vai trò | Chức năng chính |
|---|---|---|
| **Traveler** | Khách du lịch | Tìm kiếm, lập lịch trình, đánh giá, sử dụng AI |
| **Provider (NCC)** | Nhà cung cấp dịch vụ | Đăng ký, đăng tải dịch vụ, quản lý gói quảng bá |
| **Admin** | Quản trị viên | Kiểm duyệt, thống kê, quản lý hệ thống |

### 2.2 Luồng nghiệp vụ chính

```
Traveler → Đăng ký → Tìm kiếm → Thêm vào lịch trình → Quản lý ngân sách → Chia sẻ
                                                                              ↑
Provider → Đăng ký NCC → Admin duyệt → Đăng dịch vụ → Mua gói quảng bá → Hiển thị ưu tiên
                                                                              ↑
Admin → Dashboard → Duyệt NCC → Quản lý user → Quản lý gói → Thống kê
```

### 2.3 Hai hệ thống Monetization

EZTravel có **2 hệ thống monetization độc lập**:

| Hệ thống | Đối tượng | Bảng DB | Trạng thái |
|---|---|---|---|
| **Traveler Subscription** | Khách du lịch | `GOI_DICH_VU`, `DANG_KY_GOI`, `LICH_SU_AI` | Deferred (chờ AI Provider) |
| **Provider Promotion** | Nhà cung cấp | `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC` | ✅ Đã triển khai |

---

## 3. KIẾN TRÚC TỔNG THỂ

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│         React 19 + Vite + TypeScript + RTK           │
│              TailwindCSS + Lucide React              │
└────────────────────┬────────────────────────────────┘
                     │ REST API (JSON)
┌────────────────────┴────────────────────────────────┐
│               YARP API GATEWAY                       │
└────────────────────┬────────────────────────────────┘
                     │
    ┌────────────────┼────────────────────┐
    │                │                    │
┌───┴───┐  ┌────────┴────┐  ┌───────────┴─────┐
│ Auth  │  │   Trip      │  │    Place         │
│ :7001 │  │   :7002     │  │    :7003         │
└───────┘  └─────────────┘  └─────────────────┘
    │                │                    │
┌───┴───┐  ┌────────┴────┐  ┌───────────┴─────┐
│Booking│  │ Community   │  │    Admin         │
│ :7004 │  │   :7005     │  │    :7006         │
└───────┘  └─────────────┘  └─────────────────┘
                     │
         ┌───────────┴──────────┐
         │   SQL Server (MSSQL) │
         │   37 bảng - LOCKED   │
         └──────────────────────┘
```

### 3.1 Microservices

| Service | Port | Trách nhiệm |
|---|---|---|
| **API Gateway** | — | Routing, CORS, JWT validation |
| **Auth Service** | 7001 | Đăng ký, đăng nhập, OTP, Notifications |
| **Trip Service** | 7002 | CRUD lịch trình, DnD, budget, clone |
| **Place Service** | 7003 | Places, Hotels, Restaurants, Activities, Vehicles, Categories |
| **Booking Service** | 7004 | Providers CRUD, Provider Packages, Promotion |
| **Community Service** | 7005 | Feeds, Reviews, Likes, Comments |
| **Admin Service** | 7006 | Admin Users, Dashboard, Admin Provider Packages |

---

## 4. CÔNG NGHỆ SỬ DỤNG

### Backend

| Thành phần | Công nghệ |
|---|---|
| Framework | ASP.NET Core 8 (Web API) |
| Kiến trúc | Microservices + YARP API Gateway |
| ORM | Entity Framework Core 8 |
| Database | SQL Server |
| Auth | JWT Bearer + Refresh Token |
| IDE | Visual Studio 2022 / Rider |

### Frontend

| Thành phần | Phiên bản |
|---|---|
| React | 19.2.5 |
| Vite | 8.0.10 |
| TypeScript | 6.0.3 |
| React Router DOM | 7.1.5 |
| Redux Toolkit (RTK) | 2.12.0 |
| TailwindCSS | 4.3.0 |
| Icons | Lucide React |
| IDE | VS Code + Extensions |

---

## 5. QUY TẮC DỰ ÁN

### 5.1 CRD LÀ CHÂN LÝ CAO NHẤT

```
Thứ tự ưu tiên khi có mâu thuẫn:

1. CRD_EZtravel_v3.docx    ← Chân lý nghiệp vụ
2. SRS_ezTravel_v1_4.docx  ← Đặc tả chức năng
3. Database hiện hành       ← Chân lý dữ liệu
4. Backend hiện hành        ← Chân lý tích hợp
5. Frontend hiện hành       ← Tầng triển khai
```

**Nếu có mâu thuẫn → CRD thắng.** Nhưng Database và Backend KHÔNG được sửa.

### 5.2 Database LOCKED 🔒

Database hiện tại đã **đóng băng** (37 bảng).  
KHÔNG ai được phép sửa database mà không có Change Request chính thức.

### 5.3 Backend LOCKED 🔒

Backend hiện tại đã **đóng băng** (76 endpoints).  
KHÔNG ai được phép sửa backend mà không có Change Request chính thức.

### 5.4 Frontend = Tầng phát triển duy nhất

Frontend là tầng **duy nhất còn được phát triển**. Bạn có thể:
- ✅ Tạo component mới
- ✅ Tạo page mới
- ✅ Tạo RTK Query hook mới (gọi API đã tồn tại)
- ✅ Sửa giao diện, responsive, error/loading state
- ✅ Thêm route mới

### 5.5 AI là nghiệp vụ chính thức

AI KHÔNG bị loại khỏi hệ thống. Trạng thái hiện tại: **Planned — Waiting AI Provider Selection**.

---

## 6. NHỮNG THỨ KHÔNG ĐƯỢC LÀM ❌

### 6.1 Database — CẤM tuyệt đối

- ❌ Tạo bảng mới
- ❌ Xóa/đổi tên bảng
- ❌ Thêm/xóa/đổi tên cột
- ❌ Đổi kiểu dữ liệu
- ❌ Thêm/xóa constraint
- ❌ Tạo migration mới
- ❌ Chạy script ALTER

### 6.2 Backend — CẤM tuyệt đối

- ❌ Sửa API Contract (URL, method, request/response schema)
- ❌ Sửa DTO (thêm/xóa/đổi tên trường)
- ❌ Sửa Business Rule trong Service layer
- ❌ Thêm endpoint mới
- ❌ Xóa endpoint hiện tại
- ❌ Sửa Entity mapping
- ❌ Sửa Repository logic

### 6.3 Frontend — CẤM tuyệt đối

- ❌ Gọi API endpoint **chưa tồn tại** trong backend
- ❌ Tự tạo mock API
- ❌ Hardcode dữ liệu nghiệp vụ (tên gói, giá, badge type)
- ❌ Tính toán business logic trên frontend
- ❌ Sử dụng `any` trong TypeScript
- ❌ Sử dụng `@ts-ignore`
- ❌ Duplicate DTO hoặc API client
- ❌ Import từ `src/api/adminApi.ts` cho admin pages mới

### 6.4 Khi backend không hỗ trợ

Nếu cần endpoint mà backend không có:

```
✅ PHẢI hiển thị:
   - "Tính năng đang phát triển"
   - "Coming Soon"
   - "Blocked By Backend"
   - "Deferred"

❌ KHÔNG ĐƯỢC:
   - Mock API
   - Fake data
   - Hardcode business data
```

---

## 7. CÁCH CHẠY BACKEND

### 7.1 Yêu cầu

- **.NET 8 SDK** cài đặt
- **SQL Server** đang chạy
- Database `EZtravel` đã tạo và import schema

### 7.2 Chạy tất cả services

```powershell
# Chạy từ thư mục gốc dự án
.\StartServices.ps1
```

Script sẽ khởi động 6 services:
1. API Gateway
2. Auth Service (port 7001)
3. Admin Service (port 7006)
4. Community Service (port 7005)
5. Place Service (port 7003)
6. Trip Service (port 7002)

### 7.3 Chạy từng service riêng

```powershell
# Chạy 1 service cụ thể
dotnet run --project Microservices\ezTravel.AuthService\ezTravel.AuthService.csproj
```

### 7.4 Test API nhanh

```powershell
# Sử dụng script test có sẵn
.\RunGets.ps1
```

### 7.5 Solution file

```
ezTravel.slnx    ← Mở bằng Visual Studio 2022
```

---

## 8. CÁCH CHẠY FRONTEND

### 8.1 Yêu cầu

- **Node.js** (phiên bản LTS)
- **npm** hoặc **yarn**

### 8.2 Cài đặt và chạy

```bash
cd WebClient
npm install
npm run dev
```

### 8.3 Cấu trúc thư mục quan trọng

```
WebClient/src/
├── api/                  # RTK Query (legacy — KHÔNG thêm mới)
├── store/                # Redux store
│   ├── apis/             # RTK Query mới (thêm mới TẠI ĐÂY)
│   └── *Slice.ts         # Redux slices
├── shared/types/         # Shared TypeScript types
├── types/                # DTO types (mapping 1:1 backend)
├── components/           # Shared components
├── layouts/              # Layout components
├── modules/              # Feature modules (pages)
│   ├── admin/
│   ├── ai/
│   ├── auth/
│   ├── explore/
│   ├── home/
│   ├── provider/
│   └── trip/
├── routes/               # Router configuration
└── App.tsx
```

### 8.4 Hai tầng API — QUAN TRỌNG

Frontend có **2 tầng API song song**:

| Tầng | Thư mục | Trạng thái | Hành động |
|---|---|---|---|
| **Legacy** | `src/api/` | ⚠️ Chứa endpoint sai | KHÔNG thêm mới, chỉ sửa bug |
| **Mới (Sprint 3+)** | `src/store/apis/` | ✅ Endpoint đúng | **THÊM MỚI TẠI ĐÂY** |

> **Quy tắc bắt buộc**: Mọi API hook mới phải đặt trong `src/store/apis/`. KHÔNG import từ `src/api/adminApi.ts` cho admin pages.

---

## 9. CÁCH ĐỌC DATABASE

### 9.1 Schema file

```
database/archive/schema_EZtravel.sql
```

### 9.2 Tổng quan

- **37 bảng** chia thành 9 nhóm nghiệp vụ
- **Tên bảng tiếng Việt** (VD: `NGUOI_DUNG`, `LICH_TRINH`, `DICH_VU`)
- **Entity C#** mapping 1:1 (VD: `NguoiDung`, `LichTrinh`, `DichVu`)

### 9.3 Nhóm bảng chính

| Nhóm | Bảng | Số lượng |
|---|---|---|
| Identity & Auth | `NGUOI_DUNG`, `OTP_XAC_THUC`, `REFRESH_TOKEN` | 3 |
| Trip Planning | `LICH_TRINH`, `NGAY_LICH_TRINH`, ... | 9 |
| Discovery | `DIA_DIEM`, `ANH_DIA_DIEM`, `TINH_THANH`, `TAG`, `DIA_DIEM_TAG` | 5 |
| Service | `DICH_VU`, `ANH_DICH_VU` | 2 |
| Community | `DANH_GIA`, `BAI_VIET`, ... | 9 |
| Social | `THEO_DOI_NGUOI_DUNG`, `THONG_BAO` | 2 |
| Provider | `NHA_CUNG_CAP` | 1 |
| Provider Promotion | `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC` | 3 |
| Traveler Subscription | `GOI_DICH_VU`, `DANG_KY_GOI`, `LICH_SU_AI` | 3 |

### 9.4 Tham khảo chi tiết

→ Xem `11_DATABASE_BUSINESS_MAPPING.md` để hiểu nghiệp vụ từng bảng.

---

## 10. CÁCH ĐỌC CRD

### 10.1 File CRD

```
CRD_EZtravel_v3.docx
```

### 10.2 Cấu trúc CRD

| Section | Nội dung |
|---|---|
| §3.1 | Quản lý Tài khoản |
| §3.2 | Quản lý Lịch trình |
| §3.3 | Khám phá Địa điểm & Dịch vụ |
| §3.4 | Nội dung & Cộng đồng |
| §3.5 | AI Travel Assistant (Phase 3) |
| §3.6 | Provider Promotion Platform |
| §3.7 | Admin Panel |
| §7.2 | Hạng mục LOẠI KHỎI phạm vi (Booking, Payment Gateway, etc.) |

### 10.3 Cách đối chiếu

1. Nhận task → xác định CRD section
2. Đối chiếu CRD → Database (bảng nào liên quan?)
3. Đối chiếu Database → Backend (endpoint nào có sẵn?)
4. Backend → Frontend (đã wire chưa? wire đúng chưa?)

### 10.4 Ma trận truy vết

→ Xem `04_CRD_TRACEABILITY_MATRIX.md` để biết mỗi yêu cầu CRD đang ở trạng thái nào.

---

## 11. QUY TRÌNH NHẬN TASK

### 11.1 Trước khi code

1. **Đọc User Story** — hiểu yêu cầu nghiệp vụ
2. **Xác định CRD section** — đối chiếu với CRD
3. **Kiểm tra API Mapping** — endpoint nào cần gọi? (xem `10_BACKEND_API_CATALOG.md`)
4. **Kiểm tra Database** — bảng nào liên quan? (xem `11_DATABASE_BUSINESS_MAPPING.md`)
5. **Xác nhận endpoint tồn tại** — nếu không có → hiển thị Coming Soon
6. **Tạo branch** — theo quy ước

### 11.2 Trong khi code

1. Tạo component trong `modules/<module>/`
2. Tạo RTK Query hooks trong `store/apis/`
3. Wire đến backend API đúng
4. Xử lý Loading / Error / Empty state
5. Test responsive (375px, 768px, 1920px)
6. Không sử dụng `any`, không mock API

### 11.3 Sau khi code

1. Chạy `tsc --noEmit` — pass không lỗi
2. Tự review theo `06_PR_REVIEW_CHECKLIST.md`
3. Tạo Pull Request
4. Chờ review và sửa feedback

---

## 12. QUY TRÌNH TẠO BRANCH

### 12.1 Quy ước đặt tên

```
<type>/<sprint>-<mô-tả-ngắn>

Ví dụ:
  feat/sprint4-admin-dashboard-fix
  feat/sprint4-provider-services-manager
  fix/sprint4-user-manager-endpoint
  refactor/sprint4-consolidate-admin-api
```

### 12.2 Các loại branch

| Type | Mục đích |
|---|---|
| `feat/` | Tính năng mới |
| `fix/` | Sửa bug |
| `refactor/` | Cải thiện code không thay đổi chức năng |
| `docs/` | Tài liệu |

### 12.3 Luồng branch

```
main (production)
  └── develop (integration)
       ├── feat/sprint4-admin-dashboard-fix
       ├── feat/sprint4-provider-services-manager
       └── fix/sprint4-user-manager-endpoint
```

---

## 13. QUY TRÌNH PULL REQUEST

### 13.1 Tạo PR

1. Push branch lên remote
2. Tạo PR từ feature branch → `develop`
3. Viết PR description đầy đủ:
   - **Mô tả thay đổi** — ngắn gọn
   - **User Story liên quan** — VD: US-4.1
   - **API endpoints sử dụng** — liệt kê
   - **Screenshots** — nếu có thay đổi UI

### 13.2 Template PR

```markdown
## Mô tả
Sửa Admin Dashboard wire đúng `GET /admin/dashboard`.

## User Story
US-4.1: Sửa Admin Dashboard

## API Mapping
- `GET /admin/dashboard` → hiển thị TotalUsers, TotalTrips

## Checklist
- [ ] Endpoint URL đúng
- [ ] Loading/Error/Empty state
- [ ] Responsive
- [ ] `tsc --noEmit` pass
```

---

## 14. QUY TRÌNH REVIEW

### 14.1 Ai review?

- Tối thiểu **1 reviewer** phải approve
- Reviewer phải kiểm tra theo `06_PR_REVIEW_CHECKLIST.md`

### 14.2 Tiêu chí reject tự động

PR sẽ bị **reject ngay** nếu:

- ❌ Sử dụng `any`
- ❌ Gọi API endpoint không tồn tại
- ❌ Hardcode dữ liệu nghiệp vụ
- ❌ Thiếu Loading/Error/Empty state
- ❌ Mock API response
- ❌ `tsc --noEmit` fail

### 14.3 Quy trình

```
1. Tác giả tạo PR
2. Reviewer check theo checklist
3. Có vi phạm → Comment + Request Changes
4. Tác giả sửa → Push lại
5. Reviewer approve
6. Merge vào develop
```

---

## 15. CHECKLIST TRƯỚC KHI MERGE ✅

Trước khi merge PR, đảm bảo **tất cả** các mục sau:

### Code Quality
- [ ] `tsc --noEmit` pass không lỗi
- [ ] Không sử dụng `any`
- [ ] Không sử dụng `@ts-ignore`
- [ ] Props có interface/type rõ ràng

### API Integration
- [ ] Endpoint URL khớp chính xác với backend
- [ ] HTTP method đúng (GET/POST/PUT/DELETE)
- [ ] Request/Response type khớp backend DTO
- [ ] Không gọi endpoint không tồn tại
- [ ] Không mock API
- [ ] Không hardcode business data

### UI/UX
- [ ] Loading State (spinner/skeleton)
- [ ] Error State (thông báo + nút retry)
- [ ] Empty State (thông báo + hướng dẫn)
- [ ] Responsive: 375px, 768px, 1920px

### Architecture
- [ ] Component đặt đúng thư mục `modules/<module>/`
- [ ] API hook đặt trong `store/apis/`
- [ ] Type đặt trong `types/` hoặc `shared/types/`
- [ ] Không duplicate type hoặc API client

---

## 16. FAQ (Câu Hỏi Thường Gặp)

### Q: Tôi cần endpoint mà backend chưa có, làm sao?

**A**: Hiển thị "Tính năng đang phát triển" (Coming Soon). KHÔNG mock API. Nếu cần endpoint mới, tạo Change Request.

---

### Q: CRD nói phải có feature X nhưng backend không hỗ trợ?

**A**: CRD thắng về mặt nghiệp vụ, nhưng Backend LOCKED. Frontend hiển thị "Coming Soon" hoặc "Blocked By Backend". Ghi nhận vào Change Request log.

---

### Q: Tôi muốn thêm cột vào database, có được không?

**A**: **KHÔNG.** Database LOCKED tuyệt đối. Cần Change Request chính thức từ Trưởng nhóm.

---

### Q: `src/api/adminApi.ts` hay `src/store/apis/adminApi.ts`?

**A**: **`src/store/apis/adminApi.ts`** — luôn luôn. File `src/api/adminApi.ts` là legacy, chứa endpoint sai. KHÔNG thêm mới vào đó.

---

### Q: AI có bị loại khỏi dự án không?

**A**: **KHÔNG.** AI là nghiệp vụ chính thức trong CRD Phase 3. Trạng thái: Planned — Waiting AI Provider Selection. UI skeleton đã có. Khi chọn provider, chỉ cần wire API.

---

### Q: Badge type NCC lấy từ đâu?

**A**: Từ backend: `ProviderPromotionDto.badgeType`. Frontend chỉ hiển thị, KHÔNG tự tính.

---

### Q: Business logic có được tính trên frontend không?

**A**: **KHÔNG.** Mọi business logic (badge type, promotion score, search score) do backend tính. Frontend chỉ hiển thị giá trị từ API response.

---

### Q: Có bao nhiêu endpoint backend?

**A**: **76 endpoints** trên 14 controllers. Xem `10_BACKEND_API_CATALOG.md` để biết chi tiết.

---

### Q: Booking có trong phạm vi không?

**A**: **KHÔNG.** CRD §7.2 loại rõ ràng: Booking Engine, Availability, Payment Gateway cho booking, Ví điện tử NCC, Rút tiền NCC, Hoa hồng, Đối soát thanh toán — tất cả **không triển khai**.

---

### Q: Tôi nên đọc tài liệu nào trước?

**A**: Theo thứ tự sau:

1. `01_PROJECT_CONSTITUTION.md` — Quy tắc bất biến
2. `12_DEVELOPER_ONBOARDING_GUIDE.md` — Tài liệu này
3. `05_FRONTEND_CODING_STANDARD.md` — Tiêu chuẩn code
4. `10_BACKEND_API_CATALOG.md` — Danh mục API
5. `07_SPRINT_BACKLOG.md` — Xem Sprint hiện tại
6. `06_PR_REVIEW_CHECKLIST.md` — Trước khi tạo PR

---

## TÀI LIỆU THAM KHẢO

| File | Nội dung |
|---|---|
| `01_PROJECT_CONSTITUTION.md` | Hiến pháp dự án — quy tắc bất biến |
| `02_SYSTEM_BASELINE.md` | Đóng băng trạng thái hệ thống |
| `03_CURRENT_REALITY_REPORT.md` | Báo cáo thực trạng |
| `04_CRD_TRACEABILITY_MATRIX.md` | Ma trận truy vết CRD |
| `05_FRONTEND_CODING_STANDARD.md` | Tiêu chuẩn code Frontend |
| `06_PR_REVIEW_CHECKLIST.md` | Checklist review PR |
| `07_SPRINT_BACKLOG.md` | Sprint Backlog chính thức |
| `08_FRONTEND_MASTER_PLAN.md` | Kiến trúc Frontend đích |
| `09_FRONTEND_GAP_ANALYSIS.md` | Phân tích Gap Frontend |
| `10_BACKEND_API_CATALOG.md` | Danh mục API Backend |
| `11_DATABASE_BUSINESS_MAPPING.md` | Mapping DB ↔ Nghiệp vụ |
| `13_TEAM_EXECUTION_PLAN.md` | Kế hoạch triển khai Sprint 4→7 |

---

*Chào mừng bạn đã đọc xong! Nếu có thắc mắc, hãy hỏi Trưởng nhóm hoặc tham khảo các tài liệu liên quan. Chúc bạn code vui vẻ! 🚀*
