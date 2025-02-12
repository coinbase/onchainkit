import type { Token } from '@/token';
import type { Address, Chain } from 'viem';

/**
 * Note: exported as public Type
 */
export type Appchain = {
  /** The chain to bridge to. */
  chain: Chain;
  /** Optional icon to display for the appchain. */
  icon?: React.ReactNode;
};

/**
 * Note: exported as public Type
 */
export type AppchainBridgeReact = {
  /** The source chain to bridge from. This should beBase or Base Sepolia. */
  chain: Chain;
  /** The appchain to bridge to. */
  appchain: Appchain;
  /** Optional children to render within the component. */
  children?: React.ReactNode;
  /** Optional className override for the component. */
  className?: string;
  /** Optional title for the component. */
  title?: string;
  /** Optional array of bridgeable tokens. */
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

/**
 * Note: exported as public Type
 */
export type BridgeableToken = Token & {
  /** The address of the remote token on the appchain. */
  remoteToken?: Address;
};

/**
 * Note: exported as public Type
 */
export type ChainWithIcon = Chain & {
  icon: React.ReactNode;
};

/**
 * Note: exported as public Type
 */
export type AppchainConfig = {
  chainId: number;
  /** The OP Bedrock contract addresses for an appchain. These are on Base and retrieved from DeployContract. */
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
