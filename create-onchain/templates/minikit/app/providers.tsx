'use client';

import { base } from 'wagmi/chains';
import { OnchainKitProvider, MiniKitProvider } from '@coinbase/onchainkit';
import type { ReactNode } from 'react';

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{ 
          appearance: { 
            mode: 'auto',
          },
          wallet: {
            display: 'modal'
          }
        }}
      >
        {props.children}
      </OnchainKitProvider>
    </MiniKitProvider>
  );
}

