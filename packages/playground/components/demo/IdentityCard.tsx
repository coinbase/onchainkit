'use client';

import { IdentityCard } from '@coinbase/onchainkit/identity';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { base, mainnet } from 'viem/chains';
import { useAccount } from 'wagmi';

export function IdentityCardDemo() {
  const { address } = useAccount();

  return (
    <div className="mx-auto max-w-2xl p-4">
      {address ? (
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">
              Mainnet Identity
            </h2>

            <IdentityCard address={address} chain={mainnet} />
          </div>
          <div className="space-y-2">
            <h2 className="font-medium text-gray-500 text-sm">Base Identity</h2>
            <IdentityCard address={address} chain={base} />
          </div>
        </div>
      ) : (
        <div className="space-y-2 items-center flex flex-col">
          <div className="mb-5 italic">
            Connect wallet to view identity cards
          </div>
          <ConnectWallet />
        </div>
      )}
    </div>
  );
}
