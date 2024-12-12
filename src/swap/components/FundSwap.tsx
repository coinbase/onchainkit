import { useEffect, useRef } from 'react';
import { cn } from '../../styles/theme';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import type { FundSwapReact } from '../types';
import { FundSwapButton } from './FundSwapButton';
import { FundSwapDropdown } from './FundSwapDropdown';
import { FundSwapInput } from './FundSwapInput';
import { FundSwapProvider, useFundSwapContext } from './FundSwapProvider';
import { FundSwapMessage } from './FundSwapMessage';

export function FundSwapContent({ className }: { className?: string }) {
  const { isDropdownOpen, setIsDropdownOpen } = useFundSwapContext();
  const fundSwapContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the wallet component to close the dropdown.
  useEffect(() => {
    const handleClickOutsideComponent = (event: MouseEvent) => {
      if (
        fundSwapContainerRef.current &&
        !fundSwapContainerRef.current.contains(event.target as Node) &&
        isDropdownOpen
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutsideComponent);
    return () =>
      document.removeEventListener('click', handleClickOutsideComponent);
  }, [isDropdownOpen, setIsDropdownOpen]);

  return (
    <div
      ref={fundSwapContainerRef}
      className={cn('relative flex flex-col gap-2', className)}
    >
      <div className={cn('flex items-center gap-4', className)}>
        <FundSwapInput />
        <FundSwapButton />
        {isDropdownOpen && <FundSwapDropdown />}
      </div>
      <FundSwapMessage />
    </div>
  );
}
export function FundSwap({
  config = {
    maxSlippage: FALLBACK_DEFAULT_MAX_SLIPPAGE,
  },
  className,
  experimental = { useAggregator: false },
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  toToken,
  fromToken,
}: FundSwapReact) {
  return (
    <FundSwapProvider
      config={config}
      experimental={experimental}
      isSponsored={isSponsored}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
      toToken={toToken}
      fromToken={fromToken}
    >
      <FundSwapContent className={className} />
    </FundSwapProvider>
  );
}
