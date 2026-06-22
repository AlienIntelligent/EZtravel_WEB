# Frontend Route Architecture

## 1. Route Dependency Matrix

| Route | Parent Route | Required Permission | Required Data | Required APIs | Redirect Rules |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | None | Public | Trending Trips, Locations | `GET /api/public/home` | Authenticated -> `/dashboard` |
| `/auth/login` | None | Public | None | `POST /api/auth/login` | Authenticated -> `/dashboard` |
| `/auth/register` | None | Public | None | `POST /api/auth/register` | Authenticated -> `/dashboard` |
| `/dashboard` | `/` | `TRAVELER` | User stats, recent trips | `GET /api/traveler/dashboard` | Unauthenticated -> `/auth/login` |
| `/trips` | `/dashboard` | `TRAVELER` | User trips list | `GET /api/trips` | Unauthenticated -> `/auth/login` |
| `/trips/create` | `/trips` | `TRAVELER` | Trip Metadata Form | `POST /api/trips` | Unauthenticated -> `/auth/login` |
| `/trips/:id` | `/trips` | `TRAVELER` (Owner/Collaborator) | Trip details (Read-Only) | `GET /api/trips/:id` | Unauthorized -> `/dashboard` |
| `/trips/:id/planner` | `/trips/:id` | `TRAVELER` (Owner/Collaborator) | Trip details, days, locations | `GET /api/trips/:id/planner` | Unauthorized -> `/dashboard` |
| `/explore` | `/` | Public | Locations, Services, Tags | `GET /api/explore` | None |
| `/community/blogs` | `/community` | Public | Blog list | `GET /api/blogs` | None |
| `/community/blogs/:id`| `/community/blogs` | Public | Blog details | `GET /api/blogs/:id` | None |
| `/community/blogs/create`| `/community/blogs` | `TRAVELER` | Blog form | `POST /api/blogs` | Unauthenticated -> `/auth/login` |
| `/ai/planner` | `/` | `PREMIUM_TRAVELER` | AI Form inputs | `POST /api/ai/generate` | Non-Premium -> `/upgrade` |
| `/provider/dashboard` | `/provider` | `PROVIDER_APPROVED` | Provider stats | `GET /api/provider/dashboard` | Pending -> `/provider/pending` |
| `/admin/dashboard` | `/admin` | `ADMIN` | System stats | `GET /api/admin/dashboard` | Unauthorized -> `/` |

## 2. Navigation Tree

### Public Navigation
- Trang chủ (`/`)
- Khám phá (`/explore`)
- Cộng đồng (`/community`)
- Blog Du Lịch (`/community/blogs`)
- Đăng nhập (`/auth/login`)
- Đăng ký (`/auth/register`)

### Traveler Navigation
- Dashboard (`/dashboard`)
- Lịch trình của tôi (`/trips`)
- Khám phá (`/explore`)
- Cộng đồng (`/community`)
- Blog Du Lịch (`/community/blogs`)
- Nâng cấp Premium (`/upgrade`)
- Thông báo (`/notifications`)
- Hồ sơ cá nhân (`/profile`)

### Premium Navigation
- **(Kế thừa Traveler Navigation)**
- AI Lên Lịch Trình (`/ai/planner`)
- AI Chatbot (`/ai/chat`)

### Provider Navigation
- Dashboard (`/provider/dashboard`)
- Quản lý Dịch vụ (`/provider/services`)
- Đánh giá & Phản hồi (`/provider/reviews`)
- Gói Quảng Bá (`/provider/packages`)
- Hồ sơ Doanh nghiệp (`/provider/profile`)

### Admin Navigation
- Dashboard (`/admin/dashboard`)
- Quản lý Người dùng (`/admin/users`)
- Kiểm duyệt Nội dung (`/admin/moderation`)
- Quản lý Danh mục (`/admin/categories`)

---

## 3. Detailed Route Inventory

### Category 1: Public

#### 1.1 Landing Page
* **Route**: `/`
* **Page Name**: Home
* **Feature**: Core Entry
* **Actor**: Guest
* **Permission**: Public
* **Database Tables**: `LICH_TRINH`, `DIA_DIEM`
* **Related CRD Sections**: 3.3
* **Related SRS Use Cases**: UC 011
* **Required APIs**: `GET /api/home/trending`
* **Navigation Entry Points**: URL, Logo Click
* **Exit Routes**: `/auth/login`, `/explore`, `/community`
* **Route Guards**: None (If auth token present, redirect to `/dashboard`)
* **Layout Template**: `PublicLayout`
* **Mobile Behavior**: Sticky bottom CTA to register/login.
* **Assignment**: `CONFIRMED`

