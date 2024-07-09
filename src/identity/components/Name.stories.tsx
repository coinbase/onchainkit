import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Name } from './Name';

const queryClient = new QueryClient();

const meta = {
  title: 'Identity/Name',
  component: Name,
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={queryClient}>
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
