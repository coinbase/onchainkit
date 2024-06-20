'use client';
import { Avatar } from '@coinbase/onchainkit/identity';
import { ConnectAccount } from '@coinbase/onchainkit/wallet';
import { useAccount, useDisconnect } from 'wagmi';

function AccountConnect() {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return null;
  }
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-grow">
      {(() => {
        if (['disconnected', 'connecting'].includes(status)) {
          return <ConnectAccount />;
        }

        return (
          <div className="flex h-8 w-8 items-center justify-center">
            {address && (
              <button type="button" onClick={() => disconnect()}>
                <Avatar address={address} />
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export default AccountConnect;
