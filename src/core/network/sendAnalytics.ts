import { JSON_HEADERS } from '@/core/network/constants';

interface AnalyticsParams {
  event: string;
  data: any;
  appName: string;
  apiKey: string | null;
}

export const sendAnalytics = async ({
  event,
  data,
  appName,
  apiKey,
}: AnalyticsParams) => {
  try {
    await fetch('https://cloud-api-dev.cbhq.net/analytics', {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        'OnchainKit-App-Name': appName,
      },
      body: JSON.stringify({
        apiKey: apiKey ?? 'undefined',
        eventType: event,
        data,
      }),
    });
  } catch (error) {
    // Silently fail
    console.debug('Error sending analytics:', error);
  }
};
