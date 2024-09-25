// AppContext.js
import type React from 'react';
import { createContext, useEffect, useState } from 'react';
import { useConnect, useConnectors } from 'wagmi';

import { WalletPreference } from './form/wallet-type';

export enum OnchainKitComponent {
  Identity = 'identity',
  Swap = 'swap',
  SwapDefault = 'swap-default',
  Transaction = 'transaction',
  Wallet = 'wallet',
}

export enum TransactionTypes {
  Calls = 'calls',
  Contracts = 'contracts',
}

export type Paymaster = {
  url: string;
  enabled: boolean;
};
type State = {
  activeComponent?: OnchainKitComponent;
  setActiveComponent?: (component: OnchainKitComponent) => void;
  walletType?: WalletPreference;
  setWalletType?: (walletType: WalletPreference) => void;
  clearWalletType?: () => void;
  chainId?: number;
  defaultMaxSlippage?: number;
  setDefaultMaxSlippage?: (defaultMaxSlippage: number) => void;
  setChainId?: (chainId: number) => void;
  transactionType?: TransactionTypes;
  setTransactionType?: (transactionType: TransactionTypes) => void;
  paymasters?: Record<number, Paymaster>; // paymasters is per network
  setPaymaster?: (chainId: number, url: string, enabled: boolean) => void;
};

const defaultState: State = {
  activeComponent: OnchainKitComponent.Transaction,
  chainId: 85432,
};

export const AppContext = createContext(defaultState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { connect } = useConnect();
  const connectors = useConnectors();

  const [activeComponent, setActiveComponentState] =
    useState<OnchainKitComponent>();
  const [walletType, setWalletTypeState] = useState<WalletPreference>();
  const [chainId, setChainIdState] = useState<number>();
  const [transactionType, setTransactionTypeState] = useState<TransactionTypes>(
    TransactionTypes.Contracts,
  );
  const [paymasters, setPaymastersState] =
    useState<Record<number, Paymaster>>();
  const [defaultMaxSlippage, setDefaultMaxSlippageState] = useState<number>(3);

  // Load initial values from localStorage
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
  useEffect(() => {
    const storedActiveComponent = localStorage.getItem('activeComponent');
    const storedWalletType = localStorage.getItem('walletType');
    const storedChainId = localStorage.getItem('chainId');
    const storedPaymasters = localStorage.getItem('paymasters');
    const storedTransactionType = localStorage.getItem('transactionType');
    const storedDefaultMaxSlippage = localStorage.getItem('defaultMaxSlippage');

    if (storedActiveComponent) {
      setActiveComponent(storedActiveComponent as OnchainKitComponent);
    }
    if (storedWalletType) {
      setWalletType(storedWalletType as WalletPreference);
    }
    if (storedChainId) {
      setChainIdState(Number.parseInt(storedChainId));
    }
    if (storedPaymasters) {
      setPaymastersState(JSON.parse(storedPaymasters));
    }
    if (storedTransactionType) {
      setTransactionTypeState(storedTransactionType as TransactionTypes);
    }
    if (storedDefaultMaxSlippage) {
      setDefaultMaxSlippage(Number(storedDefaultMaxSlippage));
    }
  }, []);

  // Connect to wallet if walletType changes
  useEffect(() => {
    if (walletType === WalletPreference.SMART_WALLET) {
      connect({ connector: connectors[0] });
    } else if (walletType === WalletPreference.EOA) {
      connect({ connector: connectors[1] });
    }
  }, [connect, connectors, walletType]);

  // Update localStorage whenever the state changes

  function setActiveComponent(component: OnchainKitComponent) {
    localStorage.setItem('activeComponent', component.toString());
    setActiveComponentState(component);
  }

  function setWalletType(newWalletType: WalletPreference) {
    localStorage.setItem('walletType', newWalletType.toString());
    setWalletTypeState(newWalletType);
  }

  function clearWalletType() {
    localStorage.setItem('walletType', '');
    setWalletTypeState(undefined);
  }

  const setChainId = (newChainId: number) => {
    localStorage.setItem('chainId', newChainId.toString());
    setChainIdState(newChainId);
  };

  const setDefaultMaxSlippage = (newDefaultMaxSlippage: number) => {
    localStorage.setItem(
      'defaultMaxSlippage',
      newDefaultMaxSlippage.toString(),
    );
    setDefaultMaxSlippageState(newDefaultMaxSlippage);
  };

  const setPaymaster = (chainId: number, url: string, enabled: boolean) => {
    const newObj = {
      ...paymasters,
      [chainId]: { url, enabled },
    };
    localStorage.setItem('paymasters', JSON.stringify(newObj));
    setPaymastersState(newObj);
  };

  const setTransactionType = (transactionType: TransactionTypes) => {
    localStorage.setItem('transactionType', transactionType.toString());
    setTransactionTypeState(transactionType);
  };

  return (
    <AppContext.Provider
      value={{
        activeComponent,
        setActiveComponent,
        walletType,
        setWalletType,
        clearWalletType,
        chainId,
        setChainId,
        paymasters,
        setPaymaster,
        transactionType,
        setTransactionType,
        defaultMaxSlippage,
        setDefaultMaxSlippage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
