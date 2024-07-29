// AppContext.js
import React, { createContext, useState, useEffect } from 'react';
import {useConnect, useConnectors} from "wagmi"

import { WalletPreference } from './form/wallet-type';

export enum OnchainKitComponent {
  Transaction="transaction",
  Swap="swap"
}
export type Paymaster = {
  url: string, 
  enabled: boolean
}
type State = {
    activeComponent?: OnchainKitComponent
    setActiveComponent?: (component: OnchainKitComponent) => void
    walletType?: WalletPreference
    setWalletType?: (walletType: WalletPreference) => void
    clearWalletType?: () => void
    chainId?: number,
    setChainId?: (chainId: number) => void
    paymasters?: Record<number, Paymaster> // paymasters is per network
    setPaymaster?: (chainId: number, url: string, enabled: boolean) => void
}

const defaultState: State = {
    activeComponent: OnchainKitComponent.Transaction,
    chainId: 85432,
}

export const AppContext = createContext(defaultState);

export const AppProvider = ({ children }: {children: React.ReactNode}) => {
  const {connect} = useConnect()
  const connectors = useConnectors()

  const [activeComponent, setActiveComponentState] = useState<OnchainKitComponent>();
  const [walletType, setWalletTypeState] = useState<WalletPreference>();
  const [chainId, setChainIdState] = useState<number>();
  const [paymasters, setPaymastersState] = useState<Record<number,Paymaster>>();

  // Load initial values from localStorage
  useEffect(() => {
    const storedActiveComponent = localStorage.getItem('activeComponent');
    const storedWalletType = localStorage.getItem('walletType');
    const storedChainId = localStorage.getItem('chainId');
    const storedPaymasters = localStorage.getItem('paymasters');
    
    if (storedActiveComponent) {
      setActiveComponent(storedActiveComponent as OnchainKitComponent);
    }
    if (storedWalletType) {
      setWalletType(storedWalletType as WalletPreference);
    }
    if (storedChainId) {
      setChainIdState(parseInt(storedChainId));
    }
    if (storedPaymasters) {
      setPaymastersState(JSON.parse(storedPaymasters));
    }
  }, []);

  // Connect to wallet if walletType changes
  useEffect(() => {
    if (walletType === WalletPreference .SMART_WALLET) {
      connect({connector: connectors[0]})
    } else if (walletType === WalletPreference.EOA) {
      connect({connector: connectors[1]})
    }
  }, [walletType])

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
    localStorage.setItem('walletType', "");
    setWalletTypeState(undefined);
  }

  const setChainId = (newChainId: number) => {
    localStorage.setItem('chainId', newChainId.toString());
    setChainIdState(newChainId);
  };

  const setPaymaster = (chainId: number, url: string, enabled: boolean) => {
    const newObj = {
      ...paymasters,
      [chainId]: { url, enabled }
    }
    localStorage.setItem('paymasters', JSON.stringify(newObj));
    setPaymastersState(newObj);
  };

  return (
    <AppContext.Provider value={{ 
      activeComponent, 
      setActiveComponent, 
      walletType, 
      setWalletType, 
      clearWalletType, 
      chainId, 
      setChainId, 
      paymasters, 
      setPaymaster 
    }}>
      {children}
    </AppContext.Provider>
  );
};
