import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import { MORPHO_TOKEN_BASE_ADDRESS } from '@/earn/constants';
import calculateMorphoRewards from '@/earn/utils/calculateMorphoRewards';
import { fetchMorphoApy } from '@/earn/utils/fetchMorphoApy';
import { useQuery } from '@tanstack/react-query';
import { type Address, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { useReadContract, useReadContracts } from 'wagmi';

type UseMorphoVaultParams = {
  vaultAddress: Address;
  address?: Address;
};

export type UseMorphoVaultReturnType = {
  status: 'pending' | 'success' | 'error';
  balanceStatus: 'pending' | 'success' | 'error';
  refetchBalance: () => void;
  asset: Address | undefined;
  assetSymbol: string | undefined;
  assetDecimals: number | undefined;
  vaultDecimals: number | undefined;
  name: string | undefined;
  /** Balance adjusted for decimals */
  balance: string | undefined;
  totalApy: number | undefined;
  nativeApy: number | undefined;
  vaultFee: number | undefined;
  deposits: string | undefined;
  liquidity: string | undefined;
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
        chainId: base.id, // Only Base is supported
      },
      {
        abi: MORPHO_VAULT_ABI,
        address: vaultAddress,
        functionName: 'name',
        chainId: base.id, // Only Base is supported
      },
      {
        abi: MORPHO_VAULT_ABI,
        address: vaultAddress,
        functionName: 'decimals',
        chainId: base.id, // Only Base is supported
      },
    ],
    query: {
      enabled: !!vaultAddress,
    },
  });
  const asset = data?.[0].result;
  const name = data?.[1].result;
  const vaultDecimals = data?.[2].result;

  // Fetching separately because user may not be connected
  const {
    data: balance,
    status: balanceStatus,
    refetch,
  } = useReadContract({
    abi: MORPHO_VAULT_ABI,
    address: vaultAddress,
    functionName: 'maxWithdraw',
    args: [address as Address],
    chainId: base.id, // Only Base is supported
    query: {
      enabled: !!vaultAddress && !!address,
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
    balance && vaultData?.asset.decimals
      ? formatUnits(balance, vaultData?.asset.decimals)
      : undefined;
  console.log('formattedBalance:', formattedBalance);

  const formattedDeposits =
    vaultData?.state.totalAssets && vaultData.asset.decimals
      ? formatUnits(
          BigInt(vaultData?.state.totalAssets),
          vaultData.asset.decimals,
        )
      : undefined;

  const formattedLiquidity =
    vaultData?.liquidity.underlying && vaultData.asset.decimals
      ? formatUnits(
          BigInt(vaultData?.liquidity.underlying),
          vaultData.asset.decimals,
        )
      : undefined;

  return {
    status,
    /** Balance is the amount of the underlying asset that the user has in the vault */
    balance: formattedBalance,
    balanceStatus,
    refetchBalance: refetch,
    asset,
    assetSymbol: vaultData?.symbol,
    assetDecimals: vaultData?.asset?.decimals,
    vaultDecimals,
    name,
    totalApy: vaultData?.state?.netApy,
    nativeApy: vaultData?.state?.netApyWithoutRewards,
    vaultFee: vaultData?.state?.fee,
    deposits: formattedDeposits,
    liquidity: formattedLiquidity,
    rewards: [
      {
        asset: MORPHO_TOKEN_BASE_ADDRESS,
        assetName: 'MORPHO',
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
