import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';
import { baseSepolia } from 'viem/chains';
import type { UserOperation } from 'permissionless';

/**
 * Given that your API will be accessible on the web,
 * it is crucial to ensure that it cannot be misused.
 *
 * This method verifies that the transaction is valid
 * for sponsorship (aka use Paymaster to avoid paying gas fees).
 */
export async function isValidSponsorTransaction({
  chainId,
  entrypoint,
  userOp,
}: {
  chainId: number;
  entrypoint: string;
  userOp: UserOperation<'v0.6'>;
}) {
  // Check chain id
  if (chainId !== baseSepolia.id) {
    return false;
  }
  // Check entrypoint
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) {
    return false;
  }
  return true;
}
