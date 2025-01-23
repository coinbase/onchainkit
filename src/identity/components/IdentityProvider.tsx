import type {
  IdentityContextType,
  IdentityProviderReact,
} from '@/identity/types';
import { useValue } from '@/internal/hooks/useValue';
import { useOnchainKit } from '@/useOnchainKit';
import { createContext, useContext } from 'react';
import type { Address } from 'viem';

const emptyContext = {} as IdentityContextType;

export const IdentityContext = createContext<IdentityContextType>(emptyContext);

export function useIdentityContext() {
  return useContext(IdentityContext);
}

export function IdentityProvider(props: IdentityProviderReact) {
  const { chain: contextChain } = useOnchainKit();
  const accountChain = props.chain ?? contextChain;

  const value = useValue({
    address: props.address || ('' as Address),
    chain: accountChain,
    schemaId: props.schemaId,
  });

  return (
    <IdentityContext.Provider value={value}>
      {props.children}
    </IdentityContext.Provider>
  );
}
