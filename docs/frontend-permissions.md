# Frontend Permissions Architecture

This document serves as the authorization source of truth for the ezTravel frontend application. It defines access control policies for pages, features, endpoints, navigation, and specific components.

---

## ACTORS

The system recognizes the following distinct user roles:

1. **Guest**: Unauthenticated user.
2. **Traveler**: Authenticated base user.
3. **Premium Traveler**: Authenticated user with an active premium subscription.
4. **Provider Pending**: Authenticated user who has submitted a provider registration that is awaiting admin approval.
5. **Provider Approved**: Authenticated provider with access to business features.
6. **Admin**: System administrator with full access to all data and configurations.

**Role Hierarchy:**
Guest
Traveler
├─ Premium Traveler
├─ Provider Pending
└─ Provider Approved

Admin (supersedes all permissions)

**Inheritance Rule:** Premium Traveler, Provider Pending, and Provider Approved inherit all Traveler permissions implicitly unless explicitly overridden. Admin supersedes all permissions.

---

## SECTION 1: Page Access Matrix

| Page | Guest | Traveler | Premium | Provider Pending | Provider Approved | Admin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` (Home) | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/auth/*` | ALLOW | REDIRECT | REDIRECT | REDIRECT | REDIRECT | REDIRECT |
| `/explore/*` | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/community/*` | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/dashboard` | REDIRECT | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/trips` | REDIRECT | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/trips/create` | REDIRECT | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/trips/:id` | REDIRECT | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/trips/:id/planner` | REDIRECT | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/profile/*` | REDIRECT | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/notifications` | REDIRECT | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| `/upgrade` | REDIRECT | ALLOW | REDIRECT | ALLOW | ALLOW | ALLOW |
| `/ai/planner` | REDIRECT | REDIRECT | ALLOW | REDIRECT | REDIRECT | ALLOW |
| `/ai/chat` | REDIRECT | REDIRECT | ALLOW | REDIRECT | REDIRECT | ALLOW |
| `/provider/registration` | REDIRECT | ALLOW | ALLOW | REDIRECT | REDIRECT | REDIRECT |
| `/provider/pending` | REDIRECT | REDIRECT | REDIRECT | ALLOW | REDIRECT | REDIRECT |
| `/provider/dashboard` | REDIRECT | REDIRECT | REDIRECT | REDIRECT | ALLOW | ALLOW |
| `/provider/services/*` | REDIRECT | REDIRECT | REDIRECT | REDIRECT | ALLOW | ALLOW |
| `/provider/reviews` | REDIRECT | REDIRECT | REDIRECT | REDIRECT | ALLOW | ALLOW |
| `/provider/packages` | REDIRECT | REDIRECT | REDIRECT | REDIRECT | ALLOW | ALLOW |
| `/admin/*` | DENY | DENY | DENY | DENY | DENY | ALLOW |

*(Note: "REDIRECT" means the user is automatically navigated to their appropriate fallback or dashboard route).*

---

## SECTION 2: Feature Access Matrix

| Feature | Guest | Traveler | Premium | Provider Pending | Provider Approved | Admin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Notifications** | DENY | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Trip Creation** | DENY | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Trip Editing** | DENY | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Trip Sharing** | DENY | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Trip Cloning** | DENY | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Blog Creation** | DENY | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Blog Commenting** | DENY | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Provider Registration**| DENY | ALLOW | ALLOW | DENY | DENY | DENY |
| **Service Management** | DENY | DENY | DENY | DENY | ALLOW | ALLOW |
| **AI Trip Generation** | DENY | DENY | ALLOW | DENY | DENY | ALLOW |
| **AI Chat** | DENY | DENY | ALLOW | DENY | DENY | ALLOW |
| **AI Route Optimization**| DENY | DENY | ALLOW | DENY | DENY | ALLOW |
| **AI Budget Advisor** | DENY | DENY | ALLOW | DENY | DENY | ALLOW |
| **Moderation** | DENY | DENY | DENY | DENY | DENY | ALLOW |
| **Category Management** | DENY | DENY | DENY | DENY | DENY | ALLOW |

---

## SECTION 3: Endpoint Permission Matrix

| Method | Route | Required Role |
| :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Public |
| **POST** | `/api/auth/register` | Public |
| **POST** | `/api/auth/verify-otp` | Public |
| **POST** | `/api/auth/resend-otp` | Public |
| **POST** | `/api/auth/forgot-password`| Public |
| **POST** | `/api/auth/reset-password` | Public |
| **GET** | `/api/profile` | Traveler |
| **PUT** | `/api/profile` | Traveler |
| **PUT** | `/api/profile/password` | Traveler |
| **POST** | `/api/profile/avatar` | Traveler |
| **GET** | `/api/admin/users` | `ADMIN` |
| **PUT** | `/api/admin/users/{id}/status` | `ADMIN` |
| **PUT** | `/api/admin/users/{id}/role` | `ADMIN` |
| **GET** | `/api/admin/stats` | `ADMIN` |
| **GET** | `/api/admin/alerts` | `ADMIN` |
| **GET** | `/api/admin/moderation` | `ADMIN` |
| **POST** | `/api/admin/moderation/{id}/resolve`| `ADMIN` |
| **GET** | `/api/admin/categories` | `ADMIN` |
| **POST** | `/api/admin/categories` | `ADMIN` |
| **DELETE**| `/api/admin/categories/{id}`| `ADMIN` |
| **GET** | `/api/categories/regions` | Public |
| **GET** | `/api/categories/tags` | Public |
| **GET** | `/api/explore` | Public |
| **GET** | `/api/destinations/{id}` | Public |
| **GET** | `/api/destinations/{id}/services`| Public |
| **GET** | `/api/services/{id}` | Public |
| **GET** | `/api/services/{id}/reviews`| Public |
| **POST** | `/api/services/{id}/reviews`| `TRAVELER` |
| **GET** | `/api/trips` | `TRAVELER` |
| **POST** | `/api/trips` | `TRAVELER` |
| **DELETE**| `/api/trips/{id}` | `TRAVELER` |
| **GET** | `/api/trips/{id}` | Traveler/Public |
| **GET** | `/api/trips/{id}/timeline` | Traveler/Public |
| **PUT** | `/api/trips/{id}/timeline` | `TRAVELER` |
| **GET** | `/api/trips/{id}/collaborators`| `TRAVELER` |
| **POST** | `/api/trips/{id}/collaborators`| `TRAVELER` |
| **GET** | `/api/public/home/trending-destinations`| Public |
| **GET** | `/api/public/home/trending-trips` | Public |
| **GET** | `/api/traveler/dashboard/stats` | `TRAVELER` |
| **GET** | `/api/trips/upcoming` | `TRAVELER` |
| **GET** | `/api/notifications` | Traveler |
| **PUT** | `/api/notifications/{id}/read`| Traveler |
| **GET** | `/api/community/feed` | Public |
| **POST** | `/api/trips/{id}/like` | `TRAVELER` |
| **POST** | `/api/trips/{id}/clone` | `TRAVELER` |
| **GET** | `/api/blogs` | Public |
| **GET** | `/api/blogs/{id}` | Public |
| **POST** | `/api/blogs` | `TRAVELER` |
| **GET** | `/api/blogs/{id}/comments` | Public |
| **POST** | `/api/blogs/{id}/comments` | `TRAVELER` |
| **GET** | `/api/community/top-bloggers`| Public |
| **POST** | `/api/users/{id}/follow` | Traveler |
| **POST** | `/api/ai/generate` | Premium Traveler |
| **POST** | `/api/ai/chat` | Premium Traveler |
| **POST** | `/api/ai/optimize-route` | Premium Traveler |
| **POST** | `/api/ai/analyze-budget` | Premium Traveler |
| **POST** | `/api/provider/register` | `TRAVELER` |
| **POST** | `/api/provider/upload-docs`| `TRAVELER` |
| **GET** | `/api/provider/status` | Provider Pending |
| **GET** | `/api/provider/stats` | Provider Approved |
| **GET** | `/api/provider/services` | Provider Approved |
| **POST** | `/api/provider/services` | Provider Approved |
| **PUT** | `/api/provider/services/{id}`| Provider Approved |
| **GET** | `/api/provider/reviews` | Provider Approved |
| **POST** | `/api/provider/reviews/{id}/reply`| Provider Approved |
| **GET** | `/api/packages/provider` | Provider Approved |
| **POST** | `/api/provider/packages/subscribe-simulated`| Provider Approved |


---

## SECTION 4: Navigation Matrix

### Guest
* **Visible Header Items**: Khám phá, Cộng đồng, Blog
* **Visible Sidebar Items**: N/A
* **Visible Dashboard Widgets**: N/A

### Traveler
* **Visible Header Items**: Khám phá, Cộng đồng, Blog, Notifications, Profile Dropdown
* **Visible Sidebar Items**: Dashboard, Lịch trình của tôi, Nâng cấp Premium
* **Visible Dashboard Widgets**: System Analytics (Basic), Recent Trips, Upcoming Schedule Widget

### Premium Traveler
* **Visible Header Items**: Khám phá, Cộng đồng, Blog, Notifications, Profile Dropdown
* **Visible Sidebar Items**: Dashboard, Lịch trình của tôi, AI Lên Lịch Trình, AI Chatbot
* **Visible Dashboard Widgets**: System Analytics (Basic), Recent Trips, Upcoming Schedule Widget

### Provider Pending
* **Visible Header Items**: Khám phá, Cộng đồng, Blog, Notifications, Profile Dropdown
* **Visible Sidebar Items**: Trang thái Đăng ký (Pending)
* **Visible Dashboard Widgets**: Pending Status View

### Provider Approved
* **Visible Header Items**: Switch to Traveler View, Notifications, Provider Profile
* **Visible Sidebar Items**: Provider Dashboard, Quản lý Dịch vụ, Đánh giá & Phản hồi, Gói Quảng Bá
* **Visible Dashboard Widgets**: Provider KPI Widget, Recent Reviews

### Admin
* **Visible Header Items**: Return to Site, Notifications, Admin Profile
* **Visible Sidebar Items**: Admin Dashboard, Quản lý Người dùng, Kiểm duyệt Nội dung, Quản lý Danh mục
* **Visible Dashboard Widgets**: System Analytics Grid, Pending Action Alerts

---

## SECTION 5: Frontend Route Guards

| Guard | Definition | Required Redirect |
| :--- | :--- | :--- |
| **PublicGuard** | Accessible only to guests (unauthenticated). | Authenticated -> `/dashboard` |
| **AuthGuard** | Accessible to any authenticated user. | Guest -> `/auth/login` |
| **PremiumGuard** | Accessible to Premium Travelers and Admins. | Auth (Non-Premium) -> `/upgrade` |
| **ProviderPendingGuard** | Accessible to Travelers with pending business profiles. | Approved -> `/provider/dashboard` |
| **ProviderGuard** | Accessible to Approved Providers. | Pending -> `/provider/pending`<br/>None -> `/provider/registration` |
| **AdminGuard** | Accessible only to Admins. | Unauthorized -> `/dashboard` |

---

## SECTION 6: Component Permission Matrix

### Trip Component (Lịch trình)
| Role | View | Edit | Delete | Share | Clone |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Owner** | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Collaborator** | ALLOW | ALLOW | DENY | ALLOW | ALLOW |
| **Authenticated User** | ALLOW (If Public) | DENY | DENY | DENY | ALLOW (If Public) |
| **Guest** | ALLOW (If Public) | DENY | DENY | DENY | DENY |

### General Components
| Component | View | Create | Edit | Delete | Approve | Moderate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Blog Post** | Guest, Traveler | Traveler | Owner | Owner | N/A | Admin |
| **Service (Dịch vụ)** | Guest, Traveler | Provider | Provider | Provider | N/A | Admin |
| **Review (Đánh giá)** | Guest, Traveler | Traveler | Owner | Owner | N/A | Admin |
| **Provider Profile** | Provider | Auth (Register) | Provider | Admin | Admin | Admin |
| **Category/Tag** | Guest, Traveler | Admin | Admin | Admin | N/A | Admin |

*(Note: "Owner" implies the user who created the resource).*

---

## SECTION 7: Permission Constants

Recommended implementation for React/TypeScript frontend incorporating the inheritance hierarchy.

```typescript
// roles.ts
export enum Roles {
  GUEST = 'GUEST',
  TRAVELER = 'TRAVELER',
  PREMIUM_TRAVELER = 'PREMIUM_TRAVELER',
  PROVIDER_PENDING = 'PROVIDER_PENDING',
  PROVIDER_APPROVED = 'PROVIDER_APPROVED',
  ADMIN = 'ADMIN'
}

// Inheritance helper
export const getInheritedRoles = (role: Roles): Roles[] => {
  if (role === Roles.ADMIN) {
    return Object.values(Roles); // Admin has all roles
  }
  
  const travelerInheritors = [
    Roles.TRAVELER, 
    Roles.PREMIUM_TRAVELER, 
    Roles.PROVIDER_PENDING, 
    Roles.PROVIDER_APPROVED
  ];
  
  if (travelerInheritors.includes(role)) {
    return [role, Roles.TRAVELER, Roles.GUEST];
  }
  
  return [role, Roles.GUEST]; // Fallback for Guest
};

// permissions.ts
export enum Permissions {
  CREATE_TRIP = 'CREATE_TRIP',
  EDIT_TRIP = 'EDIT_TRIP',
  CLONE_TRIP = 'CLONE_TRIP',
  CREATE_BLOG = 'CREATE_BLOG',
  USE_AI_PLANNER = 'USE_AI_PLANNER',
  USE_AI_CHAT = 'USE_AI_CHAT',
  REGISTER_PROVIDER = 'REGISTER_PROVIDER',
  MANAGE_SERVICES = 'MANAGE_SERVICES',
  MANAGE_REVIEWS = 'MANAGE_REVIEWS',
  VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
  MANAGE_USERS = 'MANAGE_USERS',
  MODERATE_CONTENT = 'MODERATE_CONTENT',
  MANAGE_CATEGORIES = 'MANAGE_CATEGORIES'
}

// policies.ts - Evaluates against inherited roles
export const Policies = {
  CAN_CREATE_TRIP: [Roles.TRAVELER], // Implicitly allows Premium, Provider, Admin via inheritance
  CAN_USE_AI: [Roles.PREMIUM_TRAVELER, Roles.ADMIN],
  CAN_MANAGE_PROVIDER: [Roles.PROVIDER_APPROVED, Roles.ADMIN],
  CAN_ACCESS_ADMIN: [Roles.ADMIN]
};
```
