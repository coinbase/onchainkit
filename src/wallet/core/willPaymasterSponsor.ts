import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';
import { baseSepolia } from 'viem/chains';
import { WillPaymasterSponsorOptions, WillPaymasterSponsorResponse } from '../types';
import { CB_SW_PROXY_BYTECODE } from '../constants';

/**
 * Given that your API will be accessible on the web,
 * it is crucial to ensure that it cannot be misused.
 *
 * This method verifies that the transaction is valid
 * for sponsorship (aka use Paymaster to avoid paying gas fees).
 */
export async function willPaymasterSponsor({
  chainId,
  client,
  entrypoint,
  userOp,
}: WillPaymasterSponsorOptions): Promise<WillPaymasterSponsorResponse> {
  // Check chain id
  if (chainId !== baseSepolia.id) {
    return { isValid: false, error: 'Invalid chain id', code: 1 };
  }
  // Check entrypoint
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) {
    return { isValid: false, error: 'Invalid entrypoint', code: 2 };
  }
  try {
    // Check the userOp.sender is a proxy with the expected bytecode
    const code = await client.getBytecode({ address: userOp.sender });
    if (code != CB_SW_PROXY_BYTECODE) {
      return { isValid: false, error: 'Invalid bytecode', code: 4 };
    }

    // TODO

    return { isValid: true };
  } catch (e) {
    return { isValid: false, error: 'Check failled', code: 3 };
  }
}
