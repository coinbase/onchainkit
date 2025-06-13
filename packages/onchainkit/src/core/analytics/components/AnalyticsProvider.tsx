import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import {
  sendAnalyticsPayload,
  analyticsService,
} from '@/core/analytics/utils/analyticsService';
import { MiniKitContext } from '@/minikit/MiniKitProvider';
import sdk from '@farcaster/frame-sdk';
import { version } from '@/version';
import { AnalyticsEvent, AnalyticsEventData } from '../types';

type AnalyticsContextType = {
  sendAnalytics: <T extends AnalyticsEvent>(
    event: T,
    data: AnalyticsEventData[T],
  ) => void;
};

export const AnalyticsContext = createContext<AnalyticsContextType>({
  sendAnalytics: () => {},
});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { __isMiniKit } = useContext(MiniKitContext);
  const hasInit = useRef(false);

  const contextValue = useMemo<AnalyticsContextType>(() => {
    return {
      sendAnalytics: (event, data) => {
        sendAnalyticsPayload(event, data);
      },
    };
  }, []);

  useEffect(() => {
    async function handleInit() {
      if (hasInit.current) return;

      hasInit.current = true;

      const context = await sdk.context;

      analyticsService.setClientMeta({
        mode: __isMiniKit ? 'minikit' : 'onchainkit',
        clientFid: context?.client?.clientFid || null,
        ockVersion: version,
      });
    }

    handleInit();
  }, [__isMiniKit]);

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}
