import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { disconnectSvg } from './disconnectSvg';

const SvgWrapper: React.FC = () =>
  React.createElement(
    'div',
    {
      style: { width: '100%', height: '100%', viewBox: '0 0 16 20' },
    },
    disconnectSvg,
  );

const meta = {
  title: 'Wallet/DisconnectSvg',
  component: SvgWrapper,
  tags: ['autodocs'],
} satisfies Meta<typeof SvgWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
