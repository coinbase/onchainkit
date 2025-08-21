import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { ConnectWallet, ConnectWalletProps } from '@/wallet';

type ConnectWalletFallbackProps = Omit<
  ConnectWalletProps,
  keyof ConnectedBaseProps<undefined>
>;

type ConnectedBaseProps<TFallback extends ReactNode | undefined> = {
  /**
   * The content to render when there is a connected account.
   */
  children: ReactNode;
  /**
   * The content to render when there is no connected account.
   * If undefined, defaults to rendering the `<ConnectWallet />` button.
   * Pass `null` to render nothing.
   */
  fallback?: TFallback;
  /**
   * If defined, the content to render when there is no connected account
   * and `useAccount().status` is "connecting".
   */
  connecting?: ReactNode;
};

export type ConnectedProps<
  TFallback extends ReactNode | undefined = undefined,
> = TFallback extends undefined
  ? ConnectedBaseProps<TFallback> & ConnectWalletFallbackProps
  : ConnectedBaseProps<TFallback>;

/**
 * Renders children only when there is no currently connected account.
 * Otherwise, renders the fallback.
 *
 * If no fallback is provided, the `<ConnectWallet />` button is rendered and
 * this component will accept passthrough props to forward to the `<ConnectWallet />` button.
 */
export function Connected<TFallback extends ReactNode | undefined = undefined>({
  children,
  fallback,
  connecting,
}: ConnectedProps<TFallback>): ReactNode {
  const { address, isConnecting } = useAccount();

  if (!address && isConnecting && connecting !== undefined) {
    return connecting;
  }

  if (!address) {
    return fallback === undefined ? <ConnectWallet /> : fallback;
  }

  return <>{children}</>;
}
