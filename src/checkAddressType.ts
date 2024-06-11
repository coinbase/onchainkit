import { type createPublicClient, decodeAbiParameters } from 'viem';
import type { Address, Hex, BlockTag } from 'viem';

const CB_SW_PROXY_BYTECODE =
  '0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3';
const COINBASE_SMART_WALLET_V1_IMPLEMENTATION = '0x000100abaad02f1cfC8Bbe32bD5a564817339E72';
const ERC_1967_PROXY_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';

type CheckAddressTypeOptions = {
  address: string;
  client: ReturnType<typeof createPublicClient>;
};

type CheckAddressTypeResponse = {
  type: 'EOA' | 'Coinbase Smart Wallet' | 'Smart Contract';
  error?: string;
};

export async function checkAddressType({
  client,
  address,
}: CheckAddressTypeOptions): Promise<CheckAddressTypeResponse> {
  try {
    // Step 1: Get bytecode of the address
    // Retrieves the contracts bytecode at an address.
    const code = await client.getBytecode({ address: `0x${address}` });

    // Step 2: Check if the address is an EOA (Externally Owned Account, no bytecode)
    if (!code || code === '0x') {
      return { type: 'EOA' };
    }

    // Step 3: Check if the address is a Coinbase Smart Wallet by verifying its proxy bytecode
    if (code === CB_SW_PROXY_BYTECODE) {
      let implementation: Hex;

      try {
        // Step 4: Retrieve the implementation address from the proxy
        implementation = await client.request<{
          Parameters: [Address, Hex, BlockTag];
          ReturnType: Hex;
        }>({
          method: 'eth_getStorageAt',
          params: [`0x${address}`, ERC_1967_PROXY_IMPLEMENTATION_SLOT, 'latest'],
        });

        // Step 5: Decode the implementation address from the retrieved storage data
        const implementationAddress = decodeAbiParameters([{ type: 'address' }], implementation)[0];

        // Step 6: Verify if the implementation address matches the expected Coinbase Smart Wallet address
        if (implementationAddress === COINBASE_SMART_WALLET_V1_IMPLEMENTATION) {
          return { type: 'Coinbase Smart Wallet' };
        }
      } catch (error) {
        console.error('Error retrieving implementation address:', error);
        return { type: 'Smart Contract', error: 'Error retrieving implementation address' };
      }
    }

    // Step 7: If the address has bytecode but is not a Coinbase Smart Wallet, it's a regular smart contract
    return { type: 'Smart Contract' };
  } catch (error) {
    console.error('Error checking address type:', error);
    return { type: 'Smart Contract', error: 'Error checking address type' };
  }
}
