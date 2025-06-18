import '@testing-library/jest-dom';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SwapEvent } from '../types';
import { sendAnalyticsPayload } from '../utils/analyticsService';
import { useAnalytics } from './useAnalytics';

// Mock the analytics service
vi.mock('../utils/analyticsService', () => ({
  sendAnalyticsPayload: vi.fn(),
}));

describe('useAnalytics', () => {
  it('should return an object with a sendAnalytics function', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current).toBeDefined();
    expect(typeof result.current.sendAnalytics).toBe('function');
  });

  it('should return sendAnalytics that is a reference to sendAnalyticsPayload', () => {
    const { result } = renderHook(() => useAnalytics());

    expect(result.current.sendAnalytics).toBe(sendAnalyticsPayload);
  });

  it('should call sendAnalyticsPayload when sendAnalytics is invoked', () => {
    const { result } = renderHook(() => useAnalytics());

    const eventType = SwapEvent.SwapCanceled;
    const eventData = {};

    result.current.sendAnalytics(eventType, eventData);

    expect(sendAnalyticsPayload).toHaveBeenCalledWith(eventType, eventData);
    expect(sendAnalyticsPayload).toHaveBeenCalledTimes(1);
  });
});
