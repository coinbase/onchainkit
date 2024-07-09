import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SearchIcon } from './SearchIcon';

const meta = {
  title: 'Token/SearchIcon',
  component: SearchIcon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof SearchIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
