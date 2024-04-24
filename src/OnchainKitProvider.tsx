import { ReactNode, createContext, useMemo } from 'react';
import { Address, Chain } from 'viem';

import { EASSchemaUid } from './identity/types';
import { checkHashLength } from './utils/checkHashLength';

type OnchainKitContextType = {
  address: Address | null; // Address is optional as we may not have an address for new users
  chain: Chain; // Chain must be provided as we need to know which chain to use
  schemaId: EASSchemaUid | null; // SchemaId is optional as not all apps need to use EAS
};

export const OnchainKitContext = createContext<OnchainKitContextType | null>(null);

type OnchainKitProviderProps = {
  address?: Address;
  chain: Chain;
  children: ReactNode;
  schemaId?: EASSchemaUid;
};

export function OnchainKitProvider({
  address,
  chain,
  children,
  schemaId,
}: OnchainKitProviderProps) {
  if (schemaId && !checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }
  const value = useMemo(() => {
    return {
      address: address ?? null,
      chain: chain,
      schemaId: schemaId ?? null,
    };
  }, [address, chain, schemaId]);
  return <OnchainKitContext.Provider value={value}>{children}</OnchainKitContext.Provider>;
}
