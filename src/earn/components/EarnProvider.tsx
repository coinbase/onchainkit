import { useValue } from '@/core-react/internal/hooks/useValue';
import { createContext, useContext, useState } from 'react';
import type { EarnContextType, EarnProviderReact } from '../types';
import { usdcToken } from '@/token/constants';
import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { useAccount } from 'wagmi';

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
    // TODO: update when we have deposited logic
    depositedAmount: '100',
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
