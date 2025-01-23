import type {
  AnalyticsEvent,
  AnalyticsEventData,
} from '@/core-react/internal/types';
import { useOnchainKit } from '@/core-react/useOnchainKit';
import { sendAnalytics } from '@/core/network/sendAnalytics';
import { useEffect, useState } from 'react';

export const useAnalytics = () => {
  const { apiKey, interactionId } = useOnchainKit();
  const [appName, setAppName] = useState('');

  useEffect(() => {
    setAppName(document.title);
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
