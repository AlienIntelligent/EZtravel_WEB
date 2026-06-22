# Playwright E2E Testing Checklist

This document outlines the End-to-End (E2E) testing scenarios that must be implemented using Playwright to ensure the stability of the ezTravel frontend application.

## 1. Authentication Flows (`/auth/*`)
- `[ ]` **Login**: Successfully log in with valid credentials (redirects to `/dashboard`).
- `[ ]` **Login Error**: Display proper error messages for invalid credentials.
- `[ ]` **Registration**: Successfully register a new user and trigger OTP flow.
- `[ ]` **OTP Verification**: Verify a correct OTP code and redirect to dashboard.
- `[ ]` **OTP Resend**: Successfully request a new OTP code.
- `[ ]` **Forgot Password**: Send password reset email for an existing account.
- `[ ]` **Reset Password**: Update password successfully via reset token.
- `[ ]` **Public Guard**: Authenticated users navigating to `/auth/login` are redirected to `/dashboard`.

## 2. Public Exploration (`/explore`, `/`)
- `[ ]` **Home Page Rendering**: Verify rendering of trending destinations and public trips.
- `[ ]` **Explore Search & Filter**: Search destinations by keyword and filter by category/region tags.
- `[ ]` **Destination Details**: Navigate to `/explore/destinations/:id` and load location images/description.
- `[ ]` **Service Discovery**: Load nearby services (`/explore/destinations/:id/services`).
- `[ ]` **Service Detail**: Navigate to `/explore/services/:id` and display service information and images.
- `[ ]` **Public Review Viewing**: Load and paginate reviews on a service page.

## 3. Community & Blogs (`/community/*`)
- `[ ]` **Community Feed**: Render infinite scroll feed of public trips.
- `[ ]` **Trip Liking**: Authenticated user likes a trip; like count increments.
- `[ ]` **Trip Cloning**: Authenticated user clones a trip to their own dashboard.
- `[ ]` **Blog Feed**: Render travel blogs and top bloggers sidebar.
- `[ ]` **Blog Detail**: Navigate to `/community/blogs/:id` and read blog content.
- `[ ]` **Blog Creation**: Authenticated user successfully submits a new travel blog.
- `[ ]` **Blog Comments**: Authenticated user posts a comment on a blog.
- `[ ]` **User Follow**: Authenticated user follows another user from the community sidebar.

## 4. Traveler Dashboard & Profile (`/dashboard`, `/profile`)
- `[ ]` **Dashboard Load**: Authenticated user views their upcoming trips and basic stats.
- `[ ]` **Profile Update**: Update personal information and save successfully.
- `[ ]` **Password Update**: Change password from profile settings.
- `[ ]` **Avatar Upload**: Upload and replace profile avatar.
- `[ ]` **Notifications**: View notification list and mark a notification as read.
- `[ ]` **Auth Guard**: Unauthenticated user attempting to access `/dashboard` is redirected to `/auth/login`.

## 5. Trip Management (`/trips/*`)
- `[ ]` **Trip List**: Display the user's created and collaborated trips.
- `[ ]` **Trip Creation**: Create a new trip with name and date range.
- `[ ]` **Trip Deletion**: Successfully delete an owned trip.
- `[ ]` **Trip Overview**: View read-only summary at `/trips/:id`.
- `[ ]` **Trip Timeline Editing**: Add, move, and remove destinations/services in the timeline (`/trips/:id/planner`).
- `[ ]` **Collaborator Management**: Add and remove a collaborator via email/username.
- `[ ]` **Permission Guard (Edit)**: Collaborators can edit timeline but cannot delete the trip.
- `[ ]` **Permission Guard (View)**: Unauthorized users accessing a private trip are redirected or shown a 403 error.

## 6. Premium & AI Features (`/ai/*`, `/upgrade`)
- `[ ]` **Upgrade Flow**: Non-premium user is prompted to upgrade at `/upgrade`.
- `[ ]` **AI Trip Generation**: Premium user inputs preferences and generates a complete trip timeline.
- `[ ]` **AI Chatbot**: Premium user opens chat drawer, sends a message, and receives a response.
- `[ ]` **AI Route Optimization**: Premium user clicks optimize inside the planner and timeline updates efficiently.
- `[ ]` **AI Budget Advisor**: Premium user views dynamic budget estimations based on selected services.
- `[ ]` **Premium Guard**: Standard user attempting to access `/ai/planner` is redirected to `/upgrade`.

## 7. Provider Platform (`/provider/*`)
- `[ ]` **Provider Registration**: Traveler submits business details to register as a provider.
- `[ ]` **Pending Status**: Registered provider sees pending status at `/provider/pending` and is blocked from dashboard.
- `[ ]` **Provider Dashboard**: Approved provider views KPI widgets and charts.
- `[ ]` **Service Creation**: Approved provider successfully creates a new service listing with images.
- `[ ]` **Service Editing**: Provider updates pricing or details of an existing service.
- `[ ]` **Review Management**: Provider views incoming reviews and posts a reply.
- `[ ]` **Package Subscription**: Provider successfully checks out a simulated promotion package.
- `[ ]` **Provider Guard**: Non-providers are redirected to `/provider/registration`.

## 8. Admin Administration (`/admin/*`)
- `[ ]` **Admin Dashboard**: Render system-wide analytics and pending alerts.
- `[ ]` **User Management**: Admin searches for a user and updates their role (e.g., Traveler to Provider Approved).
- `[ ]` **User Status**: Admin disables/bans a user account.
- `[ ]` **Content Moderation**: Admin resolves a reported blog/review (approve or delete).
- `[ ]` **Category Management**: Admin creates a new destination category/tag and deletes an old one.
- `[ ]` **Admin Guard**: Non-admin user attempting to access `/admin/dashboard` is strictly blocked and redirected.
