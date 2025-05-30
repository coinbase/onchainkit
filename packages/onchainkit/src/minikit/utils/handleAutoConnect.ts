import { sdk } from '@farcaster/frame-sdk';
import { Connector } from 'wagmi';

export async function handleAutoConnect({
  isConnected,
  isConnecting,
  connectors,
  connect,
}: {
  isConnected: boolean;
  isConnecting: boolean;
  connectors: readonly Connector[];
  connect: (options: { connector: Connector }) => void;
}) {
  const isInMiniApp = await sdk.isInMiniApp();

  if (!isInMiniApp || isConnected || isConnecting) return;

  const connector = connectors[0];

  if (!connector) {
    console.error('Failed to find connector');
    return;
  }

  connect({ connector });
}
