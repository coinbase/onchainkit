import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TokenChip } from './TokenChip';

const meta = {
  title: 'Token/TokenChip',
  component: TokenChip,
  tags: ['autodocs'],
  argTypes: {},
  args: {
    onClick: fn(),
    token: {
      address: '',
      chainId: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      image:
        'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
    },
  },
} satisfies Meta<typeof TokenChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
