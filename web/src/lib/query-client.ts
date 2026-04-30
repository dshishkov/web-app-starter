import { QueryClient } from '@tanstack/react-query'

import { QUERY_DEFAULTS } from './app-config'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_DEFAULTS.staleTimeMs,
      retry: QUERY_DEFAULTS.retry,
      refetchOnWindowFocus: QUERY_DEFAULTS.refetchOnWindowFocus,
    },
  },
})
