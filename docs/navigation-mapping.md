# Unified Navigation Mapping Document

This document maps all application shell navigation items to their corresponding CRD sections, SRS requirements, routes, and React page components.

---

## 1. Traveler Menu

### 1.1 Dashboard
- **CRD Reference**: Section 3.2 – Traveler Dashboard
- **SRS Reference**: US-7.6 – Traveler Dashboard UI
- **Route**: `/dashboard` (`AUTH_ROUTES.DASHBOARD`)
- **Page Component**: `TravelerDashboard` ([TravelerDashboard.jsx](file:///d:/eztravel/WebClient/src/modules/dashboard/TravelerDashboard.jsx))
- **Status**: `"active"`

### 1.2 Explore
- **CRD Reference**: Section 3.1 – Explore Vietnam Destinations
- **SRS Reference**: US-3.1 – Destinations Workspace
- **Route**: `/explore` (`PUBLIC_ROUTES.EXPLORE`)
- **Page Component**: `ExploreWorkspace` ([ExploreWorkspace.jsx](file:///d:/eztravel/WebClient/src/modules/explore/ExploreWorkspace.jsx))
- **Status**: `"active"`

### 1.3 My Trips
- **CRD Reference**: Section 3.3 – Trips Planning
- **SRS Reference**: US-4.1 – Trip Plan Builder
- **Route**: `/trips` (`AUTH_ROUTES.TRIPS`)
- **Page Component**: `TripsList` ([TripsList.jsx](file:///d:/eztravel/WebClient/src/modules/trip/TripsList.jsx))
- **Status**: `"active"`

### 1.4 AI Planner
- **CRD Reference**: Section 3.4 – AI Trip Planner
- **SRS Reference**: US-12.2 – AI Planner Workspace
- **Route**: `/ai/planner` (`PREMIUM_ROUTES.AI_PLANNER`)
- **Page Component**: `AIPlanner` ([Planner.jsx](file:///d:/eztravel/WebClient/src/modules/ai/Planner.jsx))
- **Status**: `"active"`

### 1.5 Community
- **CRD Reference**: Section 3.5 – Community & Travel Experience
- **SRS Reference**: US-6.1 – Community Feed & Blogs
- **Route**: `/community` (`PUBLIC_ROUTES.COMMUNITY`)
- **Page Component**: `CommunityWorkspace` ([CommunityWorkspace.jsx](file:///d:/eztravel/WebClient/src/modules/community/CommunityWorkspace.jsx))
- **Status**: `"active"`

### 1.6 Notifications
- **CRD Reference**: Section 3.6 – Notifications Center
- **SRS Reference**: US-7.1 – Notifications Strategy & Pull
- **Route**: `/notifications` (`AUTH_ROUTES.NOTIFICATIONS`)
- **Page Component**: `Notifications` ([Notifications.jsx](file:///d:/eztravel/WebClient/src/modules/notifications/Notifications.jsx))
- **Status**: `"active"`

### 1.7 Profile
- **CRD Reference**: Section 3.7 – User Profile
- **SRS Reference**: US-7.4 – Profile Personalization
- **Route**: `/profile` (`AUTH_ROUTES.PROFILE`)
- **Page Component**: `Profile` ([Profile.jsx](file:///d:/eztravel/WebClient/src/modules/profile/Profile.jsx))
- **Status**: `"active"`

---

## 2. Provider Menu

### 2.1 Dashboard
- **CRD Reference**: Section 4.1 – Provider Workspace Dashboard
- **SRS Reference**: US-5.1 – Provider Dashboard Details
- **Route**: `/provider/dashboard` (`PROVIDER_APPROVED_ROUTES.DASHBOARD`)
- **Page Component**: `ProviderDashboard` ([Dashboard.jsx](file:///d:/eztravel/WebClient/src/modules/provider/Dashboard.jsx))
- **Status**: `"active"`

### 2.2 Services
- **CRD Reference**: Section 4.2 – Service Manager
- **SRS Reference**: US-5.2 – CRUD Services
- **Route**: `/provider/services` (`PROVIDER_APPROVED_ROUTES.SERVICES`)
- **Page Component**: `ServicesManager` ([ServicesManager.jsx](file:///d:/eztravel/WebClient/src/modules/provider/ServicesManager.jsx))
- **Status**: `"active"`

### 2.3 Bookings
- **CRD Reference**: Section 4.3 – Provider Bookings Management
- **SRS Reference**: US-5.3 – Bookings Pipeline
- **Route**: `/provider/bookings`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

### 2.4 Pricing
- **CRD Reference**: Section 4.4 – Package Subscriptions
- **SRS Reference**: US-5.4 – Promotion Packages
- **Route**: `/provider/packages` (`PROVIDER_APPROVED_ROUTES.PACKAGES`)
- **Page Component**: `ProviderPackages` ([Packages.jsx](file:///d:/eztravel/WebClient/src/modules/provider/Packages.jsx))
- **Status**: `"active"`

### 2.5 Reviews
- **CRD Reference**: Section 4.5 – Reviews Manager
- **SRS Reference**: US-5.5 – Customer Reviews & Replies
- **Route**: `/provider/reviews` (`PROVIDER_APPROVED_ROUTES.REVIEWS`)
- **Page Component**: `ReviewsManager` ([ReviewsManager.jsx](file:///d:/eztravel/WebClient/src/modules/provider/ReviewsManager.jsx))
- **Status**: `"active"`

### 2.6 Analytics
- **CRD Reference**: Section 4.6 – Analytics Overview
- **SRS Reference**: US-5.6 – Performance Charts
- **Route**: `/provider/analytics`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

### 2.7 Finance
- **CRD Reference**: Section 4.7 – Financial Accounting
- **SRS Reference**: US-5.7 – Payouts & Invoices
- **Route**: `/provider/finance`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

### 2.8 Settings
- **CRD Reference**: Section 4.8 – Provider Settings & Profile
- **SRS Reference**: US-5.8 – Business Info Profile
- **Route**: `/provider/settings`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

---

## 3. Admin Menu

### 3.1 Dashboard
- **CRD Reference**: Section 5.1 – Administration Core Dashboard
- **SRS Reference**: US-2.1 – System KPIs overview
- **Route**: `/admin/dashboard` (`ADMIN_ROUTES.DASHBOARD`)
- **Page Component**: `AdminDashboard` ([Dashboard.jsx](file:///d:/eztravel/WebClient/src/modules/admin/Dashboard.jsx))
- **Status**: `"active"`

### 3.2 Users
- **CRD Reference**: Section 5.2 – User Accounts & Permissions
- **SRS Reference**: US-2.2 – User Lock/Unlock & Roles
- **Route**: `/admin/users` (`ADMIN_ROUTES.USERS`)
- **Page Component**: `UserManager` ([UserManager.jsx](file:///d:/eztravel/WebClient/src/modules/admin/UserManager.jsx))
- **Status**: `"active"`

### 3.3 Providers
- **CRD Reference**: Section 5.3 – Provider Verification & Approvals
- **SRS Reference**: US-2.3 – Audit Provider Docs
- **Route**: `/admin/providers`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

### 3.4 Services
- **CRD Reference**: Section 5.4 – Services Audit
- **SRS Reference**: US-2.4 – Moderating Listings
- **Route**: `/admin/services`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

### 3.5 Categories
- **CRD Reference**: Section 5.5 – Categories Taxonomy
- **SRS Reference**: US-2.5 – Global Taxonomy Editor
- **Route**: `/admin/categories` (`ADMIN_ROUTES.CATEGORIES`)
- **Page Component**: `AdminCategories` ([AdminCategories.jsx](file:///d:/eztravel/WebClient/src/modules/admin/AdminCategories.jsx))
- **Status**: `"active"`

### 3.6 Locations
- **CRD Reference**: Section 5.6 – Destinations Manager
- **SRS Reference**: US-2.6 – Geographic Places Database
- **Route**: `/admin/locations`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

### 3.7 Community
- **CRD Reference**: Section 5.7 – Forum Moderation
- **SRS Reference**: US-2.7 – Moderating Posts & Comments
- **Route**: `/admin/community`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

### 3.8 Reports
- **CRD Reference**: Section 5.8 – Violations & Reports Management
- **SRS Reference**: US-2.8 – Handling Flagged Items
- **Route**: `/admin/reports`
- **Page Component**: *None*
- **Status**: `"coming-soon"`

### 3.9 System
- **CRD Reference**: Section 5.9 – Global System Settings
- **SRS Reference**: US-2.9 – Packages & Configurations
- **Route**: `/admin/system`
- **Page Component**: *None*
- **Status**: `"coming-soon"`
