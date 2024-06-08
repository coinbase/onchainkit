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
  }, [disconnect]);

  const ConnectedChildren = () => {
    // Children can be utilized to display customized content when the wallet is connected.
    if (children) {
      return children;
    }
    return <div onClick={handleDisconnectWallet}>Connected wallet: {address}</div>;
  };

  return (
    <div className="ock-connectaccount" data-testid="ockConnectAccountButton">
      {(() => {
        if (status === 'disconnected' || status === 'connecting') {
          return (
            <button
              className="ock-connectaccount-button"
              onClick={() => connect({ connector })}
              type="button"
            >
              <div className="ock-connectaccount-inner" data-testid="ockConnectAccountButtonInner">
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
