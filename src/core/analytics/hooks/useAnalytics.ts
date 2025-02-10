import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import type {
  AnalyticsEvent,
  AnalyticsEventData,
} from '@/core/analytics/types';
import { sendAnalytics } from '@/core/analytics/utils/sendAnalytics';
import { useOnchainKit } from '@/useOnchainKit';
import { useEffect, useState } from 'react';

/**
 * useAnalytics handles analytics events and data preparation
 */
export const useAnalytics = () => {
  const { apiKey, sessionId, config } = useOnchainKit();
  const [appName, setAppName] = useState('');

  useEffect(() => {
    setAppName(document.title);
  }, []);

  const prepareAnalyticsPayload = (
    event: AnalyticsEvent,
    data: AnalyticsEventData[AnalyticsEvent],
  ) => {
    return {
      url: config?.analyticsUrl ?? ANALYTICS_API_URL,
      headers: {
        'OnchainKit-App-Name': appName,
      },
      body: {
        apiKey: apiKey ?? 'undefined',
        sessionId: sessionId ?? 'undefined',
        timestamp: Date.now(),
        eventType: event,
        data,
      },
    };
  };

  return {
    sendAnalytics: (
      event: AnalyticsEvent,
      data: AnalyticsEventData[AnalyticsEvent],
    ) => {
      // Don't send analytics if disabled
      if (!config?.analytics) {
        return;
      }
      const payload = prepareAnalyticsPayload(event, data);
      sendAnalytics(payload);
    },
  };
};
