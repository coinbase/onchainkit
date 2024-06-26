import { ReactNode, useState, createContext, useContext } from 'react';
import { Address } from 'viem';
import { useValue } from '../../internal/hooks/useValue';
import type { IdentityContextType } from '../types';

const emptyContext = {} as IdentityContextType;

export const IdentityContext = createContext<IdentityContextType>(emptyContext);

export function useIdentityContext() {
  return useContext(IdentityContext);
}

type IdentityProvider = {
  address?: Address;
  children: ReactNode;
  schemaId?: Address | null;
};

export function IdentityProvider(props: IdentityProvider) {
  const [address, setAddress] = useState(props.address ?? ('' as Address));

  const value = useValue({
    address,
    schemaId: props.schemaId,
    setAddress,
  });

  return (
    <IdentityContext.Provider value={value}>
      {props.children}
    </IdentityContext.Provider>
  );
}
