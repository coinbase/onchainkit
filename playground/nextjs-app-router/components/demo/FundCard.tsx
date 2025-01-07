import { FundCard } from '@coinbase/onchainkit/fund';

export default function FundCardDemo() {
  return (
    <div className="mx-auto grid w-1/2 gap-8">
      <FundCard
        assetSymbol="ETH"
        HeaderComponent={CustomHeaderComponent}
        headerText="Test header text"
      />
    </div>
  );
}

const CustomHeaderComponent = ({
  headerText,
  assetSymbol,
}: {
  headerText?: string;
  assetSymbol?: string;
}) => {
  return (
    <div>
      {headerText} ---- {assetSymbol}
    </div>
  );
};
