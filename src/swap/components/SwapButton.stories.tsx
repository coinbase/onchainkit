import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { SwapButton } from './SwapButton';
import { SwapProvider } from './SwapProvider';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const meta = {
  title: 'Swap/Button',
  decorators: [
    (Story) => (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={new QueryClient()}>
          <SwapProvider address="0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1">
            <Story />
          </SwapProvider>
        </QueryClientProvider>
      </WagmiProvider>
    ),
  ],
  component: SwapButton,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
  },
  args: {
    disabled: true,
    onSubmit: fn(),
  },
} satisfies Meta<typeof SwapButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
