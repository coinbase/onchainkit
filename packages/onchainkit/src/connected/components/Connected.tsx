import { ReactNode } from 'react';
import { ConnectWallet } from '@/wallet';
import { useAccount } from 'wagmi';

export type ConnectedProps = {
  /**
   * The content to render when there is a connected account.
   */
  children: ReactNode;
  /**
   * The content to render when there is no connected account.
   * If undefined, defaults to `<ConnectWallet />`. Pass `null` to render nothing.
   */
  fallback?: ReactNode;
  /**
   * If defined, the content to render when there is no connected account
   * and `useAccount().status` is "connecting".
   */
  connecting?: ReactNode;
};

/**
 * Renders children only when there is no currently connected account.
 * Otherwise, renders the fallback.
 */
export function Connected({
  children,
  fallback,
  connecting,
}: ConnectedProps): ReactNode {
  const { address, isConnecting } = useAccount();

  if (!address && isConnecting && connecting !== undefined) {
    return connecting;
  }

  if (!address) {
    return fallback === undefined ? <ConnectWallet /> : fallback;
  }

  return <>{children}</>;
}
