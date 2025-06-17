import { sendAnalyticsPayload } from '../utils/analyticsService';

/**
 * useAnalytics handles analytics events and data preparation
 */
export const useAnalytics = () => {
  return { sendAnalytics: sendAnalyticsPayload };
};
