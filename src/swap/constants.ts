import { base } from 'viem/chains';
import type { Token } from '../token';

export const FALLBACK_DEFAULT_MAX_SLIPPAGE = 3;
export const GENERAL_SWAP_ERROR_CODE = 'SWAP_ERROR';
export const GENERAL_SWAP_QUOTE_ERROR_CODE = 'SWAP_QUOTE_ERROR';
export const GENERAL_SWAP_BALANCE_ERROR_CODE = 'SWAP_BALANCE_ERROR';
export const LOW_LIQUIDITY_ERROR_CODE = 'SWAP_QUOTE_LOW_LIQUIDITY_ERROR';
export const PERMIT2_CONTRACT_ADDRESS =
  '0x000000000022D473030F116dDEE9F6B43aC78BA3';
export const TOO_MANY_REQUESTS_ERROR_CODE = 'TOO_MANY_REQUESTS_ERROR';
export const UNCAUGHT_SWAP_QUOTE_ERROR_CODE = 'UNCAUGHT_SWAP_QUOTE_ERROR';
export const UNCAUGHT_SWAP_ERROR_CODE = 'UNCAUGHT_SWAP_ERROR';
export const UNIVERSALROUTER_CONTRACT_ADDRESS =
  '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD';
export const USER_REJECTED_ERROR_CODE = 'USER_REJECTED';
export enum SwapMessage {
  BALANCE_ERROR = 'Error fetching token balance',
  CONFIRM_IN_WALLET = 'Confirm in wallet',
  FETCHING_QUOTE = 'Fetching quote...',
  FETCHING_BALANCE = 'Fetching balance...',
  INCOMPLETE_FIELD = 'Complete the fields to continue',
  INSUFFICIENT_BALANCE = 'Insufficient balance',
  LOW_LIQUIDITY = 'Insufficient liquidity for this trade.',
  SWAP_IN_PROGRESS = 'Swap in progress...',
  TOO_MANY_REQUESTS = 'Too many requests. Please try again later.',
  USER_REJECTED = 'User rejected the transaction',
}

export const ethToken: Token = {
  name: 'ETH',
  address: '',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: base.id,
};

export const usdcToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: base.id,
};
