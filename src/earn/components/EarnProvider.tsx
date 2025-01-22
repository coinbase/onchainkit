import { createContext, useContext, useState } from 'react';
import { EarnContextType, EarnProviderReact } from '../types';
import { useValue } from '@/core-react/internal/hooks/useValue';

const emptyContext = {} as EarnContextType;

const EarnContext = createContext<EarnContextType>(emptyContext);

export function EarnProvider({ children }: EarnProviderReact) {
  const [selectedTab, setSelectedTab] = useState('Deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const value = useValue({
    selectedTab,
    setSelectedTab,
    depositAmount,
    setDepositAmount,
    withdrawAmount,
    setWithdrawAmount,
  });

  return <EarnContext.Provider value={value}>{children}</EarnContext.Provider>;
}

export function useEarnContext() {
  return useContext(EarnContext);
}
