import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TokenSearch } from './TokenSearch';

const meta = {
  title: 'Token/TokenSearch',
  component: TokenSearch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    delayMs: 200,
    onChange: fn(),
  },
} satisfies Meta<typeof TokenSearch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
