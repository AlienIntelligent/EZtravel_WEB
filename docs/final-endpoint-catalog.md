# Final Endpoint Catalog

This document is the definitive backend API catalog optimized for database consistency, frontend requirements, and long-term maintainability.

| Method | Route | Module | Permission | Status | Database Tables | Frontend Pages | Frontend Components |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Auth | Public | CONFIRMED | `NGUOI_DUNG` | `/auth/login` | `LoginForm` |
| **POST** | `/api/auth/register` | Auth | Public | CONFIRMED | `NGUOI_DUNG`, `OTP_XAC_THUC` | `/auth/register` | `RegisterForm` |
| **POST** | `/api/auth/verify-otp` | Auth | Public | NEW | `NGUOI_DUNG`, `OTP_XAC_THUC` | `/auth/register` | `OTPVerificationModal` |
| **POST** | `/api/auth/resend-otp` | Auth | Public | NEW | `OTP_XAC_THUC` | `/auth/register` | `OTPVerificationModal` |
| **POST** | `/api/auth/forgot-password`| Auth | Public | NEW | `NGUOI_DUNG`, `OTP_XAC_THUC` | `/auth/forgot-password`| `ForgotPasswordForm` |
| **POST** | `/api/auth/reset-password` | Auth | Public | NEW | `NGUOI_DUNG`, `OTP_XAC_THUC` | `/auth/forgot-password`| `ResetPasswordForm` |
| **GET** | `/api/profile` | Auth | Auth | CONFIRMED | `NGUOI_DUNG` | `/profile` | `ProfileHeader`, `PersonalInfoForm` |
| **PUT** | `/api/profile` | Auth | Auth | CONFIRMED | `NGUOI_DUNG` | `/profile` | `PersonalInfoForm` |
| **PUT** | `/api/profile/password` | Auth | Auth | CONFIRMED | `NGUOI_DUNG` | `/profile` | `PasswordChangeForm` |
| **POST** | `/api/profile/avatar` | Auth | Auth | CONFIRMED | `NGUOI_DUNG` | `/profile` | `ProfileHeader` |
| **GET** | `/api/admin/users` | Admin | `ADMIN` | CONFIRMED | `NGUOI_DUNG` | `/admin/users` | `UserDirectoryTable` |
| **PUT** | `/api/admin/users/{id}/status` | Admin | `ADMIN` | CONFIRMED | `NGUOI_DUNG` | `/admin/users` | `UserDirectoryTable` |
| **PUT** | `/api/admin/users/{id}/role` | Admin | `ADMIN` | CONFIRMED | `NGUOI_DUNG` | `/admin/users` | `UserDirectoryTable` |
| **GET** | `/api/admin/stats` | Admin | `ADMIN` | AGGREGATION| `NGUOI_DUNG`, `LICH_TRINH`, `LICH_SU_AI`, `DANG_KY_GOI` | `/admin/dashboard` | `SystemAnalyticsGrid` |
| **GET** | `/api/admin/alerts` | Admin | `ADMIN` | AGGREGATION| `BAO_CAO_NOI_DUNG`, `NHA_CUNG_CAP` | `/admin/dashboard` | `PendingActionAlerts` |
| **GET** | `/api/admin/moderation` | Admin | `ADMIN` | AGGREGATION| `BAO_CAO_NOI_DUNG`, `NHA_CUNG_CAP` | `/admin/moderation`| `ModerationWorkspace` |
| **POST** | `/api/admin/moderation/{id}/resolve`| Admin| `ADMIN` | NEW | `DUYET_NOI_DUNG`, `BAO_CAO_NOI_DUNG`, `NHA_CUNG_CAP`| `/admin/moderation`| `ModerationWorkspace` |
| **GET** | `/api/admin/categories` | Admin | `ADMIN` | CONFIRMED | `TINH_THANH`, `TAG` | `/admin/categories`| `MasterDataManager` |
| **POST** | `/api/admin/categories` | Admin | `ADMIN` | CONFIRMED | `TINH_THANH`, `TAG` | `/admin/categories`| `MasterDataManager` |
| **DELETE**| `/api/admin/categories/{id}`| Admin | `ADMIN` | CONFIRMED | `TINH_THANH`, `TAG` | `/admin/categories`| `MasterDataManager` |
| **GET** | `/api/categories/regions` | Explore| Public | CONFIRMED | `TINH_THANH` | `/explore` | `SearchAndFilterBar` |
| **GET** | `/api/categories/tags` | Explore| Public | CONFIRMED | `TAG` | `/explore` | `SearchAndFilterBar` |
| **GET** | `/api/explore` | Explore| Public | AGGREGATION| `DIA_DIEM`, `DICH_VU`, `DIA_DIEM_TAG` | `/explore` | `DiscoveryGrid` |
| **GET** | `/api/destinations/{id}` | Explore| Public | CONFIRMED | `DIA_DIEM`, `ANH_DIA_DIEM` | `/explore/destinations/:id`| `DestinationHeader` |
| **GET** | `/api/destinations/{id}/services`| Explore| Public | AGGREGATION| `DICH_VU` | `/explore/destinations/:id`| `NearbyServicesList`|
| **GET** | `/api/services/{id}` | Explore| Public | CONFIRMED | `DICH_VU`, `ANH_DICH_VU` | `/explore/services/:id` | `ServiceInfoPanel` |
| **GET** | `/api/services/{id}/reviews`| Explore| Public | AGGREGATION| `DANH_GIA`, `PHAN_HOI_DANH_GIA`, `NGUOI_DUNG` | `/explore/services/:id` | `ReviewSection` |
| **POST** | `/api/services/{id}/reviews`| Explore| `TRAVELER` | CONFIRMED | `DANH_GIA`, `ANH_DANH_GIA` | `/explore/services/:id` | `ReviewSection` |
| **GET** | `/api/trips` | Trip Planner| `TRAVELER`| CONFIRMED | `LICH_TRINH`, `CHIA_SE_LICH_TRINH` | `/trips` | `TripsListManager` |
| **POST** | `/api/trips` | Trip Planner| `TRAVELER`| CONFIRMED | `LICH_TRINH`, `NGAY_LICH_TRINH` | `/trips/create` | `TripsListManager` |
| **DELETE**| `/api/trips/{id}` | Trip Planner| `TRAVELER`| CONFIRMED | `LICH_TRINH` | `/trips` | `TripsListManager` |
| **GET** | `/api/trips/{id}` | Trip Planner| Auth/Pub | AGGREGATION| `LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`| `/trips/:id` | `TripSummaryHeader` |
| **GET** | `/api/trips/{id}/timeline` | Trip Planner| Auth/Pub | AGGREGATION| `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH`, `CHI_PHI_DICH_VU_LICH_TRINH` | `/trips/:id`, `/trips/:id/planner` | `InteractiveTimelineManager`, `TripTimelineView` |
| **PUT** | `/api/trips/{id}/timeline` | Trip Planner| `TRAVELER`| AGGREGATION| `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH` | `/trips/:id/planner` | `InteractiveTimelineManager` |
| **GET** | `/api/trips/{id}/collaborators`| Trip Planner| `TRAVELER`| CONFIRMED | `CHIA_SE_LICH_TRINH`, `NGUOI_DUNG` | `/trips/:id/planner` | `CollaboratorSettingsModal`|
| **POST** | `/api/trips/{id}/collaborators`| Trip Planner| `TRAVELER`| CONFIRMED | `CHIA_SE_LICH_TRINH` | `/trips/:id/planner` | `CollaboratorSettingsModal`|
| **GET** | `/api/public/home/trending-destinations`| Home | Public | AGGREGATION| `DIA_DIEM`, `ANH_DIA_DIEM` | `/` | `TrendingDestinationsCarousel`|
| **GET** | `/api/public/home/trending-trips` | Home | Public | AGGREGATION| `LICH_TRINH`, `THICH_LICH_TRINH`, `NGUOI_DUNG` | `/` | `PublicTripsGrid` |
| **GET** | `/api/traveler/dashboard/stats` | Home | `TRAVELER` | AGGREGATION| `LICH_TRINH`, `LUU_LICH_TRINH`, `THONG_BAO` | `/dashboard` | `DashboardStats` |
| **GET** | `/api/trips/upcoming` | Home | `TRAVELER` | AGGREGATION| `LICH_TRINH`, `NGAY_LICH_TRINH` | `/dashboard` | `UpcomingScheduleWidget` |
| **GET** | `/api/notifications` | Home | Auth | CONFIRMED | `THONG_BAO` | `/notifications` | `NotificationList` |
| **PUT** | `/api/notifications/{id}/read`| Home | Auth | CONFIRMED | `THONG_BAO` | `/notifications` | `NotificationList` |
| **GET** | `/api/community/feed` | Community | Public | AGGREGATION| `LICH_TRINH`, `THICH_LICH_TRINH` | `/community` | `CommunityFeedFilter`, `SocialTripCard`|
| **POST** | `/api/trips/{id}/like` | Community | `TRAVELER` | CONFIRMED | `THICH_LICH_TRINH` | `/community`, `/trips/:id`| `SocialTripCard` |
| **POST** | `/api/trips/{id}/clone` | Community | `TRAVELER` | AGGREGATION| `LICH_TRINH`, `LICH_SU_CLONE`, `NGAY_LICH_TRINH`, `DIA_DIEM_LICH_TRINH`, `DICH_VU_LICH_TRINH` | `/community`, `/trips/:id`| `SocialTripCard` |
| **GET** | `/api/blogs` | Community | Public | CONFIRMED | `BAI_VIET`, `THICH_BAI_VIET` | `/community/blogs` | `BlogFeedGrid` |
| **GET** | `/api/blogs/{id}` | Community | Public | CONFIRMED | `BAI_VIET`, `ANH_BAI_VIET` | `/community/blogs/:id` | `BlogContentReader` |
| **POST** | `/api/blogs` | Community | `TRAVELER` | CONFIRMED | `BAI_VIET`, `ANH_BAI_VIET` | `/community/blogs/create`| `RichTextBlogEditor`|
| **GET** | `/api/blogs/{id}/comments` | Community | Public | AGGREGATION| `BINH_LUAN_BAI_VIET` | `/community/blogs/:id` | `CommentSection` |
| **POST** | `/api/blogs/{id}/comments` | Community | `TRAVELER` | CONFIRMED | `BINH_LUAN_BAI_VIET` | `/community/blogs/:id` | `CommentSection` |
| **GET** | `/api/community/top-bloggers`| Community | Public | AGGREGATION| `THEO_DOI_NGUOI_DUNG`, `NGUOI_DUNG` | `/community/blogs` | `TopBloggersSidebar` |
| **POST** | `/api/users/{id}/follow` | Community | Auth | CONFIRMED | `THEO_DOI_NGUOI_DUNG` | `/community/blogs` | `TopBloggersSidebar` |
| **POST** | `/api/ai/generate` | AI Assistant| `PREMIUM` | AGGREGATION| `LICH_SU_AI` | `/ai/planner` | `AIPromptWizard`, `AIGenerationResults`|
| **POST** | `/api/ai/chat` | AI Assistant| `PREMIUM` | AGGREGATION| `LICH_SU_AI` | `/ai/chat` | `ChatConversationBox` |
| **POST** | `/api/ai/optimize-route` | AI Assistant| `PREMIUM` | AGGREGATION| `LICH_SU_AI` | `/trips/:id/planner` | `AIRouteOptimizerWidget` |
| **POST** | `/api/ai/analyze-budget` | AI Assistant| `PREMIUM` | AGGREGATION| `LICH_SU_AI` | `/trips/:id/planner` | `AIBudgetAdvisorWidget` |
| **POST** | `/api/provider/register` | Provider | `TRAVELER` | CONFIRMED | `NHA_CUNG_CAP` | `/provider/registration` | `BusinessRegistrationForm`|
| **POST** | `/api/provider/upload-docs`| Provider | `TRAVELER` | NEW | `NHA_CUNG_CAP` | `/provider/registration` | `BusinessRegistrationForm`|
| **GET** | `/api/provider/status` | Provider | `PENDING` | CONFIRMED | `NHA_CUNG_CAP` | `/provider/pending`| `PendingStatusView` |
| **GET** | `/api/provider/stats` | Provider | `APPROVED` | AGGREGATION| `DICH_VU`, `DANH_GIA` | `/provider/dashboard`| `ProviderKPIWidget` |
| **GET** | `/api/provider/services` | Provider | `APPROVED` | CONFIRMED | `DICH_VU`, `ANH_DICH_VU` | `/provider/services` | `ServicesDataTable` |
| **POST** | `/api/provider/services` | Provider | `APPROVED` | CONFIRMED | `DICH_VU`, `ANH_DICH_VU` | `/provider/services/create`| `ServiceEditorForm` |
| **PUT** | `/api/provider/services/{id}`| Provider | `APPROVED` | CONFIRMED | `DICH_VU`, `ANH_DICH_VU` | `/provider/services/:id/edit`| `ServiceEditorForm` |
| **GET** | `/api/provider/reviews` | Provider | `APPROVED` | AGGREGATION| `DANH_GIA`, `PHAN_HOI_DANH_GIA` | `/provider/reviews` | `ReviewInbox` |
| **POST** | `/api/provider/reviews/{id}/reply`| Provider| `APPROVED` | CONFIRMED | `PHAN_HOI_DANH_GIA` | `/provider/reviews` | `ReviewInbox` |
| **GET** | `/api/packages/provider` | Provider | `APPROVED` | CONFIRMED | `GOI_DICH_VU_NCC` | `/provider/packages` | `PackagePricingTable` |
| **POST** | `/api/provider/packages/subscribe-simulated`| Provider | `APPROVED`| NEW | `GOI_DICH_VU_NCC`, `THANH_TOAN_NCC`, `DANG_KY_GOI_NCC` | `/provider/packages` | `SimulatedCheckoutForm` |