#### 1.2 Authentication
* **Route**: `/auth/login`, `/auth/register`, `/auth/forgot-password`
* **Page Name**: Auth Flows
* **Feature**: Authentication & Profile
* **Actor**: Guest
* **Permission**: Public
* **Database Tables**: `NGUOI_DUNG`, `OTP_XAC_THUC`
* **Related CRD Sections**: 3.1.1, 3.1.2, 3.1.3
* **Related SRS Use Cases**: UC 001, UC 002, UC 003
* **Required APIs**: `POST /api/auth/login`, `POST /api/auth/register`
* **Navigation Entry Points**: Header "Login/Register"
* **Exit Routes**: `/dashboard` (on success)
* **Route Guards**: Redirect to `/dashboard` if already logged in.
* **Layout Template**: `AuthLayout`
* **Mobile Behavior**: Full-screen forms without top navigation.
* **Assignment**: `CONFIRMED`

#### 1.3 Explore / Discovery
* **Route**: `/explore`, `/explore/destinations/:id`, `/explore/services/:id`
* **Page Name**: Explore & Service Detail
* **Feature**: Discovery
* **Actor**: Guest, Traveler
* **Permission**: Public
* **Database Tables**: `DIA_DIEM`, `DICH_VU`, `DANH_GIA`
* **Related CRD Sections**: 3.3
* **Related SRS Use Cases**: UC 011
* **Required APIs**: `GET /api/explore`, `GET /api/services/:id`
* **Navigation Entry Points**: Main Header "Explore"
* **Exit Routes**: `/trips/:id/planner` (via "Add to Trip" button)
* **Route Guards**: None. (Add to Trip button triggers Auth Guard).
* **Layout Template**: `PublicLayout`
* **Mobile Behavior**: Filter drawer slides up from bottom. Map view toggle.
* **Assignment**: `CONFIRMED`

#### 1.4 Community (Trips)
* **Route**: `/community`, `/community/trips/:id`
* **Page Name**: Community Feed & Trip Detail
* **Feature**: Community Sharing
* **Actor**: Guest, Traveler
* **Permission**: Public
* **Database Tables**: `LICH_TRINH`, `DIA_DIEM_LICH_TRINH`
* **Related CRD Sections**: 3.4.1, 3.4.2
* **Related SRS Use Cases**: UC 014, UC 015
* **Required APIs**: `GET /api/community/feed`, `GET /api/community/trips/:id`
* **Navigation Entry Points**: Main Header "Community"
* **Exit Routes**: `/trips/:id/planner` (via "Clone" button)
* **Route Guards**: None. (Clone button triggers Auth Guard).
* **Layout Template**: `PublicLayout`
* **Mobile Behavior**: Infinite scroll feed.
* **Assignment**: `CONFIRMED`

#### 1.5 Travel Blog (Read)
* **Route**: `/community/blogs`, `/community/blogs/:id`
* **Page Name**: Blog Feed & Blog Detail
* **Feature**: Travel Blog & Social
* **Actor**: Guest, Traveler
* **Permission**: Public
* **Database Tables**: `BAI_VIET`, `BINH_LUAN_BAI_VIET`, `THICH_BAI_VIET`, `ANH_BAI_VIET`
* **Related CRD Sections**: 3.4.3
* **Related SRS Use Cases**: Missing SRS
* **Required APIs**: `GET /api/blogs`, `GET /api/blogs/:id`
* **Navigation Entry Points**: Main Header "Blog"
* **Exit Routes**: None
* **Route Guards**: None.
* **Layout Template**: `PublicLayout`
* **Mobile Behavior**: Infinite scroll feed.
* **Assignment**: `ASSUMED_FROM_CRD`

### Category 2: Authenticated Traveler

