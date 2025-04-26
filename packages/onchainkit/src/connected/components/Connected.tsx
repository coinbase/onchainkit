import { ReactNode } from 'react';
import { ConnectWallet } from '@/wallet';
import { useAccount } from 'wagmi';

export type ConnectedProps = {
  /** The component to render when the user is connected. */
  children: ReactNode;
  /** The component to render when the user is not connected. Defaults to <ConnectWallet />. */
  fallback?: ReactNode;
};

/**
 * Renders children only when the user has connected their wallet.
 * Otherwise, renders the fallback.
 */
export function Connected({
  children,
  fallback = <ConnectWallet />,
}: ConnectedProps) {
  const account = useAccount();

  if (!account.isConnected) {
    return fallback;
  }

  return <>{children}</>;
}
