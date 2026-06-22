import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ExploreState {
    activeTab: 'places' | 'services';
    viewMode: 'grid' | 'map';
    keyword: string;
    province: string | null;
    serviceCategory: 'ACCOMMODATION' | 'FOOD' | 'ACTIVITY' | 'TRANSPORT' | null;
    budgetMin: number;
    budgetMax: number;
    rating: number;
    page: number;
}

const initialState: ExploreState = {
    activeTab: 'places',
    viewMode: 'grid',
    keyword: '',
    province: null,
    serviceCategory: null,
    budgetMin: 0,
    budgetMax: 10000000,
    rating: 0,
    page: 1,
};

const exploreSlice = createSlice({
    name: 'explore',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<'places' | 'services'>) => {
            state.activeTab = action.payload;
            state.page = 1; // Reset page when changing tabs
        },
        setViewMode: (state, action: PayloadAction<'grid' | 'map'>) => {
            state.viewMode = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<ExploreState>>) => {
            return { ...state, ...action.payload, page: 1 }; // Reset page on filter change
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        resetFilters: (state) => {
            return { ...initialState, activeTab: state.activeTab, viewMode: state.viewMode };
        }
    },
});

export const {
    setActiveTab,
    setViewMode,
    setFilters,
    setPage,
    resetFilters
} = exploreSlice.actions;

export default exploreSlice.reducer;
