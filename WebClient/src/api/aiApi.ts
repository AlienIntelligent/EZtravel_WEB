import { baseApi } from './baseApi';
import { 
    AIHistory, 
    AIPlannerRequest, 
    AIPlannerResponse, 
    AIBudgetRequest, 
    AIBudgetResponse, 
    AIRouteRequest, 
    AIRouteResponse, 
    AIChatRequest, 
    AIChatResponse,
    PaginatedResponse
} from '../shared/types';

export const aiApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        generateItinerary: builder.mutation<any, any>({
            query: (body) => ({
                url: '/ai/generate',
                method: 'POST',
                body,
            }),
        }),
        chat: builder.mutation<any, any>({
            query: (body) => ({
                url: '/ai/chat',
                method: 'POST',
                body,
            }),
        }),
        optimizeRoute: builder.mutation<any, any>({
            query: (body) => ({
                url: '/ai/optimize-route',
                method: 'POST',
                body,
            }),
        }),
        analyzeBudget: builder.mutation<any, any>({
            query: (body) => ({
                url: '/ai/analyze-budget',
                method: 'POST',
                body,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGenerateItineraryMutation,
    useChatMutation,
    useOptimizeRouteMutation,
    useAnalyzeBudgetMutation,
} = aiApi;
