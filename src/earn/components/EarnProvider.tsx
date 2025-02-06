import { getToken } from '@/earn/utils/getToken';
import { useValue } from '@/internal/hooks/useValue';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { createContext, useCallback, useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { useBuildMorphoDepositTx } from '../hooks/useBuildMorphoDepositTx';
import { useBuildMorphoWithdrawTx } from '../hooks/useBuildMorphoWithdrawTx';
import { useMorphoVault } from '../hooks/useMorphoVault';
import type {
  EarnContextType,
  EarnProviderReact,
  LifecycleStatus,
} from '../types';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';

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

  const { asset, assetDecimals, assetSymbol, balance, totalApy } =
    useMorphoVault({
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

  const { convertedBalance } = useGetTokenBalance(address, vaultToken);

  const { calls: withdrawCalls } = useBuildMorphoWithdrawTx({
    vaultAddress,
    amount: Number(withdrawAmount),
    receiverAddress: address,
  });

  const { calls: depositCalls } = useBuildMorphoDepositTx({
    vaultAddress,
    amount: Number(depositAmount),
    receiverAddress: address,
  });

  // Lifecycle statuses
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

  const value = useValue<EarnContextType>({
    address,
    convertedBalance,
    vaultAddress,
    vaultToken,
    depositAmount,
    setDepositAmount: handleDepositAmount,
    withdrawAmount,
    setWithdrawAmount: handleWithdrawAmount,
    depositedAmount: balance,
    apy: totalApy,
    // TODO: update when we have logic to fetch interest
    interest: '',
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
