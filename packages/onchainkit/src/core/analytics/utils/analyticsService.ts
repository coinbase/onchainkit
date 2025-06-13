import { getOnchainKitConfig } from '@/core/OnchainKitConfig';
import { ANALYTICS_API_URL } from '@/core/analytics/constants';
import type {
  AnalyticsEvent,
  AnalyticsEventData,
} from '@/core/analytics/types';

import { JSON_HEADERS } from '@/core/network/constants';

export type ClientMeta = {
  mode: 'onchainkit' | 'minikit';
  clientFid: number | null;
  ockVersion: string;
};

class AnalyticsService {
  public clientMeta: ClientMeta | null = null;

  public setClientMeta(meta: ClientMeta) {
    this.clientMeta = meta;
  }

  public async sendAnalytics<T extends AnalyticsEvent>(
    event: T,
    data: AnalyticsEventData[T],
  ) {
    const config = getOnchainKitConfig('config');

    // Don't send analytics if disabled
    if (!config?.analytics) {
      return;
    }

    try {
      await fetch(config?.analyticsUrl ?? ANALYTICS_API_URL, {
        method: 'POST',
        headers: {
          ...JSON_HEADERS,
          'OnchainKit-App-Name': document.title,
        },
        body: JSON.stringify(this.buildBody(event, data)),
      });
    } catch (error) {
      // Silently fail
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error sending analytics:', error);
      }
    }
  }

  private buildBody<T extends AnalyticsEvent>(
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
      metadata: this.clientMeta,
    };
  }
}

export const analyticsService = new AnalyticsService();

export const sendAnalyticsPayload = <T extends AnalyticsEvent>(
  event: T,
  data: AnalyticsEventData[T],
) => analyticsService.sendAnalytics(event, data);
