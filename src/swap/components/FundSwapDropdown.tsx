import { useCallback, useMemo } from 'react';
import { background, cn, color, text } from '../../styles/theme';
import { TokenImage } from '../../token';
import type { SwapUnit } from '../types';
import { useFundSwapContext } from './FundSwapProvider';
import { appleSvg } from '../../internal/svg/appleSvg';
import { coinbaseLogoSvg } from '../../internal/svg/coinbaseLogoSvg';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';

type OnrampItemReact = {
  title: string;
  subtitle: string;
  onClick: () => void;
  svg: React.ReactNode;
};

function OnrampItem({ title, subtitle, onClick, svg }: OnrampItemReact) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        'hover:bg-[var(--ock-bg-inverse)]',
      )}
      onClick={onClick}
      type="button"
    >
      <div className="h-9 w-9 flex items-center justify-center">{svg}</div>
      <div className="flex flex-col items-start">
        <div>{title}</div>
        <div className={cn('text-xs', color.foregroundMuted)}>{subtitle}</div>
      </div>
    </button>
  );
}

function TokenItem({ swapUnit }: { swapUnit: SwapUnit }) {
  const { handleSubmit, setIsDropdownOpen } = useFundSwapContext();

  if (!swapUnit?.token) {
    return null;
  }

  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    handleSubmit(swapUnit);
  }, [handleSubmit, swapUnit, setIsDropdownOpen]);

  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        'hover:bg-[var(--ock-bg-inverse)]',
      )}
      onClick={handleClick}
      type="button"
    >
      <TokenImage token={swapUnit.token} size={36} />
      <div className="flex flex-col items-start">
        <div>
          {swapUnit.amount} {swapUnit.token.name}
        </div>
        <div
          className={cn('text-xs', color.foregroundMuted)}
        >{`Balance: ${swapUnit.balance}`}</div>
      </div>
    </button>
  );
}

export function FundSwapDropdown() {
  const { to, fromETH, fromUSDC } = useFundSwapContext();

  console.log({ to });

  const handleApplePayClick = useCallback(() => {
    console.log('apple pay');
  }, []);

  const handleCoinbasePayClick = useCallback(() => {
    console.log('coinbase pay');
  }, []);

  const formattedAmountUSD = useMemo(() => {
    if (!to?.amountUSD || to?.amountUSD === '0') {
      return null;
    }
    const roundedAmount = Number(getRoundedAmount(to?.amountUSD, 2));
    return `$${roundedAmount.toFixed(2)}`;
  }, [to?.amountUSD]);

  return (
    <div
      className={cn(
        color.foreground,
        background.alternate,
        'absolute right-0 bottom-0 flex translate-y-[110%] flex-col gap-2',
        'rounded p-2',
      )}
    >
      <div className="px-2 pt-2">Buy with</div>
      <TokenItem swapUnit={fromETH} />
      <TokenItem swapUnit={fromUSDC} />
      <OnrampItem
        title="$25"
        subtitle="Apple Pay"
        onClick={handleApplePayClick}
        svg={appleSvg}
      />
      <OnrampItem
        title="$25"
        subtitle="Coinbase"
        onClick={handleCoinbasePayClick}
        svg={coinbaseLogoSvg}
      />
      {!!formattedAmountUSD && (
        <div
          className={cn('flex justify-end', text.legal, color.foregroundMuted)}
        >{`${to?.amount} ${to?.token?.name} ≈ ${formattedAmountUSD}`}</div>
      )}
    </div>
  );
}
