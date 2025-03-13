'use client';
import { useBuildDepositToMorphoTx } from '@/earn/hooks/useBuildDepositToMorphoTx';
import { getToken } from '@/earn/utils/getToken';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useValue } from '@/internal/hooks/useValue';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAccount } from 'wagmi';
import { useBuildWithdrawFromMorphoTx } from '../hooks/useBuildWithdrawFromMorphoTx';
import { useMorphoVault } from '../hooks/useMorphoVault';
import type {
  EarnContextType,
  EarnProviderReact,
  LifecycleStatus,
} from '../types';

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({
  vaultAddress,
  children,
  isSponsored,
  onError,
  onStatus,
  onSuccess,
}: EarnProviderReact) {
  if (!vaultAddress) {
    throw new Error(
      'vaultAddress is required. For a list of vaults, see: https://app.morpho.org/base/earn',
    );
  }

  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: 'init',
      statusData: null,
    });

  const { address } = useAccount();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    if (lifecycleStatus.statusName === 'error') {
      onError?.(lifecycleStatus.statusData);
    }
    if (lifecycleStatus?.statusName === 'success') {
      onSuccess?.(lifecycleStatus?.statusData?.transactionReceipts?.[0]);
    }
    onStatus?.(lifecycleStatus);
  }, [lifecycleStatus, onStatus, onError, onSuccess]);

  const {
    asset,
    balance: depositedBalance,
    balanceStatus: depositedBalanceStatus,
    refetchBalance: refetchDepositedBalance,
    totalApy,
    nativeApy,
    vaultFee,
    vaultName,
    deposits,
    liquidity,
    rewards,
    error,
  } = useMorphoVault({
    vaultAddress,
    recipientAddress: address,
  });

  const vaultToken = asset
    ? getToken({
        address: asset.address,
        symbol: asset.symbol,
        name: asset.symbol,
        decimals: asset.decimals,
      })
    : undefined;

  const {
    convertedBalance: walletBalance,
    status: walletBalanceStatus,
    refetch: refetchWalletBalance,
  } = useGetTokenBalance(address, vaultToken);

  const { calls: depositCalls } = useBuildDepositToMorphoTx({
    vaultAddress,
    amount: depositAmount,
    recipientAddress: address,
  });

  const { calls: withdrawCalls } = useBuildWithdrawFromMorphoTx({
    vaultAddress,
    amount: withdrawAmount,
    recipientAddress: address,
    tokenDecimals: vaultToken?.decimals,
  });

  // Lifecycle statuses
  const handleDepositAmount = useCallback(
    async (amount: string) => {
      updateLifecycleStatus({
        statusName: 'amountChange',
        statusData: { amount: amount, token: vaultToken },
      });

      setDepositAmount(amount);
    },
    [updateLifecycleStatus, vaultToken],
  );

  const handleWithdrawAmount = useCallback(
    async (amount: string) => {
      updateLifecycleStatus({
        statusName: 'amountChange',
        statusData: { amount: amount, token: vaultToken },
      });

      setWithdrawAmount(amount);
    },
    [updateLifecycleStatus, vaultToken],
  );

  // Validating input amounts
  const depositAmountError = useMemo(() => {
    if (!depositAmount) {
      return null;
    }
    if (Number(depositAmount) <= 0) {
      return 'Must be greater than 0';
    }
    if (Number(depositAmount) > Number(walletBalance)) {
      return 'Amount exceeds the balance';
    }
    return null;
  }, [depositAmount, walletBalance]);

  const withdrawAmountError = useMemo(() => {
    if (!withdrawAmount) {
      return null;
    }
    if (Number(withdrawAmount) === 0) {
      return 'Must be greater than 0';
    }
    if (Number(withdrawAmount) > Number(depositedBalance)) {
      return 'Amount exceeds the balance';
    }
    return null;
  }, [withdrawAmount, depositedBalance]);

  const value = useValue<EarnContextType>({
    error,
    recipientAddress: address,
    vaultAddress,
    vaultToken,
    vaultName,
    deposits,
    liquidity,
    depositedBalance,
    depositedBalanceStatus,
    refetchDepositedBalance,
    depositAmount,
    setDepositAmount: handleDepositAmount,
    depositAmountError,
    withdrawAmount,
    setWithdrawAmount: handleWithdrawAmount,
    withdrawAmountError,
    walletBalance,
    walletBalanceStatus,
    refetchWalletBalance,
    apy: totalApy,
    nativeApy,
    vaultFee,
    rewards,
    // TODO: update when we have logic to fetch interest
    interestEarned: '',
    withdrawCalls,
    depositCalls,
    lifecycleStatus,
    updateLifecycleStatus,
    isSponsored,
  });

  return <EarnContext.Provider value={value}>{children}</EarnContext.Provider>;
}

export function useEarnContext() {
  const context = useContext(EarnContext);
  if (!context) {
    throw new Error('useEarnContext must be used within an EarnProvider');
  }
  return context;
}
