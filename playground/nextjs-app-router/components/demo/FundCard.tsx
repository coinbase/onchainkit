import { FundCard } from '@coinbase/onchainkit/fund';

export default function FundCardDemo() {
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundCard assetSymbol="ETH" />
    </div>
  );
}
