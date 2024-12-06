import { border, cn, text } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import { FundCardHeader } from './FundCardHeader';
import { FundForm } from './FundForm';
import { FundProvider } from './FundProvider';

type Props = {
  assetSymbol: string;
  placeholder?: string | React.ReactNode;
  headerText?: string;
  buttonText?: string;
};

export function FundCard({
  assetSymbol,
  buttonText = 'Buy',
  headerText,
}: Props) {
  const componentTheme = useTheme();

  return (
    <div
      className={cn(
        componentTheme,
        'flex w-[440px] flex-col p-3',
        text.headline,
        border.radius,
        border.lineHeavy
      )}
    >
      <FundProvider>
        <FundCardHeader headerText={headerText} assetSymbol={assetSymbol} />

        <FundForm
          assetSymbol={assetSymbol}
          buttonText={buttonText}
          headerText={headerText}
        />
      </FundProvider>
    </div>
  );
}
