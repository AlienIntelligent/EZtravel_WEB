/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { FloatingAssistant } from '../components/system/FloatingAssistant';



import { PublicGuard } from './guards/PublicGuard';
import { GuestGuard } from './guards/GuestGuard';
import { AuthenticatedGuard } from './guards/AuthenticatedGuard';
import { PremiumGuard } from './guards/PremiumGuard';
import { ProviderPendingGuard } from './guards/ProviderPendingGuard';
import { ProviderGuard } from './guards/ProviderGuard';
import { AdminGuard } from './guards/AdminGuard';

import ConsumerLayout from '../layouts/ConsumerLayout';
import PlannerLayout from '../layouts/PlannerLayout';
import ProviderLayout from '../layouts/ProviderLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthLayout from '../layouts/AuthLayout';

import {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  PREMIUM_ROUTES,
  PROVIDER_PENDING_ROUTES,
  PROVIDER_APPROVED_ROUTES,
  ADMIN_ROUTES,
} from './routes';

// Lazy load pages
// Auth
const Login = lazy(() => import('../pages/auth/LoginPage'));
const Register = lazy(() => import('../pages/auth/RegisterPage'));
const OtpVerification = lazy(() => import('../pages/auth/OtpVerificationPage'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPasswordPage'));

// Home / Explore
const Home = lazy(() => import('../modules/home/Home'));
const Explore = lazy(() => import('../modules/explore/ExploreWorkspace'));
const DestinationDetails = lazy(() => import('../modules/explore/DestinationDetails'));
const ServiceDetails = lazy(() => import('../modules/explore/ServiceDetails'));

// Support
const AboutPage = lazy(() => import('../modules/support/AboutPage'));
const TermsPage = lazy(() => import('../modules/support/TermsPage'));
const PrivacyPage = lazy(() => import('../modules/support/PrivacyPage'));

// Community
const CommunityFeed = lazy(() => import('../modules/community/CommunityWorkspace'));
const BlogFeed = lazy(() => import('../modules/community/BlogFeed'));
const BlogDetails = lazy(() => import('../modules/community/BlogDetails'));
const BlogCreate = lazy(() => import('../modules/community/BlogCreate'));

// Trips
const TripsList = lazy(() => import('../modules/trip/TripsList'));
const TripCreate = lazy(() => import('../modules/trip/TripCreate'));
const TripDetails = lazy(() => import('../modules/trip/TripDetails'));
const TripPlanner = lazy(() => import('../modules/trip/TripPlannerWorkspace'));

// User
const Profile = lazy(() => import('../modules/profile/Profile'));
const Notifications = lazy(() => import('../modules/notifications/Notifications'));
const TravelerDashboard = lazy(() => import('../modules/dashboard/TravelerDashboard'));
const Upgrade = lazy(() => import('../modules/upgrade/Upgrade'));

// AI
const AIPlanner = lazy(() => import('../modules/ai/Planner'));
const AIChat = lazy(() => import('../modules/ai/Assistant'));

// Provider
const ProviderRegistration = lazy(() => import('../modules/provider/ProviderRegistration'));
const ProviderPending = lazy(() => import('../modules/provider/ProviderPending'));
const ProviderDashboard = lazy(() => import('../modules/provider/Dashboard'));
const ProviderServices = lazy(() => import('../modules/provider/ServicesManager'));
const ProviderServiceCreate = lazy(() => import('../modules/provider/ProviderServiceCreate'));
const ProviderServiceEdit = lazy(() => import('../modules/provider/ProviderServiceEdit'));
const ProviderReviews = lazy(() => import('../modules/provider/ReviewsManager'));
const ProviderPackages = lazy(() => import('../modules/provider/Packages'));
const ProviderCurrentPackage = lazy(() => import('../modules/provider/CurrentPackage'));
const ProviderPackageHistory = lazy(() => import('../modules/provider/PackageHistory'));
const ProviderPaymentHistory = lazy(() => import('../modules/provider/PaymentHistory'));
const ProviderBookings = lazy(() => import('../modules/provider/Bookings'));
const ProviderAnalytics = lazy(() => import('../modules/provider/Analytics'));
const ProviderFinance = lazy(() => import('../modules/provider/Finance'));
const ProviderSettings = lazy(() => import('../modules/provider/Settings'));

// Admin
const AdminDashboard = lazy(() => import('../modules/admin/Dashboard'));
const AdminUsers = lazy(() => import('../modules/admin/UserManager'));
const AdminModeration = lazy(() => import('../modules/admin/ServiceModeration'));
const AdminCategories = lazy(() => import('../modules/admin/AdminCategories'));
const AdminProviderPackages = lazy(() => import('../modules/admin/PackageManager'));
const AdminLocations = lazy(() => import('../modules/admin/PlacesManager'));
const AdminCommunity = lazy(() => import('../modules/admin/BlogModeration'));
const AdminReports = lazy(() => import('../modules/admin/Reports'));
const AdminSystem = lazy(() => import('../modules/admin/SystemSettings'));

const withSuspense = (Component) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

const DesignSystemPreview = lazy(() => import('../pages/preview/DesignSystemPreview'));

const RootLayout = () => { return (<><Outlet /><FloatingAssistant /></>); };

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
  {
    element: <PublicGuard />,
    children: [
      {
        // Guest routes — use ConsumerLayout (travel website header, no sidebar)
        element: <ConsumerLayout />,
        children: [
          { path: PUBLIC_ROUTES.HOME, element: withSuspense(Home) },
          { path: PUBLIC_ROUTES.EXPLORE, element: withSuspense(Explore) },
          { path: PUBLIC_ROUTES.DESTINATION_DETAILS, element: withSuspense(DestinationDetails) },
          { path: PUBLIC_ROUTES.SERVICE_DETAILS, element: withSuspense(ServiceDetails) },
          { path: PUBLIC_ROUTES.COMMUNITY, element: withSuspense(CommunityFeed) },
          { path: PUBLIC_ROUTES.BLOGS, element: withSuspense(BlogFeed) },
          { path: PUBLIC_ROUTES.BLOG_DETAILS, element: withSuspense(BlogDetails) },
          { path: PUBLIC_ROUTES.ABOUT, element: withSuspense(AboutPage) },
          { path: PUBLIC_ROUTES.TERMS, element: withSuspense(TermsPage) },
          { path: PUBLIC_ROUTES.PRIVACY, element: withSuspense(PrivacyPage) },
        ],
      },
      {
        element: <GuestGuard />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: PUBLIC_ROUTES.LOGIN, element: withSuspense(Login) },
              { path: PUBLIC_ROUTES.REGISTER, element: withSuspense(Register) },
              { path: PUBLIC_ROUTES.VERIFY_OTP, element: withSuspense(OtpVerification) },
              { path: PUBLIC_ROUTES.FORGOT_PASSWORD, element: withSuspense(ForgotPassword) },
              { path: PUBLIC_ROUTES.RESET_PASSWORD, element: withSuspense(ResetPassword) },
            ]
          }
        ]
      },
      { path: PUBLIC_ROUTES.DESIGN_PREVIEW, element: withSuspense(DesignSystemPreview) }
    ]
  },
  {
    element: <AuthenticatedGuard />,
    children: [
      {
        // Traveler routes — ConsumerLayout (same travel website shell as guest)
        element: <ConsumerLayout />,
        children: [
          { path: AUTH_ROUTES.DASHBOARD, element: withSuspense(TravelerDashboard) },
          { path: AUTH_ROUTES.TRIPS, element: withSuspense(TripsList) },
          { path: AUTH_ROUTES.TRIP_CREATE, element: withSuspense(TripCreate) },
          { path: AUTH_ROUTES.TRIP_DETAILS, element: withSuspense(TripDetails) },
          { path: AUTH_ROUTES.BLOG_CREATE, element: withSuspense(BlogCreate) },
          { path: AUTH_ROUTES.PROFILE, element: withSuspense(Profile) },
          { path: AUTH_ROUTES.NOTIFICATIONS, element: withSuspense(Notifications) },
          { path: AUTH_ROUTES.UPGRADE, element: withSuspense(Upgrade) },
          { path: AUTH_ROUTES.PROVIDER_REGISTRATION, element: withSuspense(ProviderRegistration) },
        ],
      },
      {
        // Trip Planner — PlannerLayout is standalone (fullscreen + ConsumerHeader built-in)
        element: <PlannerLayout />,
        children: [
          { path: AUTH_ROUTES.TRIP_PLANNER, element: withSuspense(TripPlanner) },
        ],
      },
      {
        element: <PremiumGuard />,
        children: [
          {
            // AI routes — ConsumerLayout
            element: <ConsumerLayout />,
            children: [
              { path: PREMIUM_ROUTES.AI_PLANNER, element: withSuspense(AIPlanner) },
              { path: PREMIUM_ROUTES.AI_CHAT, element: withSuspense(AIChat) },
            ],
          }
        ]
      },
      {
        element: <ProviderPendingGuard />,
        children: [
          {
            // Provider pending — use ConsumerLayout (no operational sidebar needed)
            element: <ConsumerLayout />,
            children: [
              { path: PROVIDER_PENDING_ROUTES.PENDING, element: withSuspense(ProviderPending) },
            ],
          },
        ],
      },
      {
        element: <ProviderGuard />,
        children: [
          {
            element: <ProviderLayout />,
            children: [
              { path: PROVIDER_APPROVED_ROUTES.DASHBOARD, element: withSuspense(ProviderDashboard) },
              { path: PROVIDER_APPROVED_ROUTES.SERVICES, element: withSuspense(ProviderServices) },
              { path: PROVIDER_APPROVED_ROUTES.SERVICE_CREATE, element: withSuspense(ProviderServiceCreate) },
              { path: PROVIDER_APPROVED_ROUTES.SERVICE_EDIT, element: withSuspense(ProviderServiceEdit) },
              { path: PROVIDER_APPROVED_ROUTES.REVIEWS, element: withSuspense(ProviderReviews) },
              { path: PROVIDER_APPROVED_ROUTES.PACKAGES, element: withSuspense(ProviderPackages) },
              { path: PROVIDER_APPROVED_ROUTES.CURRENT_PACKAGE, element: withSuspense(ProviderCurrentPackage) },
              { path: PROVIDER_APPROVED_ROUTES.PACKAGE_HISTORY, element: withSuspense(ProviderPackageHistory) },
              { path: PROVIDER_APPROVED_ROUTES.PAYMENT_HISTORY, element: withSuspense(ProviderPaymentHistory) },
              { path: PROVIDER_APPROVED_ROUTES.BOOKINGS, element: withSuspense(ProviderBookings) },
              { path: PROVIDER_APPROVED_ROUTES.ANALYTICS, element: withSuspense(ProviderAnalytics) },
              { path: PROVIDER_APPROVED_ROUTES.FINANCE, element: withSuspense(ProviderFinance) },
              { path: PROVIDER_APPROVED_ROUTES.SETTINGS, element: withSuspense(ProviderSettings) },
            ],
          }
        ]
      },
      {
        element: <AdminGuard />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin', element: <Navigate to={ADMIN_ROUTES.DASHBOARD} replace /> },
              { path: ADMIN_ROUTES.DASHBOARD, element: withSuspense(AdminDashboard) },
              { path: ADMIN_ROUTES.USERS, element: withSuspense(AdminUsers) },
              { path: ADMIN_ROUTES.MODERATION, element: withSuspense(AdminModeration) },
              { path: ADMIN_ROUTES.CATEGORIES, element: withSuspense(AdminCategories) },
              { path: ADMIN_ROUTES.PROVIDER_PACKAGES, element: withSuspense(AdminProviderPackages) },
              { path: ADMIN_ROUTES.LOCATIONS, element: withSuspense(AdminLocations) },
              { path: ADMIN_ROUTES.COMMUNITY, element: withSuspense(AdminCommunity) },
              { path: ADMIN_ROUTES.REPORTS, element: withSuspense(AdminReports) },
              { path: ADMIN_ROUTES.SYSTEM, element: withSuspense(AdminSystem) },
            ],
          }
        ]
      }
    ]
  }
    ]
  }
]);
