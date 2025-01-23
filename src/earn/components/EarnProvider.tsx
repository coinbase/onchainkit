import { useValue } from '@/core-react/internal/hooks/useValue';
import { createContext, useContext, useState } from 'react';
import type { EarnContextType, EarnProviderReact } from '../types';

const EarnContext = createContext<EarnContextType | undefined>(undefined);

export function EarnProvider({ vaultAddress, children }: EarnProviderReact) {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const value = useValue({
    vaultAddress,
    depositAmount,
    setDepositAmount,
    withdrawAmount,
    setWithdrawAmount,
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
