import type {
  AnalyticsEvent,
  AnalyticsEventData,
} from '@/core-react/internal/types';
import { useOnchainKit } from '@/core-react/useOnchainKit';
import { sendAnalytics } from '@/core/network/sendAnalytics';
import { useMemo } from 'react';

export const useAnalytics = () => {
  const { apiKey, interactionId } = useOnchainKit();
  const appName = useMemo(() => {
    return document.title;
  }, []);

  return {
    sendAnalytics: (
      event: AnalyticsEvent,
      data: AnalyticsEventData[AnalyticsEvent],
    ) => {
      sendAnalytics({ event, data, appName, apiKey, interactionId });
    },
    generateInteractionId: () => {
      return crypto.randomUUID();
    },
  };
};
