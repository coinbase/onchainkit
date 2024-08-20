import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { disconnectSvg } from './disconnectSvg';

const meta = {
  title: 'Wallet/disconnectSvg',
  component: disconnectSvg,
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof disconnectSvg>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
