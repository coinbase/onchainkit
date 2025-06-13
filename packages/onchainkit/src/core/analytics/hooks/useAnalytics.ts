import { useContext } from 'react';
import { AnalyticsContext } from '../components/AnalyticsProvider';

/**
 * useAnalytics handles analytics events and data preparation
 */
export const useAnalytics = () => {
  return useContext(AnalyticsContext);
};
