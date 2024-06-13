import 'viem/window';
import { decodeAbiParameters, isAddress, createWalletClient, createPublicClient, http, custom } from 'viem';
import { walletActionsEip5792 } from 'viem/experimental';
import { base, baseSepolia, mainnet } from 'viem/chains';
import type { Hex, BlockTag, Address } from 'viem';

const CB_SW_PROXY_BYTECODE =
  '0x363d3d373d3d363d7f360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc545af43d6000803e6038573d6000fd5b3d6000f3';
const COINBASE_SMART_WALLET_V1_IMPLEMENTATION = '0x000100abaad02f1cfC8Bbe32bD5a564817339E72';
const ERC_1967_PROXY_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';

// export const walletClient = createWalletClient({
//   chain: baseSepolia,
//   transport: http(),
// }).extend(walletActionsEip5792());

export const walletClient = createWalletClient({
  chain: mainnet,
  transport: http("https://base-sepolia-nodes-dev.cbhq.net:8545")
}).extend(walletActionsEip5792())

const publicClient = createPublicClient({
  chain: base,
  transport: http('https://rpc.ankr.com/base_sepolia'),
});

type CheckAddressTypeOptions = {
  address: string;
};

type CheckAddressTypeResponse =
  | { type: 'EOA' | 'Coinbase Smart Wallet' | 'Smart Contract' }
  | { error: string; code: string };

export async function checkAddressType({
  address,
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
      const capabilities = await walletClient.getCapabilities({ account: `0x${address}` });

      console.log('Capabilities:', capabilities);

      if (capabilities && Object.keys(capabilities).length > 0) {
        hasCapabilities = true;
      }
    } catch (error) {
      console.log('Error retrieving capabilities, continuing to check if EOA: error: ', error);
    }

    // Get bytecode of the address
    // Bytecode is undefined if the address is an EOA
    const code = await publicClient.getBytecode({ address: `0x${address}` });

    // Check if the address is an EOA (Externally Owned Account, no bytecode)
    // An address is an EOA if it has no bytecode and no capabilities
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
