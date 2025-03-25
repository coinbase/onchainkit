import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'viem/chains';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { TransactionButton } from './TransactionButton';
import { TransactionProvider } from './TransactionProvider';

const wagmiConfig = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const meta = {
  title: 'Transaction/Button',
  decorators: [
    (Story) => (
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={new QueryClient()}>
          <TransactionProvider address="0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1">
            <Story />
          </TransactionProvider>
        </QueryClientProvider>
      </WagmiProvider>
    ),
  ],
  component: TransactionButton,
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof TransactionButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
