import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import { useAddressTokenHoldings } from '../../../core-react/internal/hooks/useAddressTokenHoldings';
import { useValue } from '../../../core-react/internal/hooks/useValue';
import type { TokenBalanceWithFiatValue } from './WalletIslandTokenHoldings';

export type WalletIslandContextType = {
  showSwap: boolean;
  setShowSwap: Dispatch<SetStateAction<boolean>>;
  showQr: boolean;
  setShowQr: Dispatch<SetStateAction<boolean>>;
  tokenHoldings: TokenBalanceWithFiatValue[];
};

type WalletIslandProviderReact = {
  children: ReactNode;
};

const WalletIslandContext = createContext<WalletIslandContextType>(
  {} as WalletIslandContextType,
);

export function WalletIslandProvider({ children }: WalletIslandProviderReact) {
  const [showSwap, setShowSwap] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const tokenHoldings = useAddressTokenHoldings();

  const value = useValue({
    showSwap,
    setShowSwap,
    showQr,
    setShowQr,
    tokenHoldings,
  });

  return (
    <WalletIslandContext.Provider value={value}>
      {children}
    </WalletIslandContext.Provider>
  );
}

export function useWalletIslandContext() {
  return useContext(WalletIslandContext);
}
