import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'viem/chains';
import { OnchainKitProvider } from '../../OnchainKitProvider';
import { Avatar } from './Avatar';
import { Badge } from './Badge';

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
        <QueryClientProvider client={new QueryClient()}>
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

export const Base: Story = {
  args: {
    address: '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    chain: base,
  },
};

export const BaseSepolia: Story = {
  args: {
    address: '0xf75ca27C443768EE1876b027272DC8E3d00B8a23',
    chain: baseSepolia,
  },
};

export const BaseDefaultToMainnet: Story = {
  args: {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    chain: base,
  },
};

export const BaseSepoliaDefaultToMainnet: Story = {
  args: {
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    chain: baseSepolia,
  },
};

export const BaseDefaultProfile: Story = {
  args: {
    address: '0xdb39F11c909bFA976FdC27538152C1a0E4f0fCcA',
    chain: base,
  },
};

export const BaseSepoliaDefaultProfile: Story = {
  args: {
    address: '0x8c8F1a1e1bFdb15E7ed562efc84e5A588E68aD73',
    chain: baseSepolia,
  },
};
