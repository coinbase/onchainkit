import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type Config, WagmiProviderNotFoundError, useConfig } from 'wagmi';

/** useProviderDependencies will return the provided Wagmi configuration and QueryClient if they exist in the React context, otherwise it will return null
 * NotFound errors will fail gracefully
 * Unexpected errors will be logged to the console as an error, and will return null for the problematic dependency
 */
export function useProviderDependencies() {
  /** Check the context for WagmiProvider
   * Wagmi configuration defaults to the provided config if it exists
   * Otherwise, use the OnchainKit-provided Wagmi configuration
   */
  let providedWagmiConfig: Config | null = null;
  let providedQueryClient: QueryClient | null = null;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    providedWagmiConfig = useConfig();
  } catch (error) {
    if (!(error instanceof WagmiProviderNotFoundError)) {
      console.error('Error fetching WagmiProvider, using default:', error);
    }
  }

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    providedQueryClient = useQueryClient();
  } catch (error) {
    if (
      !(
        (error as Error).message ===
        'No QueryClient set, use QueryClientProvider to set one'
      )
    ) {
      console.error('Error fetching QueryClient, using default:', error);
    }
  }

  return useMemo(() => {
    return {
      providedWagmiConfig,
      providedQueryClient,
    };
  }, [providedWagmiConfig, providedQueryClient]);
}
