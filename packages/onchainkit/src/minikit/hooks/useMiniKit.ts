import { MiniKitContext, emptyContext } from '@/minikit/MiniKitProvider';
import sdk from '@farcaster/frame-sdk';
import { useContext, useState } from 'react';
import type { MiniKitContextType } from '../types';
import type { ReadyOptions } from '@farcaster/frame-sdk';

type UseMiniKitReturn = {
  setFrameReady: (
    readyOptions?: Partial<ReadyOptions>,
  ) => Promise<MiniKitContextType>;
  isFrameReady: boolean;
  context: MiniKitContextType['context'];
  updateClientContext: MiniKitContextType['updateClientContext'];
  notificationProxyUrl: MiniKitContextType['notificationProxyUrl'];
};

/**
 * Allows for the use of the MiniKit context.
 * @returns The MiniKitContext object, consisting of:
 * - `setFrameReady` - A function to set the frame as ready, which will hide the splash screen.
 * - `isFrameReady` - A boolean indicating if the frame has been set as ready.
 * - `context` - The MiniKit context.
 * - `updateClientContext` - A function to update the client context.
 * - `notificationProxyUrl` - The notification proxy URL.
 */
export const useMiniKit = (): UseMiniKitReturn => {
  const [isFrameReady, setIsFrameReady] = useState(false);
  const context = useContext(MiniKitContext);
  if (context === emptyContext) {
    throw new Error('useMiniKit must be used within a MiniKitProvider');
  }

  const setFrameReady = async (readyOptions: Partial<ReadyOptions> = {}) => {
    sdk.actions.ready(readyOptions);
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
