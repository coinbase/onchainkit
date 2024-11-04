/**
 * This is a unit testing helper function to create a new React Query Test Provider.
 * It is important to get a new instance each time to prevent cached results from the previous test
 * Note: React-query recommends turning off retries for tests, in order to avoid timeout
 * https://tanstack.com/query/v4/docs/framework/react/guides/testing#turn-off-retries
 */
export declare const getNewReactQueryTestProvider: () => ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=getNewReactQueryTestProvider.d.ts.map