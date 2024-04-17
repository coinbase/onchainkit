import { ReactNode, createContext, useMemo } from 'react';
import { Chain } from 'viem';
import { base } from 'viem/chains';

import { EASSchemaUid } from './identity/types';
import { checkHashLength } from './utils/checkHashLength';

type OnchainKitContextType = {
  identity: {
    eas: {
      schemaId: EASSchemaUid;
      chain: Chain;
    };
  };
};

export const OnchainKitContext = createContext<OnchainKitContextType | null>(null);

type OnchainKitProviderProps = {
  identity: {
    easConfig: {
      schemaId: EASSchemaUid;
      chain?: Chain;
    };
  };
  children: ReactNode;
};

export function OnchainKitProvider({ identity: { easConfig }, children }: OnchainKitProviderProps) {
  if (!checkHashLength(easConfig.schemaId, 64)) {
    throw Error('EAS schemaId must be 64 characters prefixed with "0x"');
  }
  const value = useMemo(() => {
    const { schemaId, chain = base } = easConfig;
    return {
      identity: {
        eas: {
          schemaId,
          chain,
        },
      },
    };
  }, [easConfig]);
  return <OnchainKitContext.Provider value={value}>{children}</OnchainKitContext.Provider>;
}
