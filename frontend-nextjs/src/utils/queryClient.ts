'use client';

import { QueryClient } from '@tanstack/react-query';

// Define error type for better type safety
interface HTTPError extends Error {
  status?: number;
  response?: {
    status: number;
  };
}

// Type guard to check if error has status
const hasStatusCode = (error: unknown): error is HTTPError => {
  return (
    error !== null &&
    typeof error === 'object' &&
    ('status' in error || ('response' in error && typeof (error as HTTPError).response?.status === 'number'))
  );
};

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors except 429 (rate limit)
        if (hasStatusCode(error)) {
          const status = error.status || error.response?.status;
          if (status && status >= 400 && status < 500 && status !== 429) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on client errors
        if (hasStatusCode(error)) {
          const status = error.status || error.response?.status;
          if (status && status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
  },
});
