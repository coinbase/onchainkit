'use client';

import type { ReactNode } from 'react';
import { base } from 'wagmi/chains';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';

export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'snake',
          name: 'MiniKit',
          logo: 'https://onchainkit.xyz/playground/snake-icon.png',
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
