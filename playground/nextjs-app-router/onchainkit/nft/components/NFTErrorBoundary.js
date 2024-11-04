import { Component } from 'react';
import { jsx } from 'react/jsx-runtime';
class NFTErrorBoundary extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }
  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        const Fallback = this.props.fallback;
        return /*#__PURE__*/jsx(Fallback, {
          error: this.state.error
        });
      }
      return /*#__PURE__*/jsx("h1", {
        children: "Sorry, we had an unhandled error"
      });
    }
    return this.props.children;
  }
}
export { NFTErrorBoundary as default };
//# sourceMappingURL=NFTErrorBoundary.js.map
