import { ReactNode } from 'react';
import { Address, Chain } from 'viem';
import { EASSchemaUid } from './identity/types';

/**
 * Note: exported as public Type
 */
export type OnchainKitConfig = {
  address: Address | null; // Address is optional as we may not have an address for new users
  chain: Chain; // Chain must be provided as we need to know which chain to use
  schemaId: EASSchemaUid | null; // SchemaId is optional as not all apps need to use EAS
};

export type SetOnchainKitConfig = Partial<OnchainKitConfig>;

/**
 * Note: exported as public Type
 */
export type OnchainKitContextType = OnchainKitConfig;

export type OnchainKitProviderProps = {
  address?: Address;
  chain: Chain;
  children: ReactNode;
  schemaId?: EASSchemaUid;
};
