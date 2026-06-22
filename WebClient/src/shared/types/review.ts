export interface Review {
    id: string;
    userId: string;
    targetId: string; // Place ID or Service ID
    targetType: 'PLACE' | 'SERVICE';
    rating: number;
    content: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
}
