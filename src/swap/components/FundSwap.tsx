import { useEffect, useRef } from 'react';
import { cn } from '../../styles/theme';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import type { FundSwapReact } from '../types';
import { FundSwapButton } from './FundSwapButton';
import { FundSwapDropdown } from './FundSwapDropdown';
import { FundSwapInput } from './FundSwapInput';
import { FundSwapProvider, useFundSwapContext } from './FundSwapProvider';
//
export function FundSwapContent({ className }: { className?: string }) {
  const { isDropdownOpen, setIsDropdownOpen } = useFundSwapContext();
  const walletContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the wallet component to close the dropdown.
  useEffect(() => {
    const handleClickOutsideComponent = (event: MouseEvent) => {
      if (
        walletContainerRef.current &&
        !walletContainerRef.current.contains(event.target as Node) &&
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
      ref={walletContainerRef}
      className={cn('relative flex items-center gap-4', className)}
    >
      <FundSwapInput />
      <FundSwapButton />
      {isDropdownOpen && <FundSwapDropdown />}
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
    >
      <FundSwapContent className={className} />
    </FundSwapProvider>
  );
}
