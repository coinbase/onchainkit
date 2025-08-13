'use client';

import type { ReactNode } from 'react';
import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'snake',
          name: 'MiniKit',
          logo: 'https://onchainkit.xyz/playground/snake.png',
        },
      }}
      miniKit={{
        enabled: true,
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
