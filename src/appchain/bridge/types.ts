import type { Token } from '@/token';
import type { Address, Chain } from 'viem';

export type Appchain = {
  chain: Chain;
  icon?: React.ReactNode;
};

export type AppchainBridgeReact = {
  chain: Chain;
  appchain: Appchain;
  children?: React.ReactNode;
  className?: string;
  title?: string;
  bridgeableTokens?: BridgeableToken[];
};

export type AppchainBridgeContextType = {
  // Configuration
  config: AppchainConfig;
  from: ChainWithIcon;
  to: ChainWithIcon;
  bridgeParams: BridgeParams;

  // UI State
  isPriceLoading: boolean;
  isAddressModalOpen: boolean;
  isWithdrawModalOpen: boolean;
  balance: string;
  depositStatus: string;
  withdrawStatus: string;
  direction: string;

  // Handler Functions
  handleToggle: () => void;
  handleAmountChange: (params: { amount: string; token: Token }) => void;
  handleAddressSelect: (address: Address) => void;
  handleDeposit: () => void;
  handleWithdraw: () => void;
  waitForWithdrawal: () => Promise<void>;
  proveAndFinalizeWithdrawal: () => Promise<void>;
  setIsAddressModalOpen: (open: boolean) => void;
  setIsWithdrawModalOpen: (open: boolean) => void;
};

export type BridgeableToken = Token & {
  remoteToken?: Address;
};

export type ChainWithIcon = Chain & {
  icon: React.ReactNode;
};

export type AppchainConfig = {
  chainId: number;
  contracts: {
    l2OutputOracle: Address;
    systemConfig: Address;
    optimismPortal: Address;
    l1CrossDomainMessenger: Address;
    l1StandardBridge: Address;
    l1ERC721Bridge: Address;
    optimismMintableERC20Factory: Address;
  };
};

export type BridgeParams = {
  amount: string;
  amountUSD: string;
  token: BridgeableToken;
  recipient?: Address;
};

export type FinalizeWithdrawalParams = {
  config: AppchainConfig;
  chain: Chain;
};
