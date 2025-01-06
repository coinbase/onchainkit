import { FundCard } from '@coinbase/onchainkit/fund';
import type { AmountInputTypeReact } from '../../onchainkit/src/fund/types';

export default function FundCardDemo() {
  const amountInputSnippets = [
    {
      value: '1',
      currencySignOrSymbol: 'ETH',
      type: 'crypto' as AmountInputTypeReact,
    },
    {
      value: '2',
      currencySignOrSymbol: 'ETH',
      type: 'crypto' as AmountInputTypeReact,
    },
    {
      value: '3.12387687687',
      currencySignOrSymbol: 'ETH',
      type: 'crypto' as AmountInputTypeReact,
    },
    {
      value: '100',
      currencySignOrSymbol: '$',
      type: 'fiat' as AmountInputTypeReact,
    },
    {
      value: '200',
      currencySignOrSymbol: '$',
      type: 'fiat' as AmountInputTypeReact,
    },
    {
      value: '25',
      currencySignOrSymbol: '$',
      type: 'fiat' as AmountInputTypeReact,
    },
  ];
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundCard assetSymbol="ETH" amountInputSnippets={amountInputSnippets} />
    </div>
  );
}
