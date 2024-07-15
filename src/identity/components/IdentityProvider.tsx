import { createContext, useContext, useState } from 'react';
import type { Address } from 'viem';
import { useValue } from '../../internal/hooks/useValue';
import { useOnchainKit } from '../../useOnchainKit';
import type { IdentityContextType, IdentityProviderReact } from '../types';

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
