import { useValue } from '@/core-react/internal/hooks/useValue';
import {
  type TokenBalanceWithFiatValue,
  getAddressTokenBalances,
} from '@/core-react/internal/utils/getAddressTokenBalances';
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useWalletContext } from './WalletProvider';

export type WalletIslandContextType = {
  showSwap: boolean;
  setShowSwap: Dispatch<SetStateAction<boolean>>;
  isSwapClosing: boolean;
  setIsSwapClosing: Dispatch<SetStateAction<boolean>>;
  showQr: boolean;
  setShowQr: Dispatch<SetStateAction<boolean>>;
  isQrClosing: boolean;
  setIsQrClosing: Dispatch<SetStateAction<boolean>>;
  tokenHoldings: TokenBalanceWithFiatValue[];
};

type WalletIslandProviderReact = {
  children: ReactNode;
};

const WalletIslandContext = createContext<WalletIslandContextType>(
  {} as WalletIslandContextType,
);

export function WalletIslandProvider({ children }: WalletIslandProviderReact) {
  const { address } = useWalletContext();
  const [showSwap, setShowSwap] = useState(false);
  const [isSwapClosing, setIsSwapClosing] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [isQrClosing, setIsQrClosing] = useState(false);
  const [tokenHoldings, setTokenHoldings] = useState<
    TokenBalanceWithFiatValue[]
  >([]);

  useEffect(() => {
    async function fetchTokens() {
      if (address) {
        const fetchedTokens = await getAddressTokenBalances(address);
        setTokenHoldings(fetchedTokens);
      }
    }

    fetchTokens();
  }, [address]);

  const value = useValue({
    showSwap,
    setShowSwap,
    isSwapClosing,
    setIsSwapClosing,
    showQr,
    setShowQr,
    isQrClosing,
    setIsQrClosing,
    tokenHoldings,
  });

  return (
    <WalletIslandContext.Provider value={value}>
      {children}
    </WalletIslandContext.Provider>
  );
}

export function useWalletIslandContext() {
  const walletIslandContext = useContext(WalletIslandContext);
  if (!walletIslandContext) {
    throw new Error(
      'useWalletIslandContext must be used within a WalletIslandProvider',
    );
  }
  return walletIslandContext;
}
