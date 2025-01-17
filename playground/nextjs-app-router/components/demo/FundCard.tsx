import { FundCard } from '@coinbase/onchainkit/fund';
export default function FundCardDemo() {
  return (
    <div className="mx-auto min-w-[394px] max-w-[800px] gap-8">
      <FundCard
        assetSymbol="ETH"
        country="US"
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
