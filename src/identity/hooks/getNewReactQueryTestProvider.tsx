import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * This is a unit testing helper function to create a new React Query Test Provider.
 * It is important to get a new instance each time to prevent cached results from the previous test
 * Note: React-query recommends turning off retries for tests, in order to avoid timeout
 * https://tanstack.com/query/v4/docs/framework/react/guides/testing#turn-off-retries
 */
export const getNewReactQueryTestProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  function ReactQueryTestProvider({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return ReactQueryTestProvider;
};
