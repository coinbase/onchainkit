import { http } from 'viem';
import { createPublicClient } from 'viem';
import type { Address } from 'viem';
import { optimism } from 'viem/chains';
import { ID_REGISTRY_ABI } from '../constants';
import { ID_REGISTRY_ADDRESS } from '../constants';
import { useEffect, useState } from 'react';

const client = createPublicClient({
  chain: optimism,
  transport: http(),
});

export function useFid(address?: Address) {
  const [fid, setFid] = useState<number | null>(null);

  useEffect(() => {
    async function getFid() {
      if (!address) {
        return;
      }

      const resolvedFid = await client.readContract({
        address: ID_REGISTRY_ADDRESS,
        abi: ID_REGISTRY_ABI,
        functionName: 'idOf',
        args: [address],
      });

      setFid(Number(resolvedFid));
    }

    getFid();
  }, [address]);

  return fid;
}
