import { decodeAbiParameters } from 'viem';
import {
  CB_SW_PROXY_BYTECODE,
  CB_SW_V1_IMPLEMENTATION_ADDRESS,
  ERC_1967_PROXY_IMPLEMENTATION_SLOT,
} from './constants';
import type { Address, BlockTag, Hex } from 'viem';
import type {
  IsWalletASmartWalletOptions,
  IsWalletASmartWalletResponse,
} from './types';

/**
 * Validates a User Operation by checking if the sender address
 * is a proxy with the expected bytecode.
 */
export async function isWalletASmartWallet({
  client,
  userOp,
}: IsWalletASmartWalletOptions): Promise<IsWalletASmartWalletResponse> {
  try {
    const code = await client.getBytecode({ address: userOp.sender });
    // Verify if the sender address bytecode matches the Coinbase Smart Wallet proxy bytecode
    if (code !== CB_SW_PROXY_BYTECODE) {
      return {
        isSmartWallet: false,
        error: 'Invalid bytecode',
        code: 'W_ERR_1',
      };
    }
  } catch (error) {
    console.error('Error retrieving bytecode:', error);
    return {
      isSmartWallet: false,
      error: 'Error retrieving bytecode',
      code: 'W_ERR_2',
    };
  }

  let implementation: Hex;
  try {
    implementation = await client.request<{
      Parameters: [Address, Hex, BlockTag];
      ReturnType: Hex;
    }>({
      method: 'eth_getStorageAt',
      params: [userOp.sender, ERC_1967_PROXY_IMPLEMENTATION_SLOT, 'latest'],
    });
  } catch (error) {
    console.error('Error retrieving implementation address:', error);
    return {
      isSmartWallet: false,
      error: 'Error retrieving implementation address',
      code: 'W_ERR_3',
    };
  }

  // Decode the implementation address from the retrieved storage data
  const implementationAddress = decodeAbiParameters(
    [{ type: 'address' }],
    implementation,
  )[0];

  // Verify if the implementation address matches the expected Coinbase Smart Wallet address
  if (implementationAddress !== CB_SW_V1_IMPLEMENTATION_ADDRESS) {
    return {
      isSmartWallet: false,
      error: 'Invalid implementation address',
      code: 'W_ERR_4',
    };
  }

  return { isSmartWallet: true };
}
