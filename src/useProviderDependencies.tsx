import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { type Config, WagmiProviderNotFoundError, useConfig } from 'wagmi';

export function useProviderDependencies() {
  // Check the context for WagmiProvider
  // Wagmi configuration defaults to the provided config if it exists
  // Otherwise, use the OnchainKit-provided Wagmi configuration
  let providedWagmiConfig: Config | null = null;
  let providedQueryClient: QueryClient | null = null;

  try {
    providedWagmiConfig = useConfig();
  } catch (error) {
    if (!(error instanceof WagmiProviderNotFoundError)) {
      console.error('Error fetching WagmiProvider, using default:', error);
      throw error;
    }
  }

  try {
    providedQueryClient = useQueryClient();
  } catch (error) {
    if (
      !(
        (error as Error).message ===
        'No QueryClient set, use QueryClientProvider to set one'
      )
    ) {
      console.error('Error fetching QueryClient, using default:', error);
      throw error;
    }
  }

  return useMemo(() => {
    return {
      providedWagmiConfig,
      providedQueryClient,
    };
  }, [providedWagmiConfig, providedQueryClient]);
}
