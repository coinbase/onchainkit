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
    sliced: false,
  },
} satisfies Meta<typeof Name>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Sliced: Story = {
  args: {
    address: '0x1234567891234567881234567891234567891234',
    sliced: true,
  },
};

export const BaseSepolia: Story = {
  args: {
    address: '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    chain: baseSepolia,
  },
};

export const UnsupportedChain: Story = {
  args: {
    address: '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    chain: optimism,
  },
};
