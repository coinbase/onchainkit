'use client';
import { MiniKitContext } from '@/minikit/MiniKitProvider';
import sdk from '@farcaster/miniapp-sdk';
import { useContext, useState } from 'react';
import type { MiniKitContextType } from '../types';
import type { ReadyOptions } from '@farcaster/miniapp-sdk';

type SetMiniAppReady = (
  readyOptions?: Partial<ReadyOptions>,
) => Promise<MiniKitContextType>;

type UseMiniKitReturn = {
  context: MiniKitContextType['context'];
  updateClientContext: MiniKitContextType['updateClientContext'];
  notificationProxyUrl: MiniKitContextType['notificationProxyUrl'];
  setMiniAppReady: SetMiniAppReady;
  isMiniAppReady: boolean;
  /** @deprecated Use `setMiniAppReady` instead. This property will be removed in a future version. */
  setFrameReady: SetMiniAppReady;
  /** @deprecated Use `isMiniAppReady` instead. This property will be removed in a future version. */
  isFrameReady: boolean;
};

/**
 * Allows for the use of the MiniKit context.
 * @returns The MiniKitContext object, consisting of:
 * - `setMiniAppReady` - A function to set the mini app as ready, which will hide the splash screen.
 * - `isMiniAppReady` - A boolean indicating if the mini app has been set as ready.
 * - `context` - The MiniKit context.
 * - `updateClientContext` - A function to update the client context.
 * - `notificationProxyUrl` - The notification proxy URL.
 * - `setFrameReady` - @deprecated Use `setMiniAppReady` instead. This property will be removed in a future version.
 * - `isFrameReady` - @deprecated Use `isMiniAppReady` instead. This property will be removed in a future version.
 */
export const useMiniKit = (): UseMiniKitReturn => {
  const [isMiniAppReady, setIsMiniAppReady] = useState(false);
  const context = useContext(MiniKitContext);

  if (!context.enabled) {
    throw new Error(
      'MiniKit is not enabled. Please check your OnchainKitProvider.',
    );
  }

  const setMiniAppReady = async (readyOptions: Partial<ReadyOptions> = {}) => {
    sdk.actions.ready(readyOptions);
    setIsMiniAppReady(true);
    return context;
  };

  return {
    setMiniAppReady,
    isMiniAppReady,
    context: context.context,
    updateClientContext: context.updateClientContext,
    notificationProxyUrl: context.notificationProxyUrl,
    setFrameReady: setMiniAppReady,
    isFrameReady: isMiniAppReady,
  };
};
