'use client';

import { BuilderScoreCard } from '@coinbase/onchainkit/identity';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';

export function BuilderScoreCardDemo() {
  const { address } = useAccount();

  if (!address) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="font-medium text-gray-500 text-sm">Builder Score</h2>
          <BuilderScoreCard address={address} chain={base} />
        </div>
      </div>
    </div>
  );
}
