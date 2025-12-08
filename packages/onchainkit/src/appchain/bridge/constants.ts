import type { Token } from '@/token';
import {
  ethSepoliaToken,
  ethToken,
  usdcSepoliaToken,
  usdcToken,
} from '@/token/constants';
import type { Address, Hex } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import type { BridgeableToken } from './types';

export const APPCHAIN_BRIDGE_ADDRESS =
  '0x4200000000000000000000000000000000000010';

export const APPCHAIN_L2_TO_L1_MESSAGE_PASSER_ADDRESS =
  '0x4200000000000000000000000000000000000016';

export const APPCHAIN_DEPLOY_CONTRACT_ADDRESS: Record<number, Address> = {
  [base.id]: '0xe8c6D9460Ce61D260260d27f30bde8b8d1a8341e',
  [baseSepolia.id]: '0x948DCF664178aFF14733C4Cc2dAbA44bCCaf8230',
};

export const ETH_BY_CHAIN: Record<number, Token> = {
  [base.id]: ethToken,
  [baseSepolia.id]: ethSepoliaToken,
};

export const USDC_BY_CHAIN: Record<number, Token> = {
  [base.id]: usdcToken,
  [baseSepolia.id]: usdcSepoliaToken,
};

export const DEFAULT_BRIDGEABLE_TOKENS = [
  {
    ...ETH_BY_CHAIN[8453],
    remoteToken: ETH_BY_CHAIN[8453].address,
  } as BridgeableToken,
];

export const MIN_GAS_LIMIT = 100000;
export const EXTRA_DATA = '0x6f6e636861696e6b6974';
export const OUTPUT_ROOT_PROOF_VERSION =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex;
