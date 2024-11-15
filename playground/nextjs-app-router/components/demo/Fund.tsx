import { FundButton, FundProvider, FundForm } from '@coinbase/onchainkit/fund';

export default function FundDemo() {
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundButton />

      <FundProvider>
        <FundForm assetSymbol="ETH" />
      </FundProvider>
    </div>
  );
}
