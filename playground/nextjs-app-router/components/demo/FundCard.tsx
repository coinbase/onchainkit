import { FundCard } from '@coinbase/onchainkit/fund';
import type { PresetAmountInputs } from '../../onchainkit/esm/fund/types';

export default function FundCardDemo() {
  const presetAmountInputs: PresetAmountInputs = ['10', '20', '100'];

  return (
    <div className="mx-auto min-w-[394px] max-w-[800px] gap-8">
      <FundCard
        assetSymbol="ETH"
        country="US"
        currency="USD"
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
