import { createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState } from 'react';
import { useValue } from '../../../internal/hooks/useValue';

export type WalletIslandContextType = {
  showSwap: boolean;
  setShowSwap: Dispatch<SetStateAction<boolean>>;
  showQr: boolean;
  setShowQr: Dispatch<SetStateAction<boolean>>;
};

type WalletIslandProviderReact = {
  children: ReactNode;
};

const WalletIslandContext = createContext<WalletIslandContextType>({} as WalletIslandContextType);

export function WalletIslandProvider({ children }: WalletIslandProviderReact) {
  const [showSwap, setShowSwap] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const value = useValue({
    showSwap,
    setShowSwap,
    showQr,
    setShowQr,
  });

  return <WalletIslandContext.Provider value={value}>{children}</WalletIslandContext.Provider>;
}

export function useWalletIslandContext() {
  return useContext(WalletIslandContext);
}
