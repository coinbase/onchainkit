import { cn } from '../../styles/theme';
import { useTheme } from '../../useTheme';

type Props = {
  headerText?: string;
  assetSymbol: string;
};

export function FundCardHeader({ headerText, assetSymbol }: Props) {
  const componentTheme = useTheme();
  const defaultHeaderText = `Buy ${assetSymbol.toUpperCase()}`;

  return (
    <div
      className={cn(
        componentTheme,
        'font-display text-[16px]',
        'leading-none outline-none'
      )}
    >
      {headerText || defaultHeaderText}
    </div>
  );
}
