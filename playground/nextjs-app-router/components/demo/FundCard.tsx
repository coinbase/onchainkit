import { FundCard } from '@coinbase/onchainkit/fund';
export default function FundCardDemo() {
  return (
    <div className="mx-auto grid w-[500px] gap-8">
      <FundCard
        assetSymbol="ETH"
        country="US"
        onError={(error) => {
          console.log('error', error);
        }}
        onStatus={(status) => {
          console.log('status', status);
        }}
        onSuccess={() => {
          console.log('success');
        }}
      />
    </div>
  );
}
