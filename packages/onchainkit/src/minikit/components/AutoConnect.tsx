'use client';
import sdk from '@farcaster/frame-sdk';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useConnect, useAccount } from 'wagmi';

/**
 * Automatically connects to the Farcaster connector if the user is in a Mini App
 */
export function AutoConnect({ children }: PropsWithChildren) {
  const { isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const hasAttemptedConnection = useRef(false);
  const connector = connectors[0];

  useEffect(() => {
    if (
      hasAttemptedConnection.current ||
      connector?.type !== farcasterFrame.type
    ) {
      return;
    }

    hasAttemptedConnection.current = true;

    async function handleAutoConnect() {
      const isInMiniApp = await sdk.isInMiniApp();

      if (!isInMiniApp || isConnected || isConnecting) return;

      connect({ connector });
    }

    handleAutoConnect();
  }, [connectors, connect, isConnected, isConnecting, connector]);

  return <>{children}</>;
}
