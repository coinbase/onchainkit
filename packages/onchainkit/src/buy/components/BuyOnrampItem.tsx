'use client';
import type { SwapUnit } from '@/swap/types';
import { usdcToken } from '@/token/constants';
import { useCallback, useMemo } from 'react';
import { applePaySvg } from '../../internal/svg/applePaySvg';
import { cardSvg } from '../../internal/svg/cardSvg';
import { coinbaseLogoSvg } from '../../internal/svg/coinbaseLogoSvg';
import { cn, color, pressable, text } from '../../styles/theme';
import { useBuyContext } from './BuyProvider';

type OnrampItemReact = {
  name: string;
  description: string;
  onClick: () => void;
  svg?: React.ReactNode;
  icon: string;
  to?: SwapUnit;
};

const ONRAMP_ICON_MAP: Record<string, React.ReactNode> = {
  applePay: applePaySvg,
  coinbasePay: coinbaseLogoSvg,
  creditCard: cardSvg,
};

export function BuyOnrampItem({
  name,
  description,
  onClick,
  icon,
  to,
}: OnrampItemReact) {
  const { setIsDropdownOpen } = useBuyContext();

  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    onClick();
  }, [onClick, setIsDropdownOpen]);

  const fiatAmount = useMemo(() => {
    // if token is USDC the usd estimate
    // can be slightly off (4.9999999) so
    // use amount instead to prevent disabling of onramp
    if (
      to?.token?.address?.toLowerCase() === usdcToken?.address.toLowerCase()
    ) {
      return to?.amount;
    }
    return to?.amountUSD;
  }, [to]);

  // Debit and Apple Pay have a minimum purchase amount of $5
  const isDisabled =
    !fiatAmount || (Number.parseFloat(fiatAmount) < 5 && name !== 'Coinbase');

  const message = useMemo(() => {
    if (isDisabled) {
      return 'Minimum purchase amount is $5';
    }
    return description;
  }, [isDisabled, description]);

  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        text.label2,
        !isDisabled && pressable.default,
        isDisabled && color.foregroundMuted,
      )}
      onClick={handleClick}
      type="button"
      data-testid={`ock-${icon}OnrampItem`}
      disabled={isDisabled}
    >
      <div className="flex h-9 w-9 items-center justify-center">
        {ONRAMP_ICON_MAP[icon]}
      </div>
      <div className="flex flex-col items-start">
        <div className="relative flex items-center gap-1">
          <div>{name}</div>
        </div>
        <div className={cn('text-xs', color.foregroundMuted)}>{message}</div>
      </div>
    </button>
  );
}
