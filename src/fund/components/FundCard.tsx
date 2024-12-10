import { background, border, cn, color, text } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import { fetchOnrampConfig } from '../utils/fetchOnrampConfig';
import { fetchOnrampOptions } from '../utils/fetchOnrampOptions';
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
        background.default,
        color.foreground,
        'flex w-[440px] flex-col p-6',
        text.headline,
        border.radius,
        border.lineDefault,
      )}
    >
      <FundProvider asset={assetSymbol}>
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
