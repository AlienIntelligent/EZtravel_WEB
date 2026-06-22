export interface Place {
    id: string;
    name: string;
    description: string;
    address: string;
    cityId: string;
    latitude: number;
    longitude: number;
    images: string[];
    tags: string[];
    averageRating: number;
    totalReviews: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}
