import { type PropsWithChildren } from 'react';
import { base } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@coinbase/onchainkit/styles.css';

export function RootProvider({ children }: PropsWithChildren) {
  return (
    <OnchainKitProvider
      apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
        },
        wallet: {
          display: 'modal',
          preference: 'all',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}
