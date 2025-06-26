import { getOnchainKitConfig } from '@/core/OnchainKitConfig';
import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import type {
  AnalyticsEvent,
  AnalyticsEventData,
} from '@/core/analytics/types';
import { clientMetaManager } from '@/core/clientMeta/clientMetaManager';

import { JSON_HEADERS } from '@/core/network/constants';

function buildBody<T extends AnalyticsEvent>(
  event: T,
  data: AnalyticsEventData[T],
) {
  return {
    apiKey: getOnchainKitConfig('apiKey') ?? 'undefined',
    sessionId: getOnchainKitConfig('sessionId') ?? 'undefined',
    timestamp: Date.now(),
    eventType: event,
    data,
    origin: window.location.origin,
  };
}

async function handleSendAnalytics<T extends AnalyticsEvent>(
  event: T,
  data: AnalyticsEventData[T],
) {
  const config = getOnchainKitConfig('config');

  // Don't send analytics if disabled
  if (!config?.analytics) {
    return;
  }

  try {
    const clientMeta = await clientMetaManager.getClientMeta();
    await fetch(config?.analyticsUrl ?? ANALYTICS_API_URL, {
      method: 'POST',
      headers: {
        ...JSON_HEADERS,
        'OnchainKit-App-Name': document.title,
        'OnchainKit-Client-Fid': clientMeta.clientFid?.toString() ?? '',
        'OnchainKit-Mode': clientMeta.mode,
      },
      body: JSON.stringify(buildBody(event, data)),
    });
  } catch (error) {
    // Silently fail
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error sending analytics:', error);
    }
  }
}

export const sendAnalyticsPayload = <T extends AnalyticsEvent>(
  event: T,
  data: AnalyticsEventData[T],
) => handleSendAnalytics(event, data);
