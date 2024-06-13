import { ENTRYPOINT_ADDRESS_V06 } from 'permissionless';
import type { IsValidAAEntrypointOptions } from './types';

/**
 * Verify the Account-Abstraction entrypoint before sponsoring a transaction.
 */
export function isValidAAEntrypoint({
  entrypoint,
}: IsValidAAEntrypointOptions): boolean {
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) {
    return false;
  }
  return true;
}
