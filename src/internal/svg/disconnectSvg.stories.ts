import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { disconnectSvg } from './disconnectSvg';

// Wrapper component to display the SVG
const SvgWrapper: React.FC = () =>
  React.createElement(
    'div',
    {
      style: { width: '100px', height: '100px' },
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