#### 2.1 Traveler Dashboard
* **Route**: `/dashboard`
* **Page Name**: Traveler Dashboard
* **Feature**: Trip Planning (Overview)
* **Actor**: Traveler
* **Permission**: `TRAVELER`
* **Database Tables**: `LICH_TRINH`, `THONG_BAO`
* **Related CRD Sections**: 3.2.1
* **Related SRS Use Cases**: UC 005
* **Required APIs**: `GET /api/traveler/dashboard`
* **Navigation Entry Points**: Login Success, Logo Click
* **Exit Routes**: `/trips/create`, `/trips/:id/planner`
* **Route Guards**: Requires Auth. Redirects to `/auth/login` if guest.
* **Layout Template**: `TravelerLayout`
* **Mobile Behavior**: Grid transforms to single column stack.
* **Assignment**: `CONFIRMED`

#### 2.2 My Trips
* **Route**: `/trips`
* **Page Name**: My Trips List
* **Feature**: Trip Planning (Management)
* **Actor**: Traveler
* **Permission**: `TRAVELER`
* **Database Tables**: `LICH_TRINH`
* **Related CRD Sections**: 3.2.1
* **Related SRS Use Cases**: UC 009
* **Required APIs**: `GET /api/trips`
* **Navigation Entry Points**: Traveler Sidebar
* **Exit Routes**: `/trips/create`, `/trips/:id`, `/trips/:id/planner`
* **Route Guards**: Requires Auth.
* **Layout Template**: `TravelerLayout`
* **Mobile Behavior**: List view with quick action sheets.
* **Assignment**: `CONFIRMED`

#### 2.3 Trip Detail (Read-Only)
* **Route**: `/trips/:id`
* **Page Name**: Trip Overview
* **Feature**: Trip Planning (Overview)
* **Actor**: Traveler
* **Permission**: `TRAVELER` (Owner/Collaborator)
* **Database Tables**: `LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`
* **Related CRD Sections**: 3.2
* **Related SRS Use Cases**: UC 009
* **Required APIs**: `GET /api/trips/:id`
* **Navigation Entry Points**: `/trips`
* **Exit Routes**: `/trips/:id/planner`
* **Route Guards**: Requires Auth & Ownership validation.
* **Layout Template**: `TravelerLayout`
* **Mobile Behavior**: Stacked cards summarizing the itinerary.
* **Assignment**: `CONFIRMED`

#### 2.4 Trip Planner
* **Route**: `/trips/create`, `/trips/:id/planner`
* **Page Name**: Trip Planner (Drag & Drop)
* **Feature**: Trip Planning (Core)
* **Actor**: Traveler
* **Permission**: `TRAVELER` (Must be Owner or Collaborator)
* **Database Tables**: `LICH_TRINH`, `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`, `LICH_SU_AI`
* **Related CRD Sections**: 3.2.2, 3.2.3, 3.5.2 (AI Optimizer), 3.5.3 (AI Budget)
* **Related SRS Use Cases**: UC 006, UC 007, UC 008, UC 017
* **Required APIs**: `GET /api/trips/:id`, `PUT /api/trips/:id`
* **Navigation Entry Points**: `/dashboard`, `/trips`, `/trips/:id`
* **Exit Routes**: `/trips/:id`
* **Route Guards**: Requires Auth & Ownership validation.
* **Layout Template**: `PlannerLayout` (Full width, no footer)
* **Mobile Behavior**: Map hidden by default, timeline collapses into accordions. Drag & drop replaced by up/down arrows.
* **Embedded AI Features**: Explicitly includes **AI Route Optimizer** and **AI Budget Advisor** widgets seamlessly inside the planner interface for Premium Travelers.
* **Assignment**: `CONFIRMED`

#### 2.5 Create Blog Post
* **Route**: `/community/blogs/create`
* **Page Name**: Create Blog
* **Feature**: Travel Blog & Social
* **Actor**: Traveler
* **Permission**: `TRAVELER`
* **Database Tables**: `BAI_VIET`, `ANH_BAI_VIET`
* **Related CRD Sections**: 3.4.3
* **Related SRS Use Cases**: Missing SRS
* **Required APIs**: `POST /api/blogs`
* **Navigation Entry Points**: `/community/blogs` CTA
* **Exit Routes**: `/community/blogs/:id` (on success)
* **Route Guards**: Requires Auth.
* **Layout Template**: `TravelerLayout`
* **Mobile Behavior**: Responsive rich-text editor.
* **Assignment**: `ASSUMED_FROM_CRD`

