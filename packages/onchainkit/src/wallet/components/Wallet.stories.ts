import type { Meta, StoryObj } from '@storybook/react';

import { Wallet } from './Wallet';

const meta = {
  title: 'Wallet/Wallet',
  component: Wallet,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Wallet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
