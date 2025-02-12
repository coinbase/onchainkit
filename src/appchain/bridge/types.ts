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

export type BridgeableToken = Token & {
  remoteToken?: Address;
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
