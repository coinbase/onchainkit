'use client';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { useIsInMiniApp } from '../hooks/useIsInMiniApp';

const FARCASTER_CONNECTOR_TYPES = new Set([
  'farcasterFrame',
  'farcasterMiniApp',
]);

/**
 * Automatically connects to the Farcaster connector if the user is in a Mini App
 */
export function AutoConnect({
  children,
  enabled = true,
}: PropsWithChildren<{ enabled?: boolean }>) {
  const { isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const hasAttemptedConnection = useRef(false);
  const connector = connectors[0];
  const { isInMiniApp, isSuccess: isInMiniAppSuccess } = useIsInMiniApp();

  useEffect(() => {
    if (
      !enabled ||
      hasAttemptedConnection.current ||
      !FARCASTER_CONNECTOR_TYPES.has(connector?.type) ||
      !isInMiniAppSuccess
    ) {
      return;
    }

    hasAttemptedConnection.current = true;

    async function handleAutoConnect() {
      if (!isInMiniApp || isConnected || isConnecting) return;

      connect({ connector });
    }

    handleAutoConnect();
  }, [
    connectors,
    connect,
    isConnected,
    isConnecting,
    connector,
    enabled,
    isInMiniAppSuccess,
    isInMiniApp,
  ]);

  return <>{children}</>;
}
