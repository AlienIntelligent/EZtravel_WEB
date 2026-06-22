import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AdminState {
    providersFilter: { keyword: string; status: string | null; page: number; };
    servicesFilter: { keyword: string; status: string | null; page: number; };
    placesFilter: { keyword: string; page: number; };
    usersFilter: { keyword: string; role: string | null; status: string | null; page: number; };
    blogsFilter: { keyword: string; status: string | null; page: number; };
    reportsFilter: { status: string | null; page: number; };
}

const initialState: AdminState = {
    providersFilter: { keyword: '', status: null, page: 1 },
    servicesFilter: { keyword: '', status: null, page: 1 },
    placesFilter: { keyword: '', page: 1 },
    usersFilter: { keyword: '', role: null, status: null, page: 1 },
    blogsFilter: { keyword: '', status: null, page: 1 },
    reportsFilter: { status: null, page: 1 },
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setProvidersFilter(state, action: PayloadAction<Partial<AdminState['providersFilter']>>) {
            state.providersFilter = { ...state.providersFilter, ...action.payload };
        },
        setServicesFilter(state, action: PayloadAction<Partial<AdminState['servicesFilter']>>) {
            state.servicesFilter = { ...state.servicesFilter, ...action.payload };
        },
        setPlacesFilter(state, action: PayloadAction<Partial<AdminState['placesFilter']>>) {
            state.placesFilter = { ...state.placesFilter, ...action.payload };
        },
        setUsersFilter(state, action: PayloadAction<Partial<AdminState['usersFilter']>>) {
            state.usersFilter = { ...state.usersFilter, ...action.payload };
        },
        setBlogsFilter(state, action: PayloadAction<Partial<AdminState['blogsFilter']>>) {
            state.blogsFilter = { ...state.blogsFilter, ...action.payload };
        },
        setReportsFilter(state, action: PayloadAction<Partial<AdminState['reportsFilter']>>) {
            state.reportsFilter = { ...state.reportsFilter, ...action.payload };
        },
    }
});

export const { 
    setProvidersFilter, 
    setServicesFilter, 
    setPlacesFilter, 
    setUsersFilter, 
    setBlogsFilter, 
    setReportsFilter 
} = adminSlice.actions;

export default adminSlice.reducer;
