import { http } from 'viem';
import { createPublicClient } from 'viem';
import type { Address } from 'viem';
import { optimism } from 'viem/chains';
import { ID_REGISTRY_ABI } from '../constants';
import { ID_REGISTRY_ADDRESS } from '../constants';

export function useGetFid() {
  return async function getFid(address: Address) {
    const client = createPublicClient({
      chain: optimism,
      transport: http(),
    });

    // query the ID Registry contract for the fids custody address
    const resolvedFid = await client.readContract({
      address: ID_REGISTRY_ADDRESS,
      abi: ID_REGISTRY_ABI,
      functionName: 'idOf',
      args: [address],
    });

    return Number(resolvedFid);
  };
}
