import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia, optimism } from 'viem/chains';
import { Name } from './Name';

const meta = {
  title: 'Identity/Name',
  component: Name,
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  tags: ['autodocs'],
  args: {
    address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1',
  },
} satisfies Meta<typeof Name>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const BaseSepolia: Story = {
  args: {
    address: '0xe5546B2Bd78408DB7908F86251e7f694CF6397b9',
    chain: baseSepolia,
  },
};

// This should default to ENS domain
export const BaseSepoliaWithoutDomain: Story = {
  args: {
    address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1',
    chain: baseSepolia,
  },
};

export const UnsupportedChain: Story = {
  args: {
    address: '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    chain: optimism,
  },
};
