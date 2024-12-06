import { FundButton, FundProvider, FundForm, FundCard } from '@coinbase/onchainkit/fund';

export default function FundDemo() {
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundButton />

      <FundCard assetSymbol="ETH"/>
    </div>
  );
}
