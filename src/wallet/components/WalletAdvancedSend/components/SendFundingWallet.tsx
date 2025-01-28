import { FundCard } from '@/fund';

export function SendFundingWallet() {
  return (
    <div className="flex flex-col items-center justify-center">
      <FundCard
        headerText="Buy ETH for transaction fees"
        assetSymbol="ETH"
        country="US"
        currency="USD"
        presetAmountInputs={['2', '5', '10']}
        onError={() => {}}
        onStatus={() => {}}
        onSuccess={() => {}}
        className="w-88 border-none"
      />
    </div>
  );
}
