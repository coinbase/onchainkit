import { ReactNode, useState } from 'react';
import { createContext, useContext } from 'react';
import type { WalletContextType } from '../types';
import { useValue } from '../../internal/hooks/useValue';

const emptyContext = {} as WalletContextType;

const WalletContext = createContext<WalletContextType>(emptyContext);

type WalletProviderReact = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderReact) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useValue({
    isOpen,
    setIsOpen,
  });

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  return useContext(WalletContext);
}
