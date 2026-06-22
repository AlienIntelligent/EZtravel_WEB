import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../store/axiosBaseQuery';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery({ baseUrl: '' }),
    endpoints: () => ({}),
    tagTypes: ['User', 'Provider', 'Place', 'Service', 'Trip', 'Review', 'Explore', 'Admin', 'Blog', 'Report', 'AIHistory', 'Community', 'Notification', 'Subscription'],
});
