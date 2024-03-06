import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * This is a unit testing helper function to create a new React Query Test Provider.
 * It is important to get a new instance each time to prevent cached results from the previous test
 */
export const getNewReactQueryTestProvider = () => {
  const queryClient = new QueryClient();
  function ReactQueryTestProvider({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  return ReactQueryTestProvider;
};
