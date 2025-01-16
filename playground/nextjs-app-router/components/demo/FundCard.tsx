import { FundCard } from '@coinbase/onchainkit/fund';
import type { AmountInputType } from '../../onchainkit/src/fund/types';

export default function FundCardDemo() {
  const presetAmountInputs = [
    {
      value: '1',
      type: 'crypto' as AmountInputType,
    },
    {
      value: '2',
      type: 'crypto' as AmountInputType,
    },
    {
      value: '3.25',
      type: 'crypto' as AmountInputType,
    },
    {
      value: '10',
      type: 'fiat' as AmountInputType,
    },
    {
      value: '20',
      type: 'fiat' as AmountInputType,
    },
    {
      value: '50',
      type: 'fiat' as AmountInputType,
    },
  ];
  return (
    <div className="mx-auto grid w-[500px] gap-8">
      <FundCard
        assetSymbol="ETH"
        country="US"
        presetAmountInputs={presetAmountInputs}
        onError={(error) => {
          console.log('FundCard onError', error);
        }}
        onStatus={(status) => {
          console.log('FundCard onStatus', status);
        }}
        onSuccess={() => {
          console.log('FundCard onSuccess');
        }}
      />
    </div>
  );
}
