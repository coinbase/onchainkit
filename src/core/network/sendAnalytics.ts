import { ANALYTICS_API_URL, JSON_HEADERS } from '@/core/network/constants';

interface AnalyticsParams {
  analyticsUrl?: string;
  appName: string;
  apiKey: string | null;
  data: Record<string, unknown>;
  event: string;
  interactionId: string | null;
}

export const sendAnalytics = async ({
  analyticsUrl = ANALYTICS_API_URL,
  appName,
  apiKey,
  data,
  event,
  interactionId,
}: AnalyticsParams) => {
  try {
    await fetch(analyticsUrl, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        'OnchainKit-App-Name': appName,
      },
      body: JSON.stringify({
        apiKey: apiKey ?? 'undefined',
        interactionId: interactionId ?? 'undefined',
        eventType: event,
        data,
      }),
    });
  } catch (error) {
    // Silently fail
    console.error('Error sending analytics:', error);
  }
};
