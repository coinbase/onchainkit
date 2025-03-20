import { checksumAddress, decodeAbiParameters } from 'viem';
import type { Address, BlockTag, Hex } from 'viem';
import {
  CB_SW_FACTORY_ADDRESS,
  CB_SW_PROXY_BYTECODE,
  CB_SW_V1_IMPLEMENTATION_ADDRESS,
  ERC_1967_PROXY_IMPLEMENTATION_SLOT,
} from '../constants';
import type {
  IsWalletACoinbaseSmartWalletOptions,
  IsWalletACoinbaseSmartWalletResponse,
} from '../types';

/**
 * Validates a User Operation by checking if the sender address
 * is a proxy with the expected bytecode.
 */
export async function isWalletACoinbaseSmartWallet({
  client,
  userOp,
}: IsWalletACoinbaseSmartWalletOptions): Promise<IsWalletACoinbaseSmartWalletResponse> {
  try {
    const code = await client.getBytecode({ address: userOp.sender });

    if (!code) {
      // no code at address, check that the initCode is deploying a Coinbase Smart Wallet
      // factory address is first 20 bytes of initCode after '0x'
      const factoryAddress = userOp?.initCode?.slice(0, 42) as Address;
      if (
        checksumAddress(factoryAddress) !==
        checksumAddress(CB_SW_FACTORY_ADDRESS)
      ) {
        return {
          isCoinbaseSmartWallet: false,
          error: 'Invalid factory address',
          code: 'W_ERR_1',
        };
      }
      return { isCoinbaseSmartWallet: true };
    }

    // Verify if the sender address bytecode matches the Coinbase Smart Wallet proxy bytecode
    if (code !== CB_SW_PROXY_BYTECODE) {
      return {
        isCoinbaseSmartWallet: false,
        error: 'Invalid bytecode',
        code: 'W_ERR_2',
      };
    }
  } catch (error) {
    console.error('Error retrieving bytecode:', error);
    return {
      isCoinbaseSmartWallet: false,
      error: 'Error retrieving bytecode',
      code: 'W_ERR_3',
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
      isCoinbaseSmartWallet: false,
      error: 'Error retrieving implementation address',
      code: 'W_ERR_4',
    };
  }

  // Decode the implementation address from the retrieved storage data
  const implementationAddress = decodeAbiParameters(
    [{ type: 'address' }],
    implementation,
  )[0];

  // Verify if the implementation address matches the expected Coinbase Smart Wallet address
  if (
    checksumAddress(implementationAddress) !==
    checksumAddress(CB_SW_V1_IMPLEMENTATION_ADDRESS)
  ) {
    return {
      isCoinbaseSmartWallet: false,
      error: 'Invalid implementation address',
      code: 'W_ERR_5',
    };
  }

  return { isCoinbaseSmartWallet: true };
}
