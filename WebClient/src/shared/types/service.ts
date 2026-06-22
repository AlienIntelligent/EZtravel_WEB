export interface Service {
    id: string;
    providerId: string;
    placeId: string;
    name: string;
    description: string;
    type: 'ACCOMMODATION' | 'FOOD' | 'ACTIVITY' | 'TRANSPORT';
    price: number;
    referencePrice?: number;
    images: string[];
    averageRating: number;
    totalReviews: number;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    createdAt: string;
    updatedAt: string;
}
