import { Trip, TripDay, TripPlace, TripService, Service } from './';

export interface AIHistory {
    id: number; // MaLichSuAi
    userId: string; // MaNguoiDung (string in our TS, int in DB, we use string in frontend)
    aiType: string; // LoaiAi
    prompt: string; // Prompt
    resultSummary?: string; // KetQuaTomTat
    tokens: number; // SoToken
    createdAt: string; // NgayTao
}

export interface AIPlannerRequest {
    destination: string;
    startDate: string;
    endDate: string;
    budgetMode: 'ECONOMY' | 'STANDARD' | 'LUXURY';
    preferences: string[]; // e.g. "Culture", "Nature"
    additionalNotes?: string;
}

export interface AIPlannerResponse {
    summary: string;
    trip: Partial<Trip>;
    days: Partial<TripDay>[];
    places: Partial<TripPlace>[];
    services: Partial<TripService>[];
}

export interface AIBudgetRequest {
    tripId: string;
    targetBudget?: number;
}

export interface AIBudgetOptimization {
    originalServiceId: string;
    originalServiceName: string;
    originalCost: number;
    suggestedService: Service; // Alternative from DB
    savings: number;
    reason: string;
}

export interface AIBudgetResponse {
    totalCurrentCost: number;
    suggestedSavings: number;
    optimizations: AIBudgetOptimization[];
}

export interface AIRouteRequest {
    tripId: string;
}

export interface AIRouteSuggestion {
    dayId: string;
    originalOrder: string[]; // TripPlace IDs
    optimizedOrder: string[]; // TripPlace IDs
    reason: string;
    estimatedTimeSavedMinutes: number;
}

export interface AIRouteResponse {
    suggestions: AIRouteSuggestion[];
}

export interface AIChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface AIChatRequest {
    messages: AIChatMessage[];
    contextType?: 'PLACE' | 'SERVICE' | 'TRIP' | 'BLOG';
    contextId?: string;
}

export interface AIChatResponse {
    message: AIChatMessage;
    sources?: { type: string; id: string; title: string; url: string }[];
}
