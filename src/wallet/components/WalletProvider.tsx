import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import { useOnchainKit } from '../../useOnchainKit';
import type { WalletContextType } from '../types';

const emptyContext = {} as WalletContextType;

const WalletContext = createContext<WalletContextType>(emptyContext);

type WalletProviderReact = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderReact) {
  const { chain } = useOnchainKit();
  const [isOpen, setIsOpen] = useState(false);
  const value = useValue({
    isOpen,
    chain,
    setIsOpen,
  });
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