#### 2.6 Profile & Settings
* **Route**: `/profile`, `/profile/saved`, `/profile/reviews`
* **Page Name**: Traveler Profile
* **Feature**: Authentication & Profile, Community
* **Actor**: Traveler
* **Permission**: `TRAVELER`
* **Database Tables**: `NGUOI_DUNG`, `LUU_LICH_TRINH`, `DANH_GIA`
* **Related CRD Sections**: 3.1.4, 3.4.4
* **Related SRS Use Cases**: UC 004, UC 013
* **Required APIs**: `GET /api/profile`, `PUT /api/profile`
* **Navigation Entry Points**: User Avatar Menu
* **Exit Routes**: Any
* **Route Guards**: Requires Auth.
* **Layout Template**: `TravelerLayout`
* **Mobile Behavior**: Left sidebar navigation becomes a horizontal scrolling tab bar.
* **Assignment**: `CONFIRMED`

#### 2.7 Notifications
* **Route**: `/notifications`
* **Page Name**: Notification Center
* **Feature**: System Notifications
* **Actor**: Traveler
* **Permission**: `TRAVELER`
* **Database Tables**: `THONG_BAO`
* **Related CRD Sections**: Implied
* **Related SRS Use Cases**: Missing SRS
* **Required APIs**: `GET /api/notifications`
* **Navigation Entry Points**: Header Bell Icon
* **Exit Routes**: Destination of the notification link.
* **Route Guards**: Requires Auth.
* **Layout Template**: `TravelerLayout`
* **Mobile Behavior**: Full page list instead of dropdown popover.
* **Assignment**: `ASSUMED_FROM_CRD`

#### 2.8 Upgrade
* **Route**: `/upgrade`
* **Page Name**: Premium Upgrade
* **Feature**: Freemium Subscriptions
* **Actor**: Traveler
* **Permission**: `TRAVELER`
* **Database Tables**: `GOI_DICH_VU`, `DANG_KY_GOI`
* **Related CRD Sections**: 3.1.5
* **Related SRS Use Cases**: Missing SRS
* **Required APIs**: `GET /api/packages`, `POST /api/packages/subscribe`
* **Navigation Entry Points**: Sidebar "Upgrade to Premium" CTA
* **Exit Routes**: `/dashboard`
* **Route Guards**: Requires Auth.
* **Layout Template**: `TravelerLayout`
* **Mobile Behavior**: Pricing cards stack vertically.
* **Assignment**: `ASSUMED_FROM_CRD`

### Category 3: Premium Traveler

#### 3.1 AI Trip Generator
* **Route**: `/ai/planner`
* **Page Name**: AI Trip Generator
* **Feature**: AI Travel Assistant
* **Actor**: Premium Traveler
* **Permission**: `PREMIUM_TRAVELER`
* **Database Tables**: `LICH_SU_AI`, `LICH_TRINH`
* **Related CRD Sections**: 3.5.1
* **Related SRS Use Cases**: Missing SRS
* **Required APIs**: `POST /api/ai/generate`
* **Navigation Entry Points**: Dashboard "Magic Create" button
* **Exit Routes**: `/trips/:id/planner` (on success)
* **Route Guards**: Requires Auth + Active Premium Subscription. Redirects to `/upgrade` if invalid.
* **Layout Template**: `TravelerLayout`
* **Mobile Behavior**: Step-by-step wizard UI.
* **Assignment**: `ASSUMED_FROM_CRD`

#### 3.2 AI Chatbot
* **Route**: `/ai/chat`
* **Page Name**: AI Chat Assistant
* **Feature**: AI Travel Assistant
* **Actor**: Premium Traveler
* **Permission**: `PREMIUM_TRAVELER`
* **Database Tables**: `LICH_SU_AI`
* **Related CRD Sections**: 3.5.4
* **Related SRS Use Cases**: Missing SRS
* **Required APIs**: `POST /api/ai/chat`
* **Navigation Entry Points**: Floating Action Button (FAB) or Sidebar
* **Exit Routes**: None (Persistent Drawer/Modal)
* **Route Guards**: Requires Auth + Active Premium Subscription.
* **Layout Template**: `ChatLayout`
* **Mobile Behavior**: Full screen chat view.
* **Assignment**: `ASSUMED_FROM_CRD`

