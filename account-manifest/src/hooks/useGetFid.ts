import { http } from 'viem';
import { createPublicClient } from 'viem';
import type { Address } from 'viem';
import { optimism } from 'viem/chains';

// ID Registry Contract
const ID_REGISTRY_ADDRESS = '0x00000000Fc6c5F01Fc30151999387Bb99A9f489b';
const ID_REGISTRY_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'idOf',
    outputs: [{ internalType: 'uint256', name: 'fid', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// TODO: will delegate accounts exist on the ID registry linked to an FID?

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
