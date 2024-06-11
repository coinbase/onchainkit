import { decodeAbiParameters } from 'viem';
import type { Address, Hex, BlockTag } from 'viem';
import type { PublicClient } from 'viem';
import type { UserOperation } from 'permissionless';

type CheckAddressTypeOptions = {
  address: string;
  client: PublicClient;
};

type CheckAddressTypeResponse = {
  type: 'EOA' | 'Smart Wallet' | 'Smart Contract';
  error?: string;
};

export async function checkAddressType({
  client,
  address,
}: CheckAddressTypeOptions): Promise<CheckAddressTypeResponse> {
  try {
    console.log(`Checking address type for ${address}`);
    
    // Step 1: Get bytecode of the address
    // Bytecode is undefined if the address is an EOA
    const code = await client.getBytecode({ address: `0x${address}` });

    console.log(`Bytecode for address ${address}: ${code}`);

    if (code === undefined) {
      console.error(`Error: Bytecode for address ${address} is undefined`);
      return { type: 'EOA', error: 'Bytecode retrieval returned undefined' };
    }

    // Step 2: Check if the address is an EOA (Externally Owned Account, no bytecode)
    if (!code || code === '0x') {
      return { type: 'EOA' };
    }

    // Step 3: Check if the address is a smart wallet by calling validateUserOp
    if (await validateUserOp(client, address)) {
      return { type: 'Smart Wallet' };
    }

    // Step 7: If the address has bytecode but is not a Smart Wallet, it's a regular smart contract
    return { type: 'Smart Contract' };
  } catch (error) {
    console.error('Error checking address type:', error);
    return { type: 'Smart Contract', error: 'Error checking address type' };
  }
}

// const userOp = {
//     sender: 'valid-proxy-address',
//     } as unknown as UserOperation<'v0.6'>;
// }

async function validateUserOp(client: PublicClient, address: string): Promise<boolean> {
  // call validateUserOp and check for errors
  try {
    const result = await client.callContract({
      to: address,
      data: '0x', // Replace with the actual method data for validateUserOp
    });
    return !!result;
  } catch (error) {
    console.error('Error validating user operation:', error);
    return false;
  }
}
