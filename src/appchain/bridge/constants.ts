import type { Token } from '@/token';
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
  [base.id]: {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: base.id,
  },
  [baseSepolia.id]: {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: baseSepolia.id,
  },
};

export const USDC_BY_CHAIN: Record<number, Token> = {
  [base.id]: {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: base.id,
  },
  [baseSepolia.id]: {
    name: 'USDC',
    address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: baseSepolia.id,
  },
};

export const MIN_GAS_LIMIT = 100000;
export const EXTRA_DATA = '0x';
export const OUTPUT_ROOT_PROOF_VERSION =
  '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex;
