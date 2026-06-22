export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_OTP: '/auth/verify-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  EXPLORE: '/explore',
  DESTINATION_DETAILS: '/explore/destinations/:id',
  SERVICE_DETAILS: '/explore/services/:id',
  COMMUNITY: '/community',
  BLOGS: '/community/blogs',
  BLOG_DETAILS: '/community/blogs/:id',
  DESIGN_PREVIEW: '/preview/design-system',
};

export const AUTH_ROUTES = {
  DASHBOARD: '/dashboard',
  TRIPS: '/trips',
  TRIP_CREATE: '/trips/create',
  TRIP_DETAILS: '/trips/:id',
  TRIP_PLANNER: '/trips/:id/planner',
  BLOG_CREATE: '/community/blogs/create',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  UPGRADE: '/upgrade',
  PROVIDER_REGISTRATION: '/provider/registration',
};

export const PREMIUM_ROUTES = {
  AI_PLANNER: '/ai/planner',
  AI_CHAT: '/ai/chat',
};

export const PROVIDER_PENDING_ROUTES = {
  PENDING: '/provider/pending',
};

export const PROVIDER_APPROVED_ROUTES = {
  DASHBOARD: '/provider/dashboard',
  SERVICES: '/provider/services',
  SERVICE_CREATE: '/provider/services/create',
  SERVICE_EDIT: '/provider/services/:id/edit',
  REVIEWS: '/provider/reviews',
  PACKAGES: '/provider/packages',
  CURRENT_PACKAGE: '/provider/current-package',
  PACKAGE_HISTORY: '/provider/package-history',
  PAYMENT_HISTORY: '/provider/payment-history',
};

export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  MODERATION: '/admin/moderation',
  CATEGORIES: '/admin/categories',
  PROVIDER_PACKAGES: '/admin/provider-packages',
};
