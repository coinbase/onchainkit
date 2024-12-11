import { FundButton, FundProvider, FundForm, FundCard } from '@coinbase/onchainkit/fund';
import { useEffect } from 'react';
import { setOnchainKitConfig } from '../../onchainkit/src';

export default function FundDemo() {
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundButton />

      <FundCard assetSymbol="ETH"/>
    </div>
  );
}
