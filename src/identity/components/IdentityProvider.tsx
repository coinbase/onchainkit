import { type ReactNode, useState, createContext, useContext } from 'react';
import type { Address, Chain } from 'viem';
import { useValue } from '../../internal/hooks/useValue';
import type { IdentityContextType, IdentityProviderReact } from '../types';
import { useOnchainKit } from '../../useOnchainKit';

const emptyContext = {} as IdentityContextType;

export const IdentityContext = createContext<IdentityContextType>(emptyContext);

export function useIdentityContext() {
  return useContext(IdentityContext);
}

export function IdentityProvider(props: IdentityProviderReact) {
  const [address, setAddress] = useState(props.address ?? ('' as Address));
  const { chain: contextChain } = useOnchainKit();
  const value = useValue({
    address,
    chain: props.chain ?? contextChain,
    schemaId: props.schemaId,
    setAddress,
  });

  return (
    <IdentityContext.Provider value={value}>
      {props.children}
    </IdentityContext.Provider>
  );
}
