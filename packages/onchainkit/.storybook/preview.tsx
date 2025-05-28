import React from 'react';
import type { Preview } from '@storybook/react';
import { OnchainKitProvider } from '../src/OnchainKitProvider';
import { base } from 'wagmi/chains';
import '../src/styles/index.css';

function getApiKey() {
  try {
    return process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

const preview: Preview = {
  decorators: [
    (Story) => (
      <OnchainKitProvider
        apiKey={getApiKey()}
        chain={base}
        config={{
          appearance: {
            mode: 'auto',
          },
          wallet: {
            display: 'modal',
          },
        }}
      >
        <Story />
      </OnchainKitProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
