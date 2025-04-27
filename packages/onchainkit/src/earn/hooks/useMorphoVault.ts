'use client';
import { MORPHO_VAULT_ABI } from '@/earn/abis/morpho';
import { MORPHO_TOKEN_BASE_ADDRESS } from '@/earn/constants';
import calculateMorphoRewards from '@/earn/utils/calculateMorphoRewards';
import { fetchMorphoApy } from '@/earn/utils/fetchMorphoApy';
import { useQuery } from '@tanstack/react-query';
import { type Address, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { useReadContract, useReadContracts } from 'wagmi';

export type UseMorphoVaultParams = {
  vaultAddress: Address;
  recipientAddress?: Address;
};

export type UseMorphoVaultReturnType = {
  vaultName: string | undefined;
  status: 'pending' | 'success' | 'error';
  /** Warns users if vault address is invalid */
  error: Error | null;
  /** Underlying asset of the vault */
  asset: {
    address: Address;
    symbol: string | undefined;
    decimals: number | undefined;
  };
  /** User's deposits in the vault, adjusted for decimals */
  balance: string | undefined;
  balanceStatus: 'pending' | 'success' | 'error';
  refetchBalance: () => void;
  /** Total net APY of the vault after all rewards and fees */
  totalApy: number | undefined;
  /** Native rewards of the vault (e.g. USDC if the asset is USDC) */
  nativeApy: number | undefined;
  /** Additional rewards (e.g. MORPHO) */
  rewards:
    | Array<{
        asset: Address;
        assetName: string;
        apy: number;
      }>
    | undefined;
  /** Vault fee, in percent (e.g. 0.03 for 3%) */
  vaultFee: number | undefined;
  /** Number of decimals of the vault's share tokens (not underlying asset) */
  vaultDecimals: number | undefined;
  /** Total deposits in the vault */
  deposits: string | undefined;
  /** Total liquidity available to borrow in the vault */
  liquidity: string | undefined;
};

// eslint-disable-next-line complexity
export function useMorphoVault({
  vaultAddress,
  recipientAddress,
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

  const assetAddress = data?.[0].result;
  const vaultName = data?.[1].result;
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
    args: [recipientAddress as Address],
    chainId: base.id, // Only Base is supported
    query: {
      enabled: !!vaultAddress && !!recipientAddress,
    },
  });

  const { data: vaultData, error } = useQuery({
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
    error,
    /** Balance is the amount of the underlying asset that the user has in the vault */
    balance: formattedBalance,
    balanceStatus,
    refetchBalance: refetch,
    asset: {
      address: assetAddress as Address,
      symbol: vaultData?.symbol,
      decimals: vaultData?.asset.decimals,
    },
    vaultName,
    vaultDecimals,
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
