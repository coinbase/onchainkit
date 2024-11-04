import {
  Component,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from 'react';

type Props = {
  fallback?: ComponentType<{ error: Error }>;
  children: ReactNode;
};

type State = {
  error: Error | null;
};

class NFTErrorBoundary extends Component<Props, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return <Fallback error={this.state.error} />;
      }
      return <h1>Sorry, we had an unhandled error</h1>;
    }

    return this.props.children;
  }
}

export default NFTErrorBoundary;