### Category 4: Provider Pending

#### 4.1 Provider Registration
* **Route**: `/provider/registration`
* **Page Name**: Provider Onboarding
* **Feature**: Provider Platform
* **Actor**: Traveler
* **Permission**: `TRAVELER` (Without Provider Profile)
* **Database Tables**: `NHA_CUNG_CAP`
* **Related CRD Sections**: 3.6.1
* **Related SRS Use Cases**: UC SP001
* **Required APIs**: `POST /api/provider/register`
* **Navigation Entry Points**: Footer "Trở thành đối tác"
* **Exit Routes**: `/provider/pending`
* **Route Guards**: Requires Auth. Redirects to `/provider/dashboard` if already approved.
* **Layout Template**: `ProviderAuthLayout`
* **Mobile Behavior**: Multi-step vertical scroll form.
* **Assignment**: `CONFIRMED`

#### 4.2 Provider Pending Status
* **Route**: `/provider/pending`
* **Page Name**: Registration Pending Review
* **Feature**: Provider Platform
* **Actor**: Provider Pending
* **Permission**: `PROVIDER_PENDING`
* **Database Tables**: `NHA_CUNG_CAP`
* **Related CRD Sections**: 3.6.1
* **Related SRS Use Cases**: UC SP001
* **Required APIs**: `GET /api/provider/status`
* **Navigation Entry Points**: Direct route or Registration success
* **Exit Routes**: `/dashboard`
* **Route Guards**: Requires `trang_thai = PENDING`.
* **Layout Template**: `ProviderAuthLayout`
* **Mobile Behavior**: Static status message.
* **Assignment**: `CONFIRMED`

### Category 5: Provider Approved

#### 5.1 Provider Dashboard
* **Route**: `/provider/dashboard`
* **Page Name**: Provider Dashboard
* **Feature**: Provider Platform
* **Actor**: Provider Approved
* **Permission**: `PROVIDER_APPROVED`
* **Database Tables**: `NHA_CUNG_CAP`, `DANG_KY_GOI_NCC`
* **Related CRD Sections**: 3.6.2
* **Related SRS Use Cases**: UC SP009, SP012
* **Required APIs**: `GET /api/provider/stats`
* **Navigation Entry Points**: App Switcher "Sang Kênh Đối Tác"
* **Exit Routes**: `/provider/services`
* **Route Guards**: Requires `PROVIDER_APPROVED`.
* **Layout Template**: `ProviderLayout`
* **Mobile Behavior**: Key metrics stacked vertically.
* **Assignment**: `CONFIRMED`

#### 5.2 Provider Services
* **Route**: `/provider/services`, `/provider/services/create`, `/provider/services/:id/edit`
* **Page Name**: Service Management
* **Feature**: Provider Platform
* **Actor**: Provider Approved
* **Permission**: `PROVIDER_APPROVED`
* **Database Tables**: `DICH_VU`, `ANH_DICH_VU`
* **Related CRD Sections**: 3.6.3
* **Related SRS Use Cases**: UC SP003, SP004, SP005
* **Required APIs**: `GET /api/provider/services`, `POST /api/provider/services`
* **Navigation Entry Points**: Provider Sidebar
* **Exit Routes**: `/provider/dashboard`
* **Route Guards**: Requires `PROVIDER_APPROVED`. Owner validation for Edit.
* **Layout Template**: `ProviderLayout`
* **Mobile Behavior**: Data tables convert to card lists.
* **Assignment**: `CONFIRMED`

#### 5.3 Provider Reviews
* **Route**: `/provider/reviews`
* **Page Name**: Review Management
* **Feature**: Provider Platform
* **Actor**: Provider Approved
* **Permission**: `PROVIDER_APPROVED`
* **Database Tables**: `DANH_GIA`, `PHAN_HOI_DANH_GIA`
* **Related CRD Sections**: 3.6.4
* **Related SRS Use Cases**: UC SP008
* **Required APIs**: `GET /api/provider/reviews`, `POST /api/provider/reviews/reply`
* **Navigation Entry Points**: Provider Sidebar
* **Exit Routes**: None
* **Route Guards**: Requires `PROVIDER_APPROVED`.
* **Layout Template**: `ProviderLayout`
* **Mobile Behavior**: Collapsible reply fields.
* **Assignment**: `CONFIRMED`

