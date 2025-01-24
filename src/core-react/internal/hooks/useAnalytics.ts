import { sendAnalytics } from '@/core/network/sendAnalytics';
import type { AnalyticsEvent, AnalyticsEventData } from '@/internal/types';
import { useOnchainKit } from '@/useOnchainKit';
import { useEffect, useState } from 'react';

export const useAnalytics = () => {
  const { apiKey, interactionId, config } = useOnchainKit();
  const [appName, setAppName] = useState('');

  useEffect(() => {
    setAppName(document.title);
  }, []);

  return {
    sendAnalytics: (
      event: AnalyticsEvent,
      data: AnalyticsEventData[AnalyticsEvent],
    ) => {
      sendAnalytics({
        analyticsUrl: config?.analyticsUrl ?? undefined,
        appName,
        apiKey,
        data,
        event,
        interactionId,
      });
    },
    generateInteractionId: () => {
      return crypto.randomUUID();
    },
  };
};
