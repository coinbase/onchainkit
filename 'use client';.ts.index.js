'use client';

import { base } from 'viem/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';

const App = () => {
      return (
            <OnchainKitProvider apiKey="07wA865qq-c_9hrX19v9ZWS8aKlTTPec" chain={base}>
                  <YourKit />
                </OnchainKitProvider>
      );
};