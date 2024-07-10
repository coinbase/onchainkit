import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { OnchainKitProvider } from '../../OnchainKitProvider';
import { base } from 'viem/chains';

const meta = {
  title: 'Identity/Avatar',
  component: Avatar,
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1',
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Loading: Story = {
  args: {
    loadingComponent: <div>...</div>,
  },
};

export const Fallback: Story = {
  args: {
    address: '0x1234567891234567881234567891234567891234',
    defaultComponent: (
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid red',
          borderRadius: '50%',
        }}
      />
    ),
  },
};

export const WithBadge: Story = {
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            chain={base}
            schemaId="0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9"
          >
            <Story />
          </OnchainKitProvider>
        </QueryClientProvider>
      );
    },
  ],
  args: {
    children: <Badge />,
  },
};
