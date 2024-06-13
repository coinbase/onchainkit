import { checkAddressType } from './checkAddressType';
import { createPublicClient, http } from 'viem'
import { walletActionsEip5792 } from 'viem/experimental'

import { createWalletClient } from 'viem'
import { base, baseSepolia } from 'viem/chains'
 

async function testCheckAddressType() {
//   // Create a client
  const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: http(),
  }).extend(walletActionsEip5792())

  // Example addresses
  const eoaAddress = '4bEf0221d6F7Dd0C969fe46a4e9b339a84F52FDF'; // My EOA
  const smartContractAddress = 'c484bcd10ab8ad132843872deb1a0adc1473189c'; // Our sepolia paymaster, can be any smart contract address. Note: The bundler address does not work and returns EOA
  const smartWalletAddress = '06C36AA794d96fD7816deA8De80d4B8Aa9DB283c'; // My Smart Wallet Address
  const invalidAddress = 'invalid-address';
  // Test EOA address
  const eoaResult = await checkAddressType({ walletClient, address: eoaAddress });
  console.log('EOA Result:', eoaResult);
  console.log('\n');

  // Test Smart Contract address
  const smartContractResult = await checkAddressType({ walletClient, address: smartContractAddress });
  console.log('Smart Contract Result:', smartContractResult);
  console.log('\n');

  // Test Coinbase Smart Wallet address
  const smartWalletResult = await checkAddressType({
    walletClient,
    address: smartWalletAddress,
  });
  console.log('Smart Wallet Result: ', smartWalletResult);
  console.log('\n');

  // Test invalid address
  const invalidAddressResult = await checkAddressType({ walletClient, address: invalidAddress });
  console.log('Invalid Address: ', invalidAddressResult);
  console.log('\n');
}

testCheckAddressType().catch(console.error);

// run with `npx tsx src/scriptTestCheckAddressType.ts`
