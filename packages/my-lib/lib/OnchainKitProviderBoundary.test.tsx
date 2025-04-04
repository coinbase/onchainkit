import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OnchainKitProviderBoundary from './OnchainKitProviderBoundary';
import { sendAnalyticsPayload } from './core/analytics/hooks/useAnalytics';
import { ErrorEvent as AnalyticsErrorEvent } from './core/analytics/types';

vi.mock('./core/analytics/hooks/useAnalytics', () => {
  return {
    sendAnalyticsPayload: vi.fn(),
  };
});

// disable error output
function onError(e: ErrorEvent) {
  e.preventDefault();
}

const ErrorThrowingChild = () => {
  throw new Error('Test error');
};

const FallbackComponent = ({ error }: { error: Error }) => (
  <div data-testid="fallback">{error.message}</div>
);

describe('OnchainKitProviderBoundary', () => {
  beforeEach(() => {
    window.addEventListener('error', onError);
  });

  afterEach(() => {
    window.removeEventListener('error', onError);
  });

  it('should render children when there is no error', () => {
    const { getByTestId } = render(
      <OnchainKitProviderBoundary>
        <div data-testid="child">Child Component</div>
      </OnchainKitProviderBoundary>,
    );

    expect(getByTestId('child')).toBeInTheDocument();
  });

  it('should send analytics when there is an error', () => {
    render(
      <OnchainKitProviderBoundary>
        <ErrorThrowingChild />
      </OnchainKitProviderBoundary>,
    );

    expect(sendAnalyticsPayload).toHaveBeenCalledWith(
      AnalyticsErrorEvent.ComponentError,
      {
        component: 'OnchainKitProviderBoundary',
        error: 'Test error',
        metadata: expect.objectContaining({
          message: 'Test error',
          stack: expect.any(String),
        }),
      },
    );
  });

  it('renders fallback component when there is an error', () => {
    const { getByTestId } = render(
      <OnchainKitProviderBoundary fallback={FallbackComponent}>
        <ErrorThrowingChild />
      </OnchainKitProviderBoundary>,
    );

    expect(getByTestId('fallback')).toBeInTheDocument();
    expect(getByTestId('fallback')).toHaveTextContent('Test error');
  });

  it('renders default error message when there is an error and no fallback is provided', () => {
    const { getByText } = render(
      <OnchainKitProviderBoundary>
        <ErrorThrowingChild />
      </OnchainKitProviderBoundary>,
    );

    expect(getByText('Sorry, we had an unhandled error')).toBeInTheDocument();
  });
});
