import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import { type Address, erc20Abi, formatUnits } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';

type UseMorphoVaultParams = {
  vaultAddress: Address;
  address: Address;
};

export type UseMorphoVaultReturnType = {
  status: 'pending' | 'success' | 'error';
  asset: Address | undefined;
  assetDecimals: number | undefined;
  vaultDecimals: number | undefined;
  name: string | undefined;
  balance: string | undefined;
};

export function useMorphoVault({
  vaultAddress,
  address,
}: UseMorphoVaultParams): UseMorphoVaultReturnType {
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
      {
        abi: MORPHO_VAULT_ABI,
        address: vaultAddress,
        functionName: 'decimals',
      },
    ],
  });

  const { data: tokenDecimals } = useReadContract({
    abi: erc20Abi,
    address: data?.[0].result,
    functionName: 'decimals',
  });

  const formattedBalance =
    data?.[2].result && data?.[3].result
      ? formatUnits(data?.[2].result, data?.[3].result)
      : undefined;

  return {
    status,
    asset: data?.[0].result,
    assetDecimals: tokenDecimals,
    vaultDecimals: data?.[3].result,
    name: data?.[1].result,
    balance: formattedBalance,
  };
}
