import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TokenPicker } from './TokenPicker';
import type { Token } from '../types';

const defaultTokens: Token[] = [
  {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    chainId: 1,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    address: '0x833589fCD6eDb6E08B1Daf2d5eB29B519B68F139',
    chainId: 8453,
    image: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  },
  {
    name: 'DEGEN',
    symbol: 'DEGEN',
    decimals: 18,
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    chainId: 8453,
    image: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  },
];

const meta = {
  title: 'Token/TokenPicker',
  component: TokenPicker,
  tags: ['autodocs'],
  args: {
    pickedToken: defaultTokens[0],
    defaultTokens,
    onTokenPicked: fn(),
    onError: fn(),
  },
} satisfies Meta<typeof TokenPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const NoDefaultTokens: Story = {
  args: {
    defaultTokens: [],
  },
};

export const WithError: Story = {
  args: {
    onError: fn((error: Error) => console.error(error)),
  },
}; 