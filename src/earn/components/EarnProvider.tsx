import { useValue } from '@/internal/hooks/useValue';
import { usdcToken } from '@/token/constants';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { createContext, useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { useBuildMorphoDepositTx } from '../hooks/useBuildMorphoDepositTx';
import { useBuildMorphoWithdrawTx } from '../hooks/useBuildMorphoWithdrawTx';
import { useMorphoVault } from '../hooks/useMorphoVault';
import type { EarnContextType, EarnProviderReact } from '../types';

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({ vaultAddress, children }: EarnProviderReact) {
  if (!vaultAddress) {
    throw new Error(
      'vaultAddress is required. For a list of vaults, see: https://app.morpho.org/base/earn',
    );
  }

  const { address } = useAccount();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const { convertedBalance } = useGetTokenBalance(address, usdcToken);

  // TODO: implement
  const {
    asset: _asset,
    balance,
    totalApy,
  } = useMorphoVault({
    vaultAddress,
    address,
  });

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

  const value = useValue({
    address,
    convertedBalance,
    vaultAddress,
    depositAmount,
    setDepositAmount,
    withdrawAmount,
    setWithdrawAmount,
    depositedAmount: balance,
    apy: totalApy,
    // TODO: update when we have logic to fetch interest
    interest: '',
    withdrawCalls,
    depositCalls,
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
