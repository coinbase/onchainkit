import { useValue } from '@/internal/hooks/useValue';
import { usdcToken } from '@/token/constants';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { createContext, useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import type { EarnContextType, EarnProviderReact } from '../types';

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({ vaultAddress, children }: EarnProviderReact) {
  const { address } = useAccount();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const { convertedBalance } = useGetTokenBalance(address, usdcToken);

  const value = useValue({
    convertedBalance,
    vaultAddress,
    depositAmount,
    setDepositAmount,
    withdrawAmount,
    setWithdrawAmount,
    // TODO: update when we have logic to fetch deposited amount
    depositedAmount: '',
    // TODO: update when we have logic to fetch apy
    apy: '',
    // TODO: update when we have logic to fetch interest
    interest: '',
    withdrawCalls: [],
    depositCalls: [],
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
