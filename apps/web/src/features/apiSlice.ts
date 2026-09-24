import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { MOCK_STATS, MOCK_EVENTS, MOCK_TICKETS, MOCK_BLACK_SPOTS, MOCK_TIMESERIES } from '../lib/mock-db';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return { data: MOCK_STATS };
      },
    }),
    getRecentEvents: builder.query({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return { data: MOCK_EVENTS };
      },
    }),
    getActiveTickets: builder.query({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return { data: MOCK_TICKETS };
      },
    }),
    getBlackSpots: builder.query({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 600));
        return { data: MOCK_BLACK_SPOTS };
      },
    }),
    getAnalytics: builder.query({
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return { data: MOCK_TIMESERIES };
      },
    })
  }),
});

export const { useGetDashboardStatsQuery, useGetRecentEventsQuery, useGetActiveTicketsQuery, useGetBlackSpotsQuery, useGetAnalyticsQuery } = apiSlice;
