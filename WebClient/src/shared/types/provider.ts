export interface Provider {
    id: string;
    userId: string;
    companyName: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt: string;
}
