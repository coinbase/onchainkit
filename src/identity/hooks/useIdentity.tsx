import { ReactNode, createContext, useCallback, useContext, useMemo } from 'react';
import { Address } from 'viem';
import { base } from 'viem/chains';

import { getEASAttestations } from '../getEASAttestations';
import { SchemaId } from '../types';
import { checkAddress } from '../checkAddress';

type IdentityContextType = {
  schemaId: string;
};

const IdentityContext = createContext<IdentityContextType | null>(null);

type EasConfig = {
  schemaId: SchemaId;
};

type IdentityProviderProps = {
  easConfig: EasConfig;
  children: ReactNode;
};

export function IdentityProvider({ easConfig, children }: IdentityProviderProps) {
  if (!checkAddress(easConfig.schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }

  const value = useMemo(() => {
    const { schemaId } = easConfig;

    return {
      schemaId,
    };
  }, [easConfig]);

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
}

export function useIdentity() {
  const context = useContext(IdentityContext);

  if (context === null) {
    throw Error('useIdentity must be used within an IdentityProvider');
  }

  return context;
}
