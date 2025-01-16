import { FundCard } from '@coinbase/onchainkit/fund';
import type { AmountInputTypeReact } from '../../onchainkit/src/fund/types';

export default function FundCardDemo() {
  const amountInputSnippets = [
    {
      value: '1',
      type: 'crypto' as AmountInputTypeReact,
    },
    {
      value: '2',
      type: 'crypto' as AmountInputTypeReact,
    },
    {
      value: '3.25',
      type: 'crypto' as AmountInputTypeReact,
    },
    {
      value: '10',
      type: 'fiat' as AmountInputTypeReact,
    },
    {
      value: '20',
      type: 'fiat' as AmountInputTypeReact,
    },
    {
      value: '50',
      type: 'fiat' as AmountInputTypeReact,
    },
  ];
  return (
    <div className="mx-auto grid w-[500px] gap-8">
      <FundCard
        assetSymbol="ETH"
        country="US"
        amountInputSnippets={amountInputSnippets}
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
