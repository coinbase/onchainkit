// AppContext.js
import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type React from 'react';
import { createContext, useEffect, useState } from 'react';
import { useConnect, useConnectors } from 'wagmi';
import { base } from 'wagmi/chains';
import { WalletPreference } from './form/wallet-type';

export enum OnchainKitComponent {
  Fund = 'fund',
  Identity = 'identity',
  Checkout = 'checkout',
  Swap = 'swap',
  SwapDefault = 'swap-default',
  Transaction = 'transaction',
  TransactionDefault = 'transaction-default',
  Wallet = 'wallet',
  WalletDefault = 'wallet-default',
  NFTCard = 'nft-card',
  NFTMintCard = 'nft-mint-card',
}

export enum TransactionTypes {
  Calls = 'calls',
  Contracts = 'contracts',
  CallsPromise = 'callsPromise',
  ContractsPromise = 'contractsPromise',
  CallsCallback = 'callsCallback',
  ContractsCallback = 'contractsCallback',
}

export type Paymaster = {
  url: string;
  enabled: boolean;
};

export type CheckoutOptions = {
  chargeId?: string;
  productId?: string;
};

export enum CheckoutTypes {
  ChargeID = 'chargeId',
  ProductID = 'productId',
}

export type ComponentTheme =
  | 'base'
  | 'cyberpunk'
  | 'default'
  | 'hacker'
  | 'none'; // Simulates an undefined theme field

export type ComponentMode = 'auto' | 'light' | 'dark';

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
  checkoutOptions?: CheckoutOptions;
  setCheckoutOptions?: (checkoutOptions: CheckoutOptions) => void;
  checkoutTypes?: CheckoutTypes;
  setCheckoutTypes?: (checkoutTypes: CheckoutTypes) => void;
  componentTheme?: ComponentTheme;
  setComponentTheme: (theme: ComponentTheme) => void;
  componentMode: ComponentMode;
  setComponentMode: (mode: ComponentMode) => void;
  nftToken?: string;
  setNFTToken: (nftToken: string) => void;
};

const defaultState: State = {
  activeComponent: OnchainKitComponent.Transaction,
  chainId: 85432,
  componentTheme: 'default',
  setComponentTheme: () => {},
  componentMode: 'auto',
  setComponentMode: () => {},
  setNFTToken: () => {},
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
  const [checkoutOptions, setCheckoutOptionsState] =
    useState<CheckoutOptions>();
  const [checkoutTypes, setCheckoutTypesState] = useState<CheckoutTypes>(
    CheckoutTypes.ProductID,
  );
  const [paymasters, setPaymastersState] =
    useState<Record<number, Paymaster>>();
  const [defaultMaxSlippage, setDefaultMaxSlippageState] = useState<number>(3);
  const [componentTheme, setComponentThemeState] =
    useState<ComponentTheme>('none');
  const [componentMode, setComponentModeState] =
    useState<ComponentMode>('auto');
  const [nftToken, setNFTTokenState] = useState<string>(
    '0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63:1',
  );

  // Load initial values from localStorage
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
  useEffect(() => {
    const storedActiveComponent = localStorage.getItem('activeComponent');
    const storedWalletType = localStorage.getItem('walletType');
    const storedChainId = localStorage.getItem('chainId');
    const storedPaymasters = localStorage.getItem('paymasters');
    const storedTransactionType = localStorage.getItem('transactionType');
    const storedDefaultMaxSlippage = localStorage.getItem('defaultMaxSlippage');
    const storedComponentTheme = localStorage.getItem(
      'componentTheme',
    ) as ComponentTheme;
    const storedComponentMode = localStorage.getItem(
      'componentMode',
    ) as ComponentMode;
    const storedNFTToken = localStorage.getItem('nftToken');

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
    if (storedComponentTheme) {
      setComponentTheme(storedComponentTheme);
    }
    if (storedComponentMode) {
      setComponentMode(storedComponentMode);
    }
    if (storedNFTToken) {
      setNFTTokenState(storedNFTToken);
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

  const setCheckoutOptions = (checkoutOptions: CheckoutOptions) => {
    localStorage.setItem('productId', checkoutOptions.productId || '');
    setCheckoutOptionsState(checkoutOptions);
  };

  const setCheckoutTypes = (checkoutTypes: CheckoutTypes) => {
    setCheckoutTypesState(checkoutTypes);
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

  const setComponentTheme = (theme: ComponentTheme) => {
    console.log('Component theme changed:', theme);
    localStorage.setItem('componentTheme', theme);
    setComponentThemeState(theme);
  };

  const setComponentMode = (mode: ComponentMode) => {
    console.log('Component mode changed:', mode);
    localStorage.setItem('componentMode', mode);
    setComponentModeState(mode);
  };

  const setNFTToken = (nftToken: string) => {
    console.log('NFT Token changed:', nftToken);
    localStorage.setItem('nftToken', nftToken);
    setNFTTokenState(nftToken);
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
        componentTheme,
        setComponentTheme,
        componentMode,
        setComponentMode,
        checkoutOptions,
        setCheckoutOptions,
        checkoutTypes,
        setCheckoutTypes,
        paymasters,
        setPaymaster,
        transactionType,
        setTransactionType,
        defaultMaxSlippage,
        setDefaultMaxSlippage,
        nftToken,
        setNFTToken,
      }}
    >
      <OnchainKitProvider
        apiKey={ENVIRONMENT_VARIABLES[ENVIRONMENT.API_KEY]}
        chain={base}
        config={{
          appearance: {
            mode: componentMode,
            theme: componentTheme === 'none' ? undefined : componentTheme,
          },
        }}
        projectId={ENVIRONMENT_VARIABLES[ENVIRONMENT.PROJECT_ID]}
        schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
      >
        {children}
      </OnchainKitProvider>
    </AppContext.Provider>
  );
};
