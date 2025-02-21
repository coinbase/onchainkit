import { getOnchainKitConfig } from '@/core/OnchainKitConfig';
import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import type {
  AnalyticsEvent,
  AnalyticsEventData,
} from '@/core/analytics/types';
import { sendAnalytics } from '@/core/analytics/utils/sendAnalytics';

const prepareAnalyticsPayload = <T extends AnalyticsEvent>(
  event: T,
  data: AnalyticsEventData[T],
) => {
  const config = getOnchainKitConfig('config');

  return {
    url: config?.analyticsUrl ?? ANALYTICS_API_URL,
    headers: {
      'OnchainKit-App-Name': document.title,
    },
    body: {
      apiKey: getOnchainKitConfig('apiKey') ?? 'undefined',
      sessionId: getOnchainKitConfig('sessionId') ?? 'undefined',
      timestamp: Date.now(),
      eventType: event,
      data,
    },
  };
};

export function sendAnalyticsPayload<T extends AnalyticsEvent>(
  event: T,
  data: AnalyticsEventData[T],
): void {
  // Don't send analytics if disabled
  const config = getOnchainKitConfig('config');

  if (!config?.analytics) {
    return;
  }
  const payload = prepareAnalyticsPayload(event, data);
  sendAnalytics(payload);
}

/**
 * useAnalytics handles analytics events and data preparation
 */
export const useAnalytics = () => {
  return {
    sendAnalytics: sendAnalyticsPayload,
  };
};
