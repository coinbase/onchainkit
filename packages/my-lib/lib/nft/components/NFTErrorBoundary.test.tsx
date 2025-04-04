import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import NFTErrorBoundary from './NFTErrorBoundary';

// disable error output
function onError(e: ErrorEvent) {
  e.preventDefault();
}

beforeEach(() => {
  window.addEventListener('error', onError);
});

afterEach(() => {
  window.removeEventListener('error', onError);
});

const ErrorThrowingChild = () => {
  throw new Error('Test error');
};

const FallbackComponent = ({ error }: { error: Error }) => (
  <div data-testid="fallback">{error.message}</div>
);

describe('NFTErrorBoundary', () => {
  it('should render children when there is no error', () => {
    const { getByTestId } = render(
      <NFTErrorBoundary>
        <div data-testid="child">Child Component</div>
      </NFTErrorBoundary>,
    );

    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('renders fallback component when there is an error', () => {
    const { getByTestId } = render(
      <NFTErrorBoundary fallback={FallbackComponent}>
        <ErrorThrowingChild />
      </NFTErrorBoundary>,
    );

    expect(getByTestId('fallback')).toBeInTheDocument();
    expect(getByTestId('fallback')).toHaveTextContent('Test error');
  });

  it('renders default error message when there is an error and no fallback is provided', () => {
    const { getByText } = render(
      <NFTErrorBoundary>
        <ErrorThrowingChild />
      </NFTErrorBoundary>,
    );

    expect(getByText('Sorry, we had an unhandled error')).toBeInTheDocument();
  });
});
