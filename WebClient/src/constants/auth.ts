export enum Roles {
  GUEST = 'GUEST',
  TRAVELER = 'TRAVELER',
  PREMIUM_TRAVELER = 'PREMIUM_TRAVELER',
  PROVIDER_PENDING = 'PROVIDER_PENDING',
  PROVIDER_APPROVED = 'PROVIDER_APPROVED',
  ADMIN = 'ADMIN'
}

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

// Single Source of Truth from frontend-permissions.md
export const ROLE_PERMISSION_MAP: Record<Roles, Permissions[]> = {
  [Roles.GUEST]: [],
  [Roles.TRAVELER]: [
    Permissions.CREATE_TRIP,
    Permissions.EDIT_TRIP,
    Permissions.CLONE_TRIP,
    Permissions.CREATE_BLOG,
    Permissions.REGISTER_PROVIDER,
  ],
  [Roles.PREMIUM_TRAVELER]: [
    Permissions.CREATE_TRIP,
    Permissions.EDIT_TRIP,
    Permissions.CLONE_TRIP,
    Permissions.CREATE_BLOG,
    Permissions.REGISTER_PROVIDER,
    Permissions.USE_AI_PLANNER,
    Permissions.USE_AI_CHAT,
  ],
  [Roles.PROVIDER_PENDING]: [
    Permissions.CREATE_TRIP,
    Permissions.EDIT_TRIP,
    Permissions.CLONE_TRIP,
    Permissions.CREATE_BLOG,
  ],
  [Roles.PROVIDER_APPROVED]: [
    Permissions.CREATE_TRIP,
    Permissions.EDIT_TRIP,
    Permissions.CLONE_TRIP,
    Permissions.CREATE_BLOG,
    Permissions.MANAGE_SERVICES,
    Permissions.MANAGE_REVIEWS,
  ],
  [Roles.ADMIN]: [
    Permissions.CREATE_TRIP,
    Permissions.EDIT_TRIP,
    Permissions.CLONE_TRIP,
    Permissions.CREATE_BLOG,
    Permissions.USE_AI_PLANNER,
    Permissions.USE_AI_CHAT,
    Permissions.MANAGE_SERVICES,
    Permissions.MANAGE_REVIEWS,
    Permissions.VIEW_ADMIN_DASHBOARD,
    Permissions.MANAGE_USERS,
    Permissions.MODERATE_CONTENT,
    Permissions.MANAGE_CATEGORIES,
  ],
};

export type AuthStatus = 'initializing' | 'authenticated' | 'unauthenticated';
