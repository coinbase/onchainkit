import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import { MORPHO_TOKEN_BASE_ADDRESS } from '@/earn/constants';
import calculateMorphoRewards from '@/earn/utils/calculateMorphoRewards';
import { fetchMorphoApy } from '@/earn/utils/fetchMorphoApy';
import { useQuery } from '@tanstack/react-query';
import { type Address, erc20Abi, formatUnits, isAddress } from 'viem';
import { useReadContract, useReadContracts } from 'wagmi';

type UseMorphoVaultParams = {
  vaultAddress: Address;
  address?: Address;
};

export type UseMorphoVaultReturnType = {
  status: 'pending' | 'success' | 'error';
  asset: Address | undefined;
  assetDecimals: number | undefined;
  vaultDecimals: number | undefined;
  name: string | undefined;
  balance: string | undefined;
  totalApy: number | undefined;
  nativeApy: number | undefined;
  rewards:
    | {
        asset: Address;
        assetName: string;
        apy: number;
      }[]
    | undefined;
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
        args: [address as Address],
      },
      {
        abi: MORPHO_VAULT_ABI,
        address: vaultAddress,
        functionName: 'decimals',
      },
    ],
    query: {
      enabled: !!address && isAddress(address),
    },
  });

  const { data: tokenDecimals } = useReadContract({
    abi: erc20Abi,
    address: data?.[0].result,
    functionName: 'decimals',
    query: {
      enabled: !!data?.[0].result,
    },
  });

  const { data: vaultData } = useQuery({
    queryKey: ['morpho-apy', vaultAddress],
    queryFn: () => fetchMorphoApy(vaultAddress),
  });

  const morphoApr = vaultData?.state
    ? calculateMorphoRewards(vaultData?.state)
    : 0;

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
    totalApy: vaultData?.state?.netApy,
    nativeApy: vaultData?.state?.netApyWithoutRewards,
    rewards: [
      {
        asset: MORPHO_TOKEN_BASE_ADDRESS,
        assetName: 'Morpho',
        apy: morphoApr,
      },
      ...(vaultData?.state?.rewards.map((reward) => ({
        asset: reward.asset.address,
        assetName: reward.asset.name,
        apy: reward.supplyApr,
      })) || []),
    ],
  };
}
