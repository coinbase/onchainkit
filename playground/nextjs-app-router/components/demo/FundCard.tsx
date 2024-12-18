import { FundCard } from '@coinbase/onchainkit/fund';

export default function FundCardDemo() {
  const amountInputSnippets = [
    {
      value: '1',
      currencySignOrSymbol: 'ETH',
      type: 'crypto'
    },
    {
      value: '2',
      currencySignOrSymbol: 'ETH',
      type: 'crypto'
    },
    {
      value: '0.1',
      currencySignOrSymbol: 'ETH',
      type: 'crypto'
    },
    {
      value: '100',
      currencySignOrSymbol: '$',
      type: 'fiat'
    },
    {
      value: '200',
      currencySignOrSymbol: '$',
      type: 'fiat'
    },
    {
      value: '25',
      currencySignOrSymbol: '$',
      type: 'fiat'
    },
  ];
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundCard assetSymbol="ETH" amountInputSnippets={amountInputSnippets}/>
    </div>
  );
}
