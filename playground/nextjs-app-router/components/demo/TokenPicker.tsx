'use client';

import { Token } from '../../../../src/token';
import { TokenPicker } from '../../../../src/token/components/TokenPicker';
import { useState } from 'react';

export default function TokenPickerDemo() {
  const [pickedToken, setPickedToken] = useState<Token>({
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    chainId: 1,
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  });

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
      address: '0x0000000000000000000000000000000000000000',
      chainId: 8453,
      image: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <TokenPicker
        pickedToken={pickedToken}
        defaultTokens={defaultTokens}
        onTokenPicked={setPickedToken}
        onError={(error) => console.error(error)}
      />
    </div>
  );
}
