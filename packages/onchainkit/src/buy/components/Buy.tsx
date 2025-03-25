'use client';

import { useOutsideClick } from '@/internal/hooks/useOutsideClick';
import { useTheme } from '@/internal/hooks/useTheme';
import { cn } from '@/styles/theme';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '@/swap/constants';
import { useRef } from 'react';
import type { BuyReact } from '../types';
import { BuyAmountInput } from './BuyAmountInput';
import { BuyButton } from './BuyButton';
import { BuyDropdown } from './BuyDropdown';
import { BuyMessage } from './BuyMessage';
import { BuyProvider, useBuyContext } from './BuyProvider';

function BuyContent({ className }: { className?: string }) {
  const componentTheme = useTheme();
  const { isDropdownOpen, setIsDropdownOpen } = useBuyContext();
  const buyContainerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(buyContainerRef, () => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  });

  return (
    <div
      ref={buyContainerRef}
      className={cn('relative flex flex-col gap-2', componentTheme, className)}
    >
      <div className={cn('flex items-center gap-4')}>
        <BuyAmountInput />
        <BuyButton />
        {isDropdownOpen && <BuyDropdown />}
      </div>
      <BuyMessage />
    </div>
  );
}

export function Buy({
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
  },
  className,
  disabled = false,
  experimental = { useAggregator: false },
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  toToken,
  fromToken,
}: BuyReact) {
  return (
    <BuyProvider
      config={config}
      disabled={disabled}
      experimental={experimental}
      isSponsored={isSponsored}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
      toToken={toToken}
      fromToken={fromToken}
    >
      <BuyContent className={className} />
    </BuyProvider>
  );
}