#### 5.4 Provider Promotions
* **Route**: `/provider/packages`
* **Page Name**: Package Subscription
* **Feature**: Provider Platform
* **Actor**: Provider Approved
* **Permission**: `PROVIDER_APPROVED`
* **Database Tables**: `GOI_DICH_VU_NCC`, `DANG_KY_GOI_NCC`, `THANH_TOAN_NCC`
* **Related CRD Sections**: 3.6.5
* **Related SRS Use Cases**: UC SP010, SP011
* **Required APIs**: `GET /api/provider/packages`, `POST /api/provider/packages/subscribe`
* **Navigation Entry Points**: Provider Sidebar
* **Exit Routes**: `/provider/dashboard`
* **Route Guards**: Requires `PROVIDER_APPROVED`.
* **Layout Template**: `ProviderLayout`
* **Mobile Behavior**: Horizontal scroll for package comparison.
* **Assignment**: `CONFIRMED`

### Category 6: Admin

#### 6.1 Admin Dashboard
* **Route**: `/admin/dashboard`
* **Page Name**: Admin Overview
* **Feature**: Administration
* **Actor**: Admin
* **Permission**: `ADMIN`
* **Database Tables**: `NGUOI_DUNG`, `LICH_TRINH`, `LICH_SU_AI`, `DANG_KY_GOI`, `THANH_TOAN_NCC`, `DANG_KY_GOI_NCC`
* **Related CRD Sections**: 3.7.1
* **Related SRS Use Cases**: UC 021
* **Required APIs**: `GET /api/admin/stats`
* **Navigation Entry Points**: URL
* **Exit Routes**: `/admin/users`
* **Route Guards**: Requires `ADMIN` role.
* **Layout Template**: `AdminLayout`
* **Mobile Behavior**: Highly restricted, prefer desktop usage. Data tables require horizontal scrolling.
* **Assignment**: `CONFIRMED`

#### 6.2 Admin User Management
* **Route**: `/admin/users`
* **Page Name**: Manage Users
* **Feature**: Administration
* **Actor**: Admin
* **Permission**: `ADMIN`
* **Database Tables**: `NGUOI_DUNG`
* **Related CRD Sections**: 3.7.2
* **Related SRS Use Cases**: UC 018
* **Required APIs**: `GET /api/admin/users`, `PUT /api/admin/users/:id`
* **Navigation Entry Points**: Admin Sidebar
* **Exit Routes**: None
* **Route Guards**: Requires `ADMIN` role.
* **Layout Template**: `AdminLayout`
* **Mobile Behavior**: Data tables require horizontal scrolling.
* **Assignment**: `CONFIRMED`

#### 6.3 Admin Content Moderation
* **Route**: `/admin/moderation`
* **Page Name**: Moderation Queue
* **Feature**: Administration
* **Actor**: Admin
* **Permission**: `ADMIN`
* **Database Tables**: `DUYET_NOI_DUNG`, `BAO_CAO_NOI_DUNG`
* **Related CRD Sections**: 3.7.3
* **Related SRS Use Cases**: UC 019
* **Required APIs**: `GET /api/admin/moderation`, `PUT /api/admin/moderation/:id`
* **Navigation Entry Points**: Admin Sidebar
* **Exit Routes**: None
* **Route Guards**: Requires `ADMIN` role.
* **Layout Template**: `AdminLayout`
* **Mobile Behavior**: Tabbed queues.
* **Assignment**: `CONFIRMED`

#### 6.4 Admin Categories
* **Route**: `/admin/categories`
* **Page Name**: Category Data
* **Feature**: Administration
* **Actor**: Admin
* **Permission**: `ADMIN`
* **Database Tables**: `TINH_THANH`, `TAG`
* **Related CRD Sections**: (Implied base data)
* **Related SRS Use Cases**: UC 020
* **Required APIs**: `GET /api/admin/categories`, `POST /api/admin/categories`
* **Navigation Entry Points**: Admin Sidebar
* **Exit Routes**: None
* **Route Guards**: Requires `ADMIN` role.
* **Layout Template**: `AdminLayout`
* **Mobile Behavior**: Accordion lists.
* **Assignment**: `CONFIRMED`
