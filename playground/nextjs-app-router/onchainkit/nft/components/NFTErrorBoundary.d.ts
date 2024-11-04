import { Component, type ComponentType, type ErrorInfo, type ReactNode } from 'react';
type Props = {
    fallback?: ComponentType<{
        error: Error;
    }>;
    children: ReactNode;
};
type State = {
    error: Error | null;
};
declare class NFTErrorBoundary extends Component<Props, State> {
    state: State;
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): string | number | boolean | Iterable<ReactNode> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export default NFTErrorBoundary;
//# sourceMappingURL=NFTErrorBoundary.d.ts.map