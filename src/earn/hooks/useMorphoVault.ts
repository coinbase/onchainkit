import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import type { Address } from 'viem';

import { useReadContracts } from 'wagmi';

export function useMorphoVault({ vaultAddress }: { vaultAddress: Address }) {
  return useReadContracts({
    contracts: [
      {
        abi: MORPHO_VAULT_ABI,
        address: vaultAddress,
        functionName: 'asset',
      },
    ],
  });
}
