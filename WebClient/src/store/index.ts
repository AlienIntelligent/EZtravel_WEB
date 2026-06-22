import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '../api/baseApi';
import tripReducer from './tripSlice';
import exploreReducer from './exploreSlice';
import providerReducer from './providerSlice';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import aiReducer from './aiSlice';

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    trip: tripReducer,
    explore: exploreReducer,
    provider: providerReducer,
    auth: authReducer,
    admin: adminReducer,
    ai: aiReducer,
    // reducers will be added here
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
