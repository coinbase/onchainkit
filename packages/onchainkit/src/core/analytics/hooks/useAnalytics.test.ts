import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { AnalyticsContext } from '../components/AnalyticsProvider';
import { useAnalytics } from './useAnalytics';

// Mock React's useContext
vi.mock('react', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof import('react');
  return {
    ...actual,
    useContext: vi.fn(),
  };
});

// Mock the AnalyticsProvider
vi.mock('../components/AnalyticsProvider', () => ({
  AnalyticsContext: {
    Provider: ({ children }: { children: React.ReactNode }) => children,
  },
}));

const mockUseContext = useContext as Mock;

describe('useAnalytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the analytics context value', () => {
    const mockAnalyticsContext = {
      sendAnalytics: vi.fn(),
    };

    mockUseContext.mockReturnValue(mockAnalyticsContext);

    const { result } = renderHook(() => useAnalytics());

    expect(mockUseContext).toHaveBeenCalledWith(AnalyticsContext);
    expect(result.current).toBe(mockAnalyticsContext);
  });

  it('should return context with sendAnalytics function', () => {
    const mockSendAnalytics = vi.fn();
    const mockAnalyticsContext = {
      sendAnalytics: mockSendAnalytics,
    };

    mockUseContext.mockReturnValue(mockAnalyticsContext);

    const { result } = renderHook(() => useAnalytics());

    expect(result.current.sendAnalytics).toBe(mockSendAnalytics);
    expect(typeof result.current.sendAnalytics).toBe('function');
  });

  it('should return default context when no provider is present', () => {
    const defaultContext = {
      sendAnalytics: () => {},
    };

    mockUseContext.mockReturnValue(defaultContext);

    const { result } = renderHook(() => useAnalytics());

    expect(result.current).toBe(defaultContext);
    expect(typeof result.current.sendAnalytics).toBe('function');
  });

  it('should handle undefined context', () => {
    mockUseContext.mockReturnValue(undefined);

    const { result } = renderHook(() => useAnalytics());

    expect(result.current).toBeUndefined();
  });

  it('should handle null context', () => {
    mockUseContext.mockReturnValue(null);

    const { result } = renderHook(() => useAnalytics());

    expect(result.current).toBeNull();
  });

  it('should call useContext with AnalyticsContext every time', () => {
    const mockAnalyticsContext = {
      sendAnalytics: vi.fn(),
    };

    mockUseContext.mockReturnValue(mockAnalyticsContext);

    // Render the hook multiple times
    const { result: result1 } = renderHook(() => useAnalytics());
    const { result: result2 } = renderHook(() => useAnalytics());

    expect(mockUseContext).toHaveBeenCalledTimes(2);
    expect(mockUseContext).toHaveBeenNthCalledWith(1, AnalyticsContext);
    expect(mockUseContext).toHaveBeenNthCalledWith(2, AnalyticsContext);
    expect(result1.current).toBe(mockAnalyticsContext);
    expect(result2.current).toBe(mockAnalyticsContext);
  });

  it('should work with different context values', () => {
    const context1 = { sendAnalytics: vi.fn() };
    const context2 = { sendAnalytics: vi.fn() };

    // Test with first context
    mockUseContext.mockReturnValue(context1);
    const { result: result1 } = renderHook(() => useAnalytics());
    expect(result1.current).toBe(context1);

    // Test with second context
    mockUseContext.mockReturnValue(context2);
    const { result: result2 } = renderHook(() => useAnalytics());
    expect(result2.current).toBe(context2);

    expect(result1.current).not.toBe(result2.current);
  });

  it('should preserve function reference when context is stable', () => {
    const stableSendAnalytics = vi.fn();
    const stableContext = { sendAnalytics: stableSendAnalytics };

    mockUseContext.mockReturnValue(stableContext);

    const { result: result1 } = renderHook(() => useAnalytics());
    const { result: result2 } = renderHook(() => useAnalytics());

    expect(result1.current.sendAnalytics).toBe(stableSendAnalytics);
    expect(result2.current.sendAnalytics).toBe(stableSendAnalytics);
    expect(result1.current).toBe(stableContext);
    expect(result2.current).toBe(stableContext);
  });
});
