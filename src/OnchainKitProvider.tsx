import { ReactNode, createContext, useMemo } from 'react';
import { Address, Chain } from 'viem';

import { EASSchemaUid } from './identity/types';
import { checkHashLength } from './utils/checkHashLength';

type OnchainKitContextType = {
  address: Address;
  chain: Chain;
  schemaId: EASSchemaUid;
};

export const OnchainKitContext = createContext<OnchainKitContextType | null>(null);

type OnchainKitProviderProps = {
  address: Address;
  chain: Chain;
  children: ReactNode;
  schemaId: EASSchemaUid;
};

export function OnchainKitProvider({
  address,
  chain,
  children,
  schemaId,
}: OnchainKitProviderProps) {
  if (!checkHashLength(schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }
  const value = useMemo(() => {
    return {
      address,
      chain,
      schemaId,
    };
  }, [address, chain, schemaId]);
  return <OnchainKitContext.Provider value={value}>{children}</OnchainKitContext.Provider>;
}
