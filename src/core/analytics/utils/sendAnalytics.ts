import { JSON_HEADERS } from '@/core/network/constants';

export type AnalyticsRequestParams = {
  url: string;
  headers: Record<string, string>;
  body: {
    apiKey: string;
    sessionId: string;
    timestamp: number;
    eventType: string;
    data: Record<string, unknown>;
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
