import { cn, color } from '../../styles/theme';
import { appleSvg } from '../../internal/svg/appleSvg';
import { coinbaseLogoSvg } from '../../internal/svg/coinbaseLogoSvg';
import { cardSvg } from '../../internal/svg/cardSvg';

type OnrampItemReact = {
  name: string;
  description: string;
  onClick: () => void;
  svg?: React.ReactNode;
  icon: string;
};

const ONRAMP_ICON_MAP: Record<string, React.ReactNode> = {
  applePay: appleSvg,
  coinbasePay: coinbaseLogoSvg,
  creditCard: cardSvg,
};

export function FundSwapOnrampItem({ name, description, onClick, icon }: OnrampItemReact) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        'hover:bg-[var(--ock-bg-inverse)]'
      )}
      onClick={onClick}
      type="button"
    >
      <div className="h-9 w-9 flex items-center justify-center">
        {ONRAMP_ICON_MAP[icon]}
      </div>
      <div className="flex flex-col items-start">
        <div>{name}</div>
        <div className={cn('text-xs', color.foregroundMuted)}>
          {description}
        </div>
      </div>
    </button>
  );
}