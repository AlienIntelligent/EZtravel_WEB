import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProviderState {
    servicesFilter: {
        keyword: string;
        status: string | null;
        page: number;
    };
}

const initialState: ProviderState = {
    servicesFilter: {
        keyword: '',
        status: null,
        page: 1,
    }
};

const providerSlice = createSlice({
    name: 'provider',
    initialState,
    reducers: {
        setServicesFilter(state, action: PayloadAction<Partial<ProviderState['servicesFilter']>>) {
            state.servicesFilter = { ...state.servicesFilter, ...action.payload };
        },
        resetServicesFilter(state) {
            state.servicesFilter = initialState.servicesFilter;
        }
    }
});

export const { setServicesFilter, resetServicesFilter } = providerSlice.actions;
export default providerSlice.reducer;
