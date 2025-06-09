import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React, { useContext } from 'react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import { SwapEvent } from '../types';
import { AnalyticsContext, AnalyticsProvider } from './AnalyticsProvider';

// Mock dependencies
vi.mock('@/core/analytics/utils/analyticsService', () => ({
  sendAnalyticsPayload: vi.fn(),
  analyticsService: {
    setClientMeta: vi.fn(),
  },
}));

vi.mock('@/minikit/MiniKitProvider', async () => {
  const React = await import('react');
  return {
    MiniKitContext: React.createContext({
      __isMiniKit: false,
      context: null,
      updateClientContext: vi.fn(),
      notificationProxyUrl: '/api/notify',
    }),
  };
});

vi.mock('@farcaster/frame-sdk', () => ({
  sdk: {
    context: Promise.resolve({
      user: {
        fid: 12345,
        username: 'test',
        displayName: 'Test User',
        pfpUrl: 'https://example.com/pfp.png',
      },
      client: {
        clientFid: 12345,
      },
    }),
  },
}));

vi.mock('@/version', () => ({
  version: '1.0.0',
}));

const mockSendAnalyticsPayload = vi.fn();
const mockSetClientMeta = vi.fn();

// Import the mocked modules
import {
  sendAnalyticsPayload,
  analyticsService,
} from '@/core/analytics/utils/analyticsService';
import { MiniKitContext } from '@/minikit/MiniKitProvider';

describe('AnalyticsProvider', () => {
  // Test component to access context
  const TestComponent = () => {
    const { sendAnalytics } = useContext(AnalyticsContext);
    return (
      <button
        type="button"
        onClick={() =>
          sendAnalytics(SwapEvent.SwapSuccess, {
            paymaster: true,
            transactionHash: '0x123',
            address: '0xabc',
            amount: 100,
            from: 'ETH',
            to: 'USDC',
          })
        }
      >
        Send Analytics
      </button>
    );
  };

  // Helper to render with MiniKit context
  const renderWithMiniKitContext = (
    children: React.ReactNode,
    isMiniKit = false,
  ) => {
    return render(
      <MiniKitContext.Provider
        value={{
          __isMiniKit: isMiniKit,
          context: null,
          updateClientContext: vi.fn(),
          notificationProxyUrl: '/api/notify',
        }}
      >
        {children}
      </MiniKitContext.Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (sendAnalyticsPayload as Mock).mockImplementation(mockSendAnalyticsPayload);
    (analyticsService.setClientMeta as Mock).mockImplementation(
      mockSetClientMeta,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('AnalyticsContext', () => {
    it('should have context and provider defined', () => {
      expect(AnalyticsContext).toBeDefined();
      expect(AnalyticsContext.Provider).toBeDefined();
    });
  });

  describe('AnalyticsProvider component', () => {
    it('should render children', () => {
      renderWithMiniKitContext(
        <AnalyticsProvider>
          <div data-testid="test-child">Test Child</div>
        </AnalyticsProvider>,
        false,
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should provide context with sendAnalytics function', async () => {
      renderWithMiniKitContext(
        <AnalyticsProvider>
          <TestComponent />
        </AnalyticsProvider>,
        false,
      );

      const button = screen.getByRole('button', { name: 'Send Analytics' });
      expect(button).toBeInTheDocument();

      // Wait for initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      button.click();

      expect(mockSendAnalyticsPayload).toHaveBeenCalledWith(
        SwapEvent.SwapSuccess,
        {
          paymaster: true,
          transactionHash: '0x123',
          address: '0xabc',
          amount: 100,
          from: 'ETH',
          to: 'USDC',
        },
      );
    });

    it('should initialize with onchainkit mode when not in minikit', async () => {
      renderWithMiniKitContext(
        <AnalyticsProvider>
          <div>Test</div>
        </AnalyticsProvider>,
        false,
      );

      // Wait for initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockSetClientMeta).toHaveBeenCalledWith({
        mode: 'onchainkit',
        clientFid: 12345,
        ockVersion: '1.0.0',
      });
    });

    it('should initialize with minikit mode when in minikit', async () => {
      renderWithMiniKitContext(
        <AnalyticsProvider>
          <div>Test</div>
        </AnalyticsProvider>,
        true,
      );

      // Wait for initialization to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockSetClientMeta).toHaveBeenCalledWith({
        mode: 'minikit',
        clientFid: 12345,
        ockVersion: '1.0.0',
      });
    });

    it('should handle async initialization without errors', async () => {
      // Should not throw during render
      expect(() => {
        renderWithMiniKitContext(
          <AnalyticsProvider>
            <div>Test</div>
          </AnalyticsProvider>,
          false,
        );
      }).not.toThrow();

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Verify initialization completed
      expect(mockSetClientMeta).toHaveBeenCalled();
    });

    it('should provide working sendAnalytics function in context', async () => {
      renderWithMiniKitContext(
        <AnalyticsProvider>
          <TestComponent />
        </AnalyticsProvider>,
        false,
      );

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Trigger sendAnalytics through the test component
      const button = screen.getByRole('button', { name: 'Send Analytics' });
      button.click();

      // Verify the analytics service was called correctly
      expect(mockSendAnalyticsPayload).toHaveBeenCalledWith(
        SwapEvent.SwapSuccess,
        {
          paymaster: true,
          transactionHash: '0x123',
          address: '0xabc',
          amount: 100,
          from: 'ETH',
          to: 'USDC',
        },
      );
    });
  });
});
