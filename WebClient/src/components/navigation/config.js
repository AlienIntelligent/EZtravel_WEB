import { 
  Compass, 
  Map, 
  Users, 
  Sparkles, 
  User, 
  Bell, 
  MessageSquare, 
  Layers, 
  LayoutDashboard,
  Star,
  Settings,
  Calendar,
  Tag,
  TrendingUp,
  Wallet,
  MapPin,
  AlertTriangle,
  BadgeDollarSign
} from 'lucide-react';
import { 
  AUTH_ROUTES, 
  PUBLIC_ROUTES, 
  PREMIUM_ROUTES, 
  PROVIDER_APPROVED_ROUTES, 
  ADMIN_ROUTES 
} from '../../router/routes';

export const ROLES = {
  TRAVELER: 'TRAVELER',
  PREMIUM_TRAVELER: 'PREMIUM_TRAVELER',
  PROVIDER_PENDING: 'PROVIDER_PENDING',
  PROVIDER_APPROVED: 'PROVIDER_APPROVED',
  ADMIN: 'ADMIN'
};

const TRAVELER_BASE_ROLES = [
  ROLES.TRAVELER, 
  ROLES.PREMIUM_TRAVELER, 
  ROLES.PROVIDER_PENDING
];

export const SIDEBAR_CONFIG = [
  {
    title: 'Du lịch',
    roles: TRAVELER_BASE_ROLES,
    items: [
      {
        label: 'Tổng quan',
        route: AUTH_ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        roles: TRAVELER_BASE_ROLES,
        status: 'active'
      },
      {
        label: 'Khám phá',
        route: PUBLIC_ROUTES.EXPLORE,
        icon: Compass,
        roles: TRAVELER_BASE_ROLES,
        status: 'active'
      },
      {
        label: 'Chuyến đi',
        route: AUTH_ROUTES.TRIPS,
        icon: Map,
        roles: TRAVELER_BASE_ROLES,
        status: 'active'
      },
      {
        label: 'Cộng đồng',
        route: PUBLIC_ROUTES.COMMUNITY,
        icon: Users,
        roles: TRAVELER_BASE_ROLES,
        status: 'active'
      },
      {
        label: 'AI Planner',
        route: PREMIUM_ROUTES.AI_PLANNER,
        icon: Sparkles,
        roles: TRAVELER_BASE_ROLES,
        status: 'active'
      },
      {
        label: 'Hồ sơ',
        route: AUTH_ROUTES.PROFILE,
        icon: User,
        roles: TRAVELER_BASE_ROLES,
        status: 'active'
      },
      {
        label: 'Thông báo',
        route: AUTH_ROUTES.NOTIFICATIONS,
        icon: Bell,
        roles: TRAVELER_BASE_ROLES,
        status: 'active'
      }
    ]
  },
  {
    title: 'Nhà cung cấp',
    roles: [ROLES.PROVIDER_APPROVED],
    items: [
      {
        label: 'Tổng quan',
        route: PROVIDER_APPROVED_ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Dịch vụ',
        route: PROVIDER_APPROVED_ROUTES.SERVICES,
        icon: Layers,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Đặt chỗ',
        route: PROVIDER_APPROVED_ROUTES.BOOKINGS,
        icon: Calendar,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Bảng giá',
        route: PROVIDER_APPROVED_ROUTES.PACKAGES,
        icon: Tag,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Gói hiện tại',
        route: PROVIDER_APPROVED_ROUTES.CURRENT_PACKAGE,
        icon: Tag,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Lịch sử gói',
        route: PROVIDER_APPROVED_ROUTES.PACKAGE_HISTORY,
        icon: Calendar,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Thanh toán',
        route: PROVIDER_APPROVED_ROUTES.PAYMENT_HISTORY,
        icon: Wallet,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Đánh giá',
        route: PROVIDER_APPROVED_ROUTES.REVIEWS,
        icon: Star,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Phân tích',
        route: PROVIDER_APPROVED_ROUTES.ANALYTICS,
        icon: TrendingUp,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Tài chính',
        route: PROVIDER_APPROVED_ROUTES.FINANCE,
        icon: Wallet,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      },
      {
        label: 'Cài đặt',
        route: PROVIDER_APPROVED_ROUTES.SETTINGS,
        icon: Settings,
        roles: [ROLES.PROVIDER_APPROVED],
        status: 'active'
      }
    ]
  },
  {
    title: 'Quản trị',
    roles: [ROLES.ADMIN],
    items: [
      {
        label: 'Tổng quan',
        route: ADMIN_ROUTES.DASHBOARD,
        icon: LayoutDashboard,
        roles: [ROLES.ADMIN],
        status: 'active'
      },
      {
        label: 'Người dùng',
        route: ADMIN_ROUTES.USERS,
        icon: Users,
        roles: [ROLES.ADMIN],
        status: 'active'
      },
      {
        label: 'Dịch vụ',
        route: ADMIN_ROUTES.MODERATION,
        icon: Layers,
        roles: [ROLES.ADMIN],
        status: 'active'
      },
      {
        label: 'Danh mục',
        route: ADMIN_ROUTES.CATEGORIES,
        icon: Tag,
        roles: [ROLES.ADMIN],
        status: 'active'
      },
      {
        label: 'Gói nhà cung cấp',
        route: ADMIN_ROUTES.PROVIDER_PACKAGES,
        icon: BadgeDollarSign,
        roles: [ROLES.ADMIN],
        status: 'active'
      },
      {
        label: 'Địa điểm',
        route: ADMIN_ROUTES.LOCATIONS,
        icon: MapPin,
        roles: [ROLES.ADMIN],
        status: 'active'
      },
      {
        label: 'Cộng đồng',
        route: ADMIN_ROUTES.COMMUNITY,
        icon: MessageSquare,
        roles: [ROLES.ADMIN],
        status: 'active'
      },
      {
        label: 'Báo cáo',
        route: ADMIN_ROUTES.REPORTS,
        icon: AlertTriangle,
        roles: [ROLES.ADMIN],
        status: 'active'
      },
      {
        label: 'Hệ thống',
        route: ADMIN_ROUTES.SYSTEM,
        icon: Settings,
        roles: [ROLES.ADMIN],
        status: 'active'
      }
    ]
  }
];
