import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import React from 'react';
import type { Token } from '../types';
import { TokenSelectDropdown } from './TokenSelectDropdown';

const tokens: Token[] = [
  {
    address: '',
    chainId: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
  },
  {
    name: 'Dai',
    address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    symbol: 'DAI',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/d0/d7/d0d7784975771dbbac9a22c8c0c12928cc6f658cbcf2bbbf7c909f0fa2426dec-NmU4ZWViMDItOTQyYy00Yjk5LTkzODUtNGJlZmJiMTUxOTgy',
    chainId: 8453,
  },
];

const meta = {
  title: 'Token/TokenSelectDropdown',
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [token, setToken] = React.useState<Token | undefined>(undefined);
    return (
      <TokenSelectDropdown token={token} setToken={setToken} options={tokens} />
    );
  },
  tags: ['autodocs'],
  argTypes: {},
  args: {
    setToken: fn(),
    options: tokens,
  },
} satisfies Meta<typeof TokenSelectDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
