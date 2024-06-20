import { useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import type { ConnectAccountReact } from '../types';

/**
 * ConnectAccount
 *  - Connects to the wallet
 *  - Disconnects from the wallet
 *  - Displays the wallet network
 */
export function ConnectAccount({ children }: ConnectAccountReact) {
  const { address, status } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  const handleDisconnectWallet = useCallback(() => {
    disconnect({ connector });
  }, [connector, disconnect]);

  const ConnectedChildren = () => {
    // Children can be utilized to display customized content
    // when the wallet is connected.
    if (children) {
      return children;
    }
    return (
      /* biome-ignore lint: code needs to be refactored */
      <div onClick={handleDisconnectWallet}>Connected wallet: {address}</div>
    );
  };

  return (
    <div className="flex grow" data-testid="ockConnectAccount_Container">
      {(() => {
        if (status === 'disconnected' || status === 'connecting') {
          return (
            <button
              className="inline-flex h-10 grow items-center justify-center gap-2 rounded-3xl bg-white px-4 py-2"
              onClick={() => connect({ connector })}
              type="button"
            >
              <div
                className="font-medium text-black text-sm leading-5"
                data-testid="ockConnectAccountButtonInner"
              >
                Connect wallet
              </div>
            </button>
          );
        }
        return <ConnectedChildren />;
      })()}
    </div>
  );
}
