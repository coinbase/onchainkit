import { useValue } from '@/internal/hooks/useValue';
import { type ReactNode, createContext, useContext } from 'react';
import type { Address } from 'viem';

interface EarnContextType {
  vaultAddress: Address;
}

const EarnContext = createContext<EarnContextType | undefined>(undefined);

interface EarnProviderProps {
  vaultAddress: Address;
  children: ReactNode;
}

export function EarnProvider({ vaultAddress, children }: EarnProviderProps) {
  const value = useValue({
    vaultAddress,
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
