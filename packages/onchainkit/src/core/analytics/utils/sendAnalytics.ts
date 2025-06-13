import { JSON_HEADERS } from '@/core/network/constants';
import { getOnchainKitConfig } from '@/core/OnchainKitConfig';
import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import type {
  AnalyticsEvent,
  AnalyticsEventData,
} from '@/core/analytics/types';

export type AnalyticsRequestParams = {
  url: string;
  headers: Record<string, string>;
  body: {
    apiKey: string;
    sessionId: string;
    timestamp: number;
    eventType: string;
    data: Record<string, unknown>;
    origin: string;
  };
};

/**
 * sendAnalytics sends telemetry data to the specified server endpoint.
 */
export const sendAnalytics = async (request: AnalyticsRequestParams) => {
  try {
    await fetch(request.url, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        ...request.headers,
      },
      body: JSON.stringify(request.body),
    });
  } catch (error) {
    // Silently fail
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error sending analytics:', error);
    }
  }
};

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
      origin: window.location.origin,
    },
  };
};

export function sendOCKAnalyticsEvent<T extends AnalyticsEvent>(
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
