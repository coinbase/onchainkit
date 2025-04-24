import type { Token } from '@/token';
import { ethToken, usdcToken } from '@/token/constants';

/** The bytecode for the Coinbase Smart Wallet proxy contract. */
export const CB_SW_PROXY_BYTECODE =
  '0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3';

/** The address of the Coinbase Smart Wallet version 1 implementation contract. */
export const CB_SW_V1_IMPLEMENTATION_ADDRESS =
  '0x000100abaad02f1cfC8Bbe32bD5a564817339E72';

/** The storage slot in the proxy contract that points to the implementation address. */
export const ERC_1967_PROXY_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';

/** The Coinbase Smart Wallet factory address. */
export const CB_SW_FACTORY_ADDRESS =
  '0x0BA5Ed0c6AA8c49038F819E587E2633c4A9F428a';

export const WALLET_ADVANCED_MAX_HEIGHT = 400;
export const WALLET_ADVANCED_MAX_WIDTH = 352;
export const WALLET_ADVANCED_DEFAULT_SWAPPABLE_TOKENS: Token[] = [
  ethToken,
  usdcToken,
];
