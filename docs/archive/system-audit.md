# System Audit

## 1. Feature Coverage Status Matrix

| Feature | Database | CRD | SRS | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication & Profile** | `NGUOI_DUNG`, `OTP_XAC_THUC`, `REFRESH_TOKEN` | 3.1 | UC 001 - 004 | `COMPLETE` |
| **Trip Planning (Core)** | `LICH_TRINH`, `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`, `CHI_PHI_DICH_VU_LICH_TRINH`, `CHIA_SE_LICH_TRINH` | 3.2 | UC 005 - 010, 017 | `COMPLETE` |
| **Discovery** | `DIA_DIEM`, `DICH_VU`, `TINH_THANH`, `TAG`, `DIA_DIEM_TAG` | 3.3 | UC 011 | `COMPLETE` |
| **Community Reviews** | `DANH_GIA`, `ANH_DANH_GIA` | 3.4.1 | UC 013 | `COMPLETE` |
| **Trip Sharing & Clone** | `LUU_LICH_TRINH`, `THICH_LICH_TRINH`, `LICH_SU_CLONE` | 3.4.2 | UC 014, 015 | `COMPLETE` |
| **Travel Blog & Social** | `BAI_VIET`, `BINH_LUAN_BAI_VIET`, `THICH_BAI_VIET`, `ANH_BAI_VIET`, `THEO_DOI_NGUOI_DUNG` | 3.4.3, 3.4.4 | - | `MISSING_SRS` |
| **AI Travel Assistant** | `LICH_SU_AI` | 3.5 | - | `MISSING_SRS` |
| **Traveler Premium Subs**| `GOI_DICH_VU`, `DANG_KY_GOI` | 3.1.5 | - | `MISSING_SRS` |
| **Provider Platform** | `NHA_CUNG_CAP`, `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`, `PHAN_HOI_DANH_GIA` | 3.6 | UC SP001 - SP012 | `COMPLETE` |
| **Administration** | `DUYET_NOI_DUNG`, `BAO_CAO_NOI_DUNG` | 3.7 | UC 018 - 021 | `COMPLETE` |
| **System Notifications** | `THONG_BAO` | Implied | - | `MISSING_SRS` |
| **Discount Codes** | - | 3.7.4 | UC 022 | `MISSING_DB` |
| **OTA Bookings** | - | 7.2 | - | `OUT_OF_SCOPE` |

## 2. Feature Traceability Matrix

| Feature Area | CRD Section | SRS Use Cases | Database Tables |
| :--- | :--- | :--- | :--- |
| **Authentication & Profile** | 3.1 | UC 001, UC 002, UC 003, UC 004 | `NGUOI_DUNG`, `OTP_XAC_THUC`, `REFRESH_TOKEN` |
| **Trip Planning (Core)** | 3.2 | UC 005, 006, 007, 008, 009, 010, 017 | `LICH_TRINH`, `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`, `CHI_PHI_DICH_VU_LICH_TRINH`, `CHIA_SE_LICH_TRINH` |
| **Discovery** | 3.3 | UC 011 | `DIA_DIEM`, `DICH_VU`, `TINH_THANH`, `TAG`, `DIA_DIEM_TAG`, `ANH_DIA_DIEM`, `ANH_DICH_VU` |
| **Community (Reviews)** | 3.4.1 | UC 013 | `DANH_GIA`, `ANH_DANH_GIA` |
| **Community (Sharing)** | 3.4.2 | UC 014, UC 015 | `LUU_LICH_TRINH`, `THICH_LICH_TRINH`, `LICH_SU_CLONE` |
| **Provider Promotion Platform** | 3.6 | UC SP001 to UC SP012 | `NHA_CUNG_CAP`, `DICH_VU`, `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`, `PHAN_HOI_DANH_GIA` |
| **Administration** | 3.7 | UC 018 to UC 021 | `DUYET_NOI_DUNG`, `BAO_CAO_NOI_DUNG` |

## 3. Home Module Audit

| Component | Actor | Purpose / Feature | Database Tables |
| :--- | :--- | :--- | :--- |
| **Landing Page** | Guest | View public features, search entry, trending public trips. | `LICH_TRINH`, `DIA_DIEM` |
| **Dashboard** | Traveler | Overview of user's recent trips, upcoming schedule, quick stats. | `LICH_TRINH`, `THONG_BAO` |
| **Profile** | Traveler | Manage personal information, settings, and view saved trips. | `NGUOI_DUNG`, `LUU_LICH_TRINH` |
| **Notification Center** | Traveler, Provider, Admin | View system notifications, approval statuses, and interaction alerts. | `THONG_BAO` |

## 4. Actor Traceability Matrix

