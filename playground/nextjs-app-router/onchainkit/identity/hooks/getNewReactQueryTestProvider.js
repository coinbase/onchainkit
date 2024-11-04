import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { jsx } from 'react/jsx-runtime';
const getNewReactQueryTestProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });
  function ReactQueryTestProvider({
    children
  }) {
    return /*#__PURE__*/jsx(QueryClientProvider, {
      client: queryClient,
      children: children
    });
  }
  return ReactQueryTestProvider;
};
export { getNewReactQueryTestProvider };
//# sourceMappingURL=getNewReactQueryTestProvider.js.map
