import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import { erc20Abi, type Address } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';

export function useMorphoVault({
  vaultAddress,
  address,
}: { vaultAddress: Address; address: Address }) {
  const { data, status } = useReadContracts({
    contracts: [
      {
        abi: MORPHO_VAULT_ABI,
        address: vaultAddress,
        functionName: 'asset',
      },
      {
        abi: MORPHO_VAULT_ABI,
        address: vaultAddress,
        functionName: 'name',
      },
      {
        abi: MORPHO_VAULT_ABI,
        address: vaultAddress,
        functionName: 'balanceOf',
        args: [address],
      },
    ],
  });

  const { data: tokenDecimals } = useReadContract({
    abi: erc20Abi,
    address: data?.[0].result,
    functionName: 'decimals',
  });

  return {
    status,
    asset: data?.[0].result,
    assetDecimals: tokenDecimals,
    name: data?.[1].result,
    balance: data?.[2].result,
  };
}