| Actor | CRD Definition | SRS Mapping | Database Mapping |
| :--- | :--- | :--- | :--- |
| **Guest** | 2.1 (View public content) | 2.4 (Khách du lịch) | *(No database record, unauthenticated)* |
| **Traveler** | 2.2 (Registered, core features) | 2.4 (Người dùng) | `NGUOI_DUNG` (`vai_tro` = 'TRAVELER') |
| **Premium Traveler** | 2.2 (Paid AI features) | *(Implied in UI)* | `NGUOI_DUNG` with active `DANG_KY_GOI` |
| **Provider Pending** | 3.6.1 (Waiting approval) | UC SP001 | `NHA_CUNG_CAP` (`trang_thai` = 'PENDING') |
| **Provider Approved** | 3.6.1 (Managing services) | 2.4 (Nhà cung cấp) | `NHA_CUNG_CAP` (`trang_thai` = 'APPROVED') & `NGUOI_DUNG` (`vai_tro` = 'PROVIDER') |
| **Admin** | 2.4 (Highest privilege) | 2.4 (Quản trị viên) | `NGUOI_DUNG` (`vai_tro` = 'ADMIN') |

## 5. Page Inventory

| Page Name | Actor | Feature | Database Tables | Related Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Landing Page** | Guest | Home | `LICH_TRINH`, `DIA_DIEM` | None |
| **Auth Pages (Login/Register/Forgot)** | Guest | Authentication | `NGUOI_DUNG`, `OTP_XAC_THUC` | UC 001, UC 002, UC 003 |
| **Traveler Dashboard** | Traveler | Home | `LICH_TRINH` | UC 005 |
| **Trip Planner (Drag & Drop)** | Traveler | Trip Planning | `LICH_TRINH`, `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`, `CHI_PHI_DICH_VU_LICH_TRINH` | UC 005, UC 006, UC 007, UC 008, UC 017 |
| **Trip Detail (Read-Only)** | Guest, Traveler | Trip Planning | `LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH` | UC 009, UC 014, UC 015 |
| **Explore (Discovery)** | Guest, Traveler | Discovery | `DIA_DIEM`, `DICH_VU`, `TINH_THANH`, `TAG` | UC 011 |
| **Service Detail** | Guest, Traveler | Discovery, Reviews | `DICH_VU`, `DIA_DIEM`, `DANH_GIA`, `PHAN_HOI_DANH_GIA` | UC 011, UC 013 |
| **Community Feed** | Guest, Traveler | Community | `LICH_TRINH`, `THICH_LICH_TRINH`, `LICH_SU_CLONE` | UC 014, UC 015 |
| **Blog Feed** | Guest, Traveler | Travel Blog | `BAI_VIET`, `THICH_BAI_VIET` | *(Missing SRS)* |
| **Blog Detail** | Guest, Traveler | Travel Blog | `BAI_VIET`, `BINH_LUAN_BAI_VIET` | *(Missing SRS)* |
| **Create Blog Post** | Traveler | Travel Blog | `BAI_VIET`, `ANH_BAI_VIET` | *(Missing SRS)* |
| **AI Generator / Chat** | Premium Traveler | AI Travel Assistant | `LICH_SU_AI` | *(Missing SRS)* |
| **Profile Settings** | Traveler, Provider, Admin | Profile | `NGUOI_DUNG` | UC 004 |
| **User Saved Items** | Traveler | Community | `LUU_LICH_TRINH`, `THEO_DOI_NGUOI_DUNG` | *(Missing SRS)* |
| **Premium Upgrade** | Traveler | Freemium | `GOI_DICH_VU`, `DANG_KY_GOI` | *(Missing SRS)* |
| **Notification Center** | Traveler, Provider, Admin | Home | `THONG_BAO` | *(Implied)* |
| **Provider Dashboard** | Provider Approved | Provider Platform | `NHA_CUNG_CAP`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC` | UC SP009, UC SP010, UC SP011, UC SP012 |
| **Provider Service Management**| Provider Approved | Provider Platform | `DICH_VU`, `ANH_DICH_VU` | UC SP003, UC SP004, UC SP005 |
| **Provider Reviews Management**| Provider Approved | Provider Platform | `DANH_GIA`, `PHAN_HOI_DANH_GIA` | UC SP008 |
| **Provider Registration/Profile**| Provider Pending, Approved | Provider Platform | `NHA_CUNG_CAP` | UC SP001, UC SP002 |
| **Admin Dashboard** | Admin | Administration | *(Multiple Stats)* | UC 021 |
| **Admin Users Management** | Admin | Administration | `NGUOI_DUNG` | UC 018 |
| **Admin Content Moderation** | Admin | Administration | `DUYET_NOI_DUNG`, `BAO_CAO_NOI_DUNG` | UC 019 |
| **Admin Category Management** | Admin | Administration | `TINH_THANH`, `TAG`, `DIA_DIEM` | UC 020 |

## 6. Database Coverage Report

| Table Name | Purpose | Related Feature | Related Pages |
| :--- | :--- | :--- | :--- |
| `ANH_BAI_VIET` | Images for blog posts | Travel Blog | Blog Detail |
| `ANH_DANH_GIA` | Images for reviews | Community Reviews | Service Detail |
| `ANH_DIA_DIEM` | Images for locations | Discovery | Explore, Service Detail |
| `ANH_DICH_VU` | Images for services | Discovery | Explore, Service Detail |
| `BAI_VIET` | Blog post content | Travel Blog | Blog Feed, Blog Detail |
| `BAO_CAO_NOI_DUNG` | Content violation reports | Administration | Admin Content Moderation |
| `BINH_LUAN_BAI_VIET` | Comments on blogs | Travel Blog | Blog Detail |
| `CHI_PHI_DICH_VU_LICH_TRINH`| Custom costs in trip | Trip Planning | Trip Planner |
| `CHIA_SE_LICH_TRINH` | Collaboration permissions | Trip Planning | Trip Planner |
| `DANG_KY_GOI` | Traveler premium subs | Freemium | Profile, Premium Upgrade |
| `DANG_KY_GOI_NCC` | Provider promo subs | Provider Platform | Provider Dashboard |
| `DANH_GIA` | User reviews & ratings | Community Reviews | Service Detail, Admin Moderation |
| `DIA_DIEM` | Master locations | Discovery | Explore, Service Detail, Admin Categories |
| `DIA_DIEM_LICH_TRINH` | Places within a trip | Trip Planning | Trip Planner |
| `DIA_DIEM_TAG` | Mapping places to tags | Discovery | Explore |
| `DICH_VU` | Master services | Discovery, Provider | Explore, Service Detail, Provider Service Mgt |
| `DICH_VU_LICH_TRINH` | Services within a trip | Trip Planning | Trip Planner |
| `DUYET_NOI_DUNG` | Moderation logs | Administration | Admin Content Moderation |
| `GOI_DICH_VU` | Premium packages defs | Freemium | Premium Upgrade |
| `GOI_DICH_VU_NCC` | Provider promo packages | Provider Platform | Provider Dashboard |
| `LICH_SU_AI` | AI prompt & token usage | AI Travel Assistant | AI Generator / Chat |
| `LICH_SU_CLONE` | Trip clone tracking | Community Sharing | Community Feed |
| `LICH_TRINH` | Master trip record | Trip Planning | Trip Planner, Traveler Dashboard |
| `LUU_LICH_TRINH` | Bookmarked trips | Community Sharing | User Saved Items |
| `NGAY_LICH_TRINH` | Days in a trip timeline | Trip Planning | Trip Planner |
| `NGUOI_DUNG` | Master user accounts | Authentication | Auth Pages, Admin Users Management |
| `NHA_CUNG_CAP` | Provider business profiles| Provider Platform | Provider Dashboard, Registration |
| `OTP_XAC_THUC` | Email OTP verification | Authentication | Auth Pages |
| `PHAN_HOI_DANH_GIA` | Provider replies to reviews| Provider Platform | Service Detail, Provider Reviews Mgt |
| `REFRESH_TOKEN` | JWT security tokens | Authentication | *(Backend Only)* |
| `TAG` | Discovery classification | Discovery | Admin Category Management |
| `THANH_TOAN_NCC` | Provider payments | Provider Platform | Provider Dashboard |
| `THEO_DOI_NGUOI_DUNG` | User following (Social) | Travel Blog | User Saved Items |
| `THICH_BAI_VIET` | Blog post likes | Travel Blog | Blog Detail |
| `THICH_LICH_TRINH` | Trip likes | Community Sharing | Community Feed, Trip Detail |
| `THONG_BAO` | System notifications | System Notification | Notification Center |
| `TINH_THANH` | Regions/Provinces master | Discovery | Admin Category Management |

## 7. Missing Coverage Details

### A. MISSING_SRS (Supported by DB and CRD, but lack specific Use Cases)
- **AI Travel Assistant**: Mentioned in CRD 3.5 and has `LICH_SU_AI` DB table. Missing SRS Use Cases.
- **Blog du lịch & Tương tác cộng đồng**: Extensive DB support but missing SRS flows.
- **Traveler Premium Upgrades**: Supported by DB (`DANG_KY_GOI`) but missing UI Use Cases.

### B. MISSING_DB (Cannot be implemented frontend)
- **Quản lý mã giảm giá**: Missing from DB entirely.

---
*(Additions per Phase 1 Final Revision)*

## 8. Admin Dashboard Data Source Matrix

| Metric / KPI | Explicit Database Table(s) | Status |
| :--- | :--- | :--- |
| Tổng người dùng | `NGUOI_DUNG` | READY |
| Số lịch trình | `LICH_TRINH` | READY |
| Lượt dùng AI | `LICH_SU_AI` | READY |
| Doanh thu Premium Traveler | `DANG_KY_GOI` | READY |
| Doanh thu gói NCC | `THANH_TOAN_NCC`, `DANG_KY_GOI_NCC` | READY |
| Xu hướng du lịch | *(Complex aggregations needed)* | `BACKEND_REQUIRED` |

## 9. AI Feature Breakdown

| AI Feature | Purpose | Database Tables | Status |
| :--- | :--- | :--- | :--- |
| **AI Generate Trip** | Auto-generate days, places, and services based on prompt | `LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`, `LICH_SU_AI` | `MISSING_SRS` |
| **AI Route Optimizer** | Re-order locations for optimal travel time/distance | `DIA_DIEM_LICH_TRINH`, `LICH_SU_AI` | `MISSING_SRS` |
| **AI Budget Advisor** | Estimate and suggest cost optimizations | `CHI_PHI_DICH_VU_LICH_TRINH`, `LICH_SU_AI` | `MISSING_SRS` |
| **AI Chat Assistant** | Conversational UI for travel advice | `LICH_SU_AI` | `MISSING_SRS` |

## 10. Notification Feature Audit

| Notification Type | Trigger / Event | Target Actor | Related Tables |
| :--- | :--- | :--- | :--- |
| **Social: Follow** | Someone follows the user | Traveler, Blogger | `THONG_BAO`, `THEO_DOI_NGUOI_DUNG` |
| **Social: Interaction** | Comment/Like on Post/Trip | Traveler, Blogger | `THONG_BAO`, `BINH_LUAN_BAI_VIET`, `THICH_LICH_TRINH` |
| **Collaboration** | Invited to edit a trip | Traveler | `THONG_BAO`, `CHIA_SE_LICH_TRINH` |
| **Moderation: Approved/Rejected** | Post/Service/Review moderated | Provider, Traveler | `THONG_BAO`, `DUYET_NOI_DUNG` |
| **Provider: Review Reply** | Provider replies to a review | Traveler | `THONG_BAO`, `PHAN_HOI_DANH_GIA` |
| **Subscription: Expiry** | Premium/Promo package expiring | Traveler, Provider | `THONG_BAO`, `DANG_KY_GOI`, `DANG_KY_GOI_NCC` |
| **System Alert** | Broadcast / Warning | All Users | `THONG_BAO` |

## 11. Expected Route Inventory

The following routes are anticipated for detailed architecture in Phase 2:
- `/` (Landing Page)
- `/auth/login`, `/auth/register`, `/auth/forgot-password`
- `/dashboard`
- `/trips`, `/trips/create`, `/trips/:id`, `/trips/:id/planner`
- `/explore`, `/explore/destinations/:id`, `/explore/services/:id`
- `/community`, `/community/blogs`, `/community/blogs/:id`
- `/ai/chat`, `/ai/planner`
- `/profile`, `/profile/settings`, `/profile/saved`
- `/provider/dashboard`, `/provider/services`, `/provider/packages`
- `/admin/dashboard`, `/admin/users`, `/admin/moderation`, `/admin/categories`

## 12. Backend Required Matrix

*Note: Since the API backend is not yet implemented, any valid feature requires a backend implementation before the UI can be functional.*

| Feature | Database Support | UI Required | API Exists | Status |
| :--- | :--- | :--- | :--- | :--- |
| Authentication | `NGUOI_DUNG` | Yes | No | `BACKEND_REQUIRED` |
| Trip Planning | `LICH_TRINH`, etc. | Yes | No | `BACKEND_REQUIRED` |
| Explore / Discovery | `DIA_DIEM`, `DICH_VU` | Yes | No | `BACKEND_REQUIRED` |
| Community Reviews | `DANH_GIA` | Yes | No | `BACKEND_REQUIRED` |
| Community Blog | `BAI_VIET` | Yes | No | `BACKEND_REQUIRED` |
| AI Features | `LICH_SU_AI` | Yes | No | `BACKEND_REQUIRED` |
| Provider Dashboard | `NHA_CUNG_CAP` | Yes | No | `BACKEND_REQUIRED` |
| Admin Operations | Multiple | Yes | No | `BACKEND_REQUIRED` |
| Discount Codes | *(None)* | Yes | No | `MISSING_DB` |
| OTA Bookings | *(None)* | No | No | `OUT_OF_SCOPE` |
