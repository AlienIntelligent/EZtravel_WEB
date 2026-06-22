import { Roles, Permissions, ROLE_PERMISSION_MAP } from '../../constants/auth';

export const resolvePermissions = (role: Roles): Permissions[] => {
  return ROLE_PERMISSION_MAP[role] || [];
};

export const hasPermission = (userRole: Roles, permission: Permissions): boolean => {
  const permissions = resolvePermissions(userRole);
  return permissions.includes(permission);
};
