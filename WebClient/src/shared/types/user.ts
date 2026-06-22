export enum UserRole {
    GUEST = 'GUEST',
    TRAVELER = 'TRAVELER',
    PROVIDER = 'PROVIDER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    isPremium?: boolean;
    currentTravelerPackageId?: number;
    currentTravelerPackageName?: string;
    premiumUntil?: string;
    role: UserRole | string;
    status: 'ACTIVE' | 'LOCKED';
    createdAt: string;
    updatedAt: string;
}
