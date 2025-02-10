import { getToken } from '@/earn/utils/getToken';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useValue } from '@/internal/hooks/useValue';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useAccount } from 'wagmi';
import { useBuildMorphoDepositTx } from '../hooks/useBuildMorphoDepositTx';
import { useBuildMorphoWithdrawTx } from '../hooks/useBuildMorphoWithdrawTx';
import { useMorphoVault } from '../hooks/useMorphoVault';
import type {
  EarnContextType,
  EarnProviderReact,
  LifecycleStatus,
} from '../types';

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({ vaultAddress, children }: EarnProviderReact) {
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

  const {
    asset,
    assetDecimals,
    assetSymbol,
    balance: receiptBalance,
    balanceStatus: receiptBalanceStatus,
    refetchBalance: refetchReceiptBalance,
    totalApy,
    nativeApy,
    vaultFee,
    name,
    deposits,
    liquidity,
    rewards,
  } = useMorphoVault({
    vaultAddress,
    address,
  });

  const vaultToken = asset
    ? getToken({
        address: asset,
        symbol: assetSymbol,
        name: assetSymbol,
        decimals: assetDecimals,
      })
    : undefined;

  const {
    convertedBalance: underlyingBalance,
    status: underlyingBalanceStatus,
    refetch: refetchUnderlyingBalance,
  } = useGetTokenBalance(address, vaultToken);

  const { calls: withdrawCalls } = useBuildMorphoWithdrawTx({
    vaultAddress,
    amount: withdrawAmount,
    receiverAddress: address,
  });

  const { calls: depositCalls } = useBuildMorphoDepositTx({
    vaultAddress,
    amount: depositAmount,
    receiverAddress: address,
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
    if (Number(depositAmount) > Number(underlyingBalance)) {
      return 'Amount exceeds the balance';
    }
    return null;
  }, [depositAmount, underlyingBalance]);

  const withdrawAmountError = useMemo(() => {
    if (!withdrawAmount) {
      return null;
    }
    if (Number(withdrawAmount) === 0) {
      return 'Must be greater than 0';
    }
    if (Number(withdrawAmount) > Number(receiptBalance)) {
      return 'Amount exceeds the balance';
    }
    return null;
  }, [withdrawAmount, receiptBalance]);

  const value = useValue<EarnContextType>({
    recipientAddress: address,
    vaultAddress,
    vaultToken,
    vaultName: name,
    deposits,
    liquidity,
    receiptBalance,
    receiptBalanceStatus,
    refetchReceiptBalance,
    depositAmount,
    setDepositAmount: handleDepositAmount,
    depositAmountError,
    withdrawAmount,
    setWithdrawAmount: handleWithdrawAmount,
    withdrawAmountError,
    underlyingBalance,
    underlyingBalanceStatus,
    refetchUnderlyingBalance,
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
