import { useOnchainKit } from '@/core-react/useOnchainKit';
import { sendAnalytics } from '@/core/network/sendAnalytics';
import {
  AnalyticsEvent,
  AnalyticsEventData,
} from '@/core-react/internal/types';

export const useAnalytics = () => {
  const { apiKey } = useOnchainKit();
  const appName = typeof window !== 'undefined' ? document.title : 'unknown';

  return {
    sendAnalytics: (
      event: AnalyticsEvent,
      data: AnalyticsEventData[AnalyticsEvent],
    ) => {
      sendAnalytics({ event, data, appName, apiKey });
    },
  };
};
