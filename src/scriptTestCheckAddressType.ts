import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { checkAddressType } from './checkAddressType';

async function testCheckAddressType() {
  // Create a real client
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  // Example addresses
  const eoaAddress = '4bEf0221d6F7Dd0C969fe46a4e9b339a84F52FDF'; // My EOA
  const smartContractAddress = 'c484bcd10ab8ad132843872deb1a0adc1473189c'; // Our sepolia paymaster, can be any smart contract address. Note: The bundler address does not work and returns EOA
  const smartWalletAddress = '06C36AA794d96fD7816deA8De80d4B8Aa9DB283c'; // My Smart Contract Address

  // Test EOA address
  const eoaResult = await checkAddressType({ client, address: eoaAddress });
  console.log('EOA Result:', eoaResult);

  // Test Smart Contract address
  const smartContractResult = await checkAddressType({ client, address: smartContractAddress });
  console.log('Smart Contract Result:', smartContractResult);

  // Test Coinbase Smart Wallet address
  const smartWalletResult = await checkAddressType({
    client,
    address: smartWalletAddress,
  });
  console.log('Smart Wallet Result:', smartWalletResult);
}

testCheckAddressType().catch(console.error);

// run with `npx tsx src/scriptTestCheckAddressType.ts`
