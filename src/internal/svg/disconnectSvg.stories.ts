import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { disconnectSvg } from './disconnectSvg';

const SvgWrapper: React.FC = () =>
  React.createElement(
    'div',
    {
      style: { width: '100px', height: '100px', viewBox: '0 0 24 24' },
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
