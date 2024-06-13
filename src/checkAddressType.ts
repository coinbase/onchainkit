import type { Address } from 'viem';
import { decodeAbiParameters, isAddress } from 'viem';
import type { Hex, BlockTag } from 'viem';
import { walletActionsEip5792 } from 'viem/experimental';
import type { WalletClient } from 'viem';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'
 
export const walletClient2 = createWalletClient({
  chain: mainnet,
  transport: http(),
}).extend(walletActionsEip5792())

// only use Viem because Wagmi is all hooks?

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const CB_SW_PROXY_BYTECODE =
  '0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3';
const COINBASE_SMART_WALLET_V1_IMPLEMENTATION = '0x000100abaad02f1cfC8Bbe32bD5a564817339E72';
const ERC_1967_PROXY_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';

type walletClient = WalletClient & ReturnType<typeof walletActionsEip5792>;

type CheckAddressTypeOptions = {
  address: string;
  walletClient: walletClient;
};

type CheckAddressTypeResponse =
  | { type: 'EOA' | 'Coinbase Smart Wallet' | 'Smart Contract' }
  | { error: string; code: string };

export async function checkAddressType({
  address,
  walletClient,
}: CheckAddressTypeOptions): Promise<CheckAddressTypeResponse> {
  // Validate the input address
  if (!isAddress(`0x${address}`)) {
    return { error: 'Invalid address format', code: 'W_ERR_1' };
  }

  try {
    console.log(`Checking address type for 0x${address}`);

    // Use wallet_getCapabilities to check if the address has capabilities
    let hasCapabilities = false;
    try {
      // const capabilities = await walletClient.request({
      //   method: 'wallet_getCapabilities',
      //   params: [`0x${address}`],
      // });
      const capabilities = await walletClient2.getCapabilities({ account: `0x${address}` )

      console.log('Capabilities:', capabilities);

      if (capabilities && Object.keys(capabilities).length > 0) {
        hasCapabilities = true;
      }
    } catch (error) {
      console.log('Error retrieving capabilities:', error);
      console.log('Error retrieving capabilities, continuing to check if EOA');
    }

    // Get bytecode of the address
    // Bytecode is undefined if the address is an EOA
    const code = await publicClient.getBytecode({ address: `0x${address}` });

    // Check if the address is an EOA (Externally Owned Account, no bytecode)
    if (code === undefined && !hasCapabilities) {
      return { type: 'EOA' };
    }

    if (code === CB_SW_PROXY_BYTECODE) {
      // Might be able to return coinbase smart wallet here
      let implementation: Hex;

      try {
        // Retrieve the implementation address from the proxy
        implementation = await walletClient.request<{
          Parameters: [Address, Hex, BlockTag];
          ReturnType: Hex;
        }>({
          method: 'eth_getStorageAt',
          params: [`0x${address}`, ERC_1967_PROXY_IMPLEMENTATION_SLOT, 'latest'],
        });

        // Decode the implementation address from the retrieved storage data
        const implementationAddress = decodeAbiParameters([{ type: 'address' }], implementation)[0];

        // Verify if the implementation address matches the expected Coinbase Smart Wallet address
        if (implementationAddress === COINBASE_SMART_WALLET_V1_IMPLEMENTATION) {
          return { type: 'Coinbase Smart Wallet' };
        }
      } catch (error) {
        console.error('Error retrieving implementation address:', error);
        return { type: 'Smart Contract', error: 'Error retrieving implementation address' };
      }
    }

    // If the address has bytecode but no capabilities, it's a regular smart contract
    return { type: 'Smart Contract' };
  } catch (error) {
    console.error('Error checking address type:', error);
    return { type: 'Smart Contract', error: 'Error checking address type' };
  }
}
