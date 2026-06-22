export interface Trip {
    id: string;
    userId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    visibility: 'PRIVATE' | 'PUBLIC' | 'SHARED';
    totalBudget: number;
    status: 'DRAFT' | 'PLANNED' | 'COMPLETED';
    createdAt: string;
    updatedAt: string;
}

export interface TripDay {
    id: string;
    tripId: string;
    date: string;
    sequence: number;
    createdAt: string;
    updatedAt: string;
}

export interface TripPlace {
    id: string;
    dayId: string;
    placeId: string;
    title?: string;
    sequence: number;
    startTime?: string;
    endTime?: string;
    note?: string;
}

export interface TripService {
    id: string;
    dayId: string;
    serviceId: string;
    title?: string;
    sequence: number;
    startTime?: string;
    endTime?: string;
    note?: string;
    estimatedCost: number; // Cost from the service domain
}

export interface BudgetSummary {
    total: number;
    accommodation: number;
    food: number;
    activity: number;
    transport: number;
}

