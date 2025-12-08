import { entryPoint06Address } from 'viem/account-abstraction';

export type IsValidAAEntrypointOptions = {
  entrypoint: string;
};

/**
 * Verify the Account-Abstraction entrypoint before sponsoring a transaction.
 */
export function isValidAAEntrypoint({
  entrypoint,
}: IsValidAAEntrypointOptions): boolean {
  if (entrypoint.toLowerCase() !== entryPoint06Address.toLowerCase()) {
    return false;
  }
  return true;
}
