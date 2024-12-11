import type { Meta, StoryObj } from '@storybook/react';
import { Address } from './Address';

const meta = {
  title: 'Identity/Address',
  component: Address,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    address: '0x02feeb0AdE57b6adEEdE5A4EEea6Cf8c21BeB6B1',
  },
} satisfies Meta<typeof Address>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
