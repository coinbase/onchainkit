import type { Meta, StoryObj } from '@storybook/react';
import {CommercePayButton} from './CommercePayButton'

const meta = {
  title: 'Commerce Pay Button',
  component: CommercePayButton,
  args: {
    chargeId: "a0a94171-4b24-4097-bc52-7931f9ede42d"
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommercePayButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
