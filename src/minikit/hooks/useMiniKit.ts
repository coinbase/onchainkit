import { MiniKitContext, emptyContext } from '@/minikit/MiniKitProvider';
import sdk from '@farcaster/frame-sdk';
import { useContext, useState } from 'react';

export const useMiniKit = () => {
  const [isFrameReady, setIsFrameReady] = useState(false);
  const context = useContext(MiniKitContext);
  if (context === emptyContext) {
    throw new Error('useMiniKit must be used within a MiniKitProvider');
  }

  const setFrameReady = async () => {
    sdk.actions.ready({});
    setIsFrameReady(true);
    return context;
  };

  return {
    setFrameReady,
    isFrameReady,
    context: context.context,
    updateClientContext: context.updateClientContext,
    notificationProxyUrl: context.notificationProxyUrl,
  };
};
