import type { EASSchemaUid } from '@/identity/types';
import type { ReactNode } from 'react';
import type { Address } from 'viem';
import type { Chain } from 'wagmi/chains';
import type { AppConfig } from './core/types';

/**
 * Note: exported as public Type
 */
export type OnchainKitProviderReact = {
  address?: Address;
  analytics?: boolean;
  apiKey?: string;
  chain: Chain;
  children: ReactNode;
  config?: AppConfig;
  sessionId?: string;
  projectId?: string;
  rpcUrl?: string;
  schemaId?: EASSchemaUid;
};
