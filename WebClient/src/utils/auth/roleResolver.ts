import { User } from '../../shared/types/user';
import { Roles } from '../../constants/auth';

export const resolveRole = (user: User | null | undefined): Roles => {
  if (!user) {
    return Roles.GUEST;
  }

  // Treat Admin role mapping
  const baseRole = typeof user.role === 'string' ? user.role.toUpperCase() : user.role;
  const providerStatus = String((user as any).providerStatus ?? '').toUpperCase();
  const hasProviderProfile = Boolean((user as any).providerId ?? (user as any).maNhaCungCap);

  if (baseRole === 'ADMIN') {
    return Roles.ADMIN;
  }

  if (hasProviderProfile || providerStatus) {
    if (providerStatus === 'PENDING') {
      return Roles.PROVIDER_PENDING;
    }

    if (providerStatus === 'ACTIVE' || providerStatus === 'APPROVED') {
      return Roles.PROVIDER_APPROVED;
    }
  }

  if (baseRole === 'PROVIDER' || baseRole === 'SERVICEPROVIDER') {
    // Determine if approved or pending. Assuming user object may contain providerStatus.
    // Fallback to APPROVED if status is not explicitly PENDING to avoid locking out existing logic,
    // or strictly require status check based on how the backend returns it.
    if (providerStatus === 'PENDING') {
      return Roles.PROVIDER_PENDING;
    }
    return Roles.PROVIDER_APPROVED;
  }

  if (baseRole === 'PROVIDER_PENDING') {
    return Roles.PROVIDER_PENDING;
  }

  if (baseRole === 'PROVIDER_APPROVED') {
    return Roles.PROVIDER_APPROVED;
  }

  if (baseRole === 'PREMIUM_TRAVELER') {
    return (user as any).isPremium === false ? Roles.TRAVELER : Roles.PREMIUM_TRAVELER;
  }

  // Determine if Premium
  if ((user as any).isPremium) {
    return Roles.PREMIUM_TRAVELER;
  }

  // Default authenticated user
  return Roles.TRAVELER;
};
