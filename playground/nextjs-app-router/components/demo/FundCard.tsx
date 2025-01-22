import { FundCard } from '@coinbase/onchainkit/fund';
import type { PresetAmountInputs } from '../../onchainkit/esm/fund/types';

export default function FundCardDemo() {
  const presetAmountInputs: PresetAmountInputs = ['10', '20', '100'];

  return (
    <div className="mx-auto grid w-[500px] gap-8">
      <FundCard
        assetSymbol="ETH"
        country="US"
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
