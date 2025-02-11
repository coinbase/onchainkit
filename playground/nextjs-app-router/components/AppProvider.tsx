// AppContext.js
import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import { useStateWithStorage } from '@/lib/hooks';
import {
  type CheckoutOptions,
  CheckoutTypes,
  type ComponentMode,
  type ComponentTheme,
  OnchainKitComponent,
  type Paymaster,
  TransactionTypes,
} from '@/types/onchainkit';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import type React from 'react';
import { createContext, useEffect, useState } from 'react';
import type { Address } from 'viem';
import { base } from 'wagmi/chains';

type State = {
  activeComponent?: OnchainKitComponent;
  setActiveComponent?: (component: OnchainKitComponent) => void;
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
  setIsSponsored: (isSponsored: boolean) => void;
  isSponsored?: boolean;
  vaultAddress?: Address;
  setVaultAddress: (vaultAddress: Address) => void;
};

export const defaultState: State = {
  activeComponent: OnchainKitComponent.Transaction,
  chainId: base.id,
  componentTheme: 'default',
  setComponentTheme: () => {},
  componentMode: 'auto',
  setComponentMode: () => {},
  setNFTToken: () => {},
  setIsSponsored: () => {},
  setVaultAddress: () => {},
};

export const AppContext = createContext(defaultState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeComponent, setActiveComponent] =
    useStateWithStorage<OnchainKitComponent>({
      key: 'activeComponent',
      defaultValue: defaultState.activeComponent,
    });

  const [componentTheme, setComponentTheme] =
    useStateWithStorage<ComponentTheme>({
      key: 'componentTheme',
      defaultValue: defaultState.componentTheme,
    });

  const [componentMode, setComponentMode] = useStateWithStorage<ComponentMode>({
    key: 'componentMode',
    defaultValue: defaultState.componentMode,
  });

  const [chainId, setChainId] = useStateWithStorage<number>({
    key: 'chainId',
    parser: (v) => Number.parseInt(v),
    defaultValue: defaultState.chainId,
  });

  const [transactionType, setTransactionType] =
    useStateWithStorage<TransactionTypes>({
      key: 'transactionType',
      defaultValue: TransactionTypes.Contracts,
    });

  const [checkoutOptions, setCheckoutOptions] =
    useStateWithStorage<CheckoutOptions>({
      key: 'checkoutOptions',
      parser: (v) => JSON.parse(v),
      defaultValue: {},
    });

  const [checkoutTypes, setCheckoutTypes] = useStateWithStorage<CheckoutTypes>({
    key: 'checkoutTypes',
    defaultValue: CheckoutTypes.ProductID,
  });

  const [paymasters, setPaymastersState] =
    useState<Record<number, Paymaster>>();

  const [defaultMaxSlippage, setDefaultMaxSlippage] =
    useStateWithStorage<number>({
      key: 'defaultMaxSlippage',
      parser: (v) => Number.parseInt(v),
      defaultValue: 3,
    });

  const [nftToken, setNFTToken] = useStateWithStorage<string>({
    key: 'nftToken',
    defaultValue: '0x1D6b183bD47F914F9f1d3208EDCF8BefD7F84E63:1',
  });

  const [isSponsored, setIsSponsored] = useStateWithStorage<boolean>({
    key: 'isSponsored',
    defaultValue: false,
    parser: (v) => v === 'true',
  });

  const [vaultAddress, setVaultAddress] = useStateWithStorage<Address>({
    key: 'vaultAddress',
    defaultValue: '0x7BfA7C4f149E7415b73bdeDfe609237e29CBF34A',
  });

  // Load initial values from localStorage
  useEffect(() => {
    const storedPaymasters = localStorage.getItem('paymasters');

    if (storedPaymasters) {
      setPaymastersState(JSON.parse(storedPaymasters));
    }
  }, []);

  const setPaymaster = (chainId: number, url: string, enabled: boolean) => {
    const newObj = {
      ...paymasters,
      [chainId]: { url, enabled },
    };
    localStorage.setItem('paymasters', JSON.stringify(newObj));
    setPaymastersState(newObj);
  };

  return (
    <AppContext.Provider
      value={{
        activeComponent,
        setActiveComponent,
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
        setIsSponsored,
        isSponsored,
        vaultAddress,
        setVaultAddress,
      }}
    >
      <OnchainKitProvider
        apiKey={ENVIRONMENT_VARIABLES[ENVIRONMENT.API_KEY]}
        chain={base}
        config={{
          appearance: {
            name: 'OnchainKit Playground',
            logo: 'https://onchainkit.xyz/favicon/48x48.png?v4-19-24',
            mode: componentMode,
            theme: componentTheme === 'none' ? undefined : componentTheme,
          },
          paymaster: paymasters?.[chainId || 8453]?.url,
          wallet: {
            display: 'modal',
            termsUrl: 'https://www.coinbase.com/legal/cookie',
            privacyUrl: 'https://www.coinbase.com/legal/privacy',
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
