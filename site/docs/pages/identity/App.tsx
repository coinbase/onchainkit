'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function App(props) {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>{props.children}</div>
    </QueryClientProvider>
  );
}
