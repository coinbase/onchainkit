import type { Token } from '@/token';
import {
  ethSepoliaToken,
  ethToken,
  usdcSepoliaToken,
  usdcToken,
} from '@/token/constants';
import type { Address, Hex } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export const APPCHAIN_BRIDGE_ADDRESS =
  '0x4200000000000000000000000000000000000010';

export const APPCHAIN_L2_TO_L1_MESSAGE_PASSER_ADDRESS =
  '0x4200000000000000000000000000000000000016';

export const APPCHAIN_DEPLOY_CONTRACT_ADDRESS = {
  [baseSepolia.id]: '0x8B4dB9468126EA0AA6EC8f1FAEb32173de3A27c7' as Address,
};

export const ETH_BY_CHAIN: Record<number, Token> = {
  [base.id]: ethToken,
  [baseSepolia.id]: ethSepoliaToken,
};

export const USDC_BY_CHAIN: Record<number, Token> = {
  [base.id]: usdcToken,
  [baseSepolia.id]: usdcSepoliaToken,
};

export const MIN_GAS_LIMIT = 100000;
export const EXTRA_DATA = '0x';
export const OUTPUT_ROOT_PROOF_VERSION =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex;
