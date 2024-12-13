import { useEffect, useRef } from 'react';
import { cn } from '../../styles/theme';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../constants';
import type { SwapLiteReact } from '../types';
import { SwapLiteButton } from './SwapLiteButton';
import { SwapLiteDropdown } from './SwapLiteDropdown';
import { SwapLiteAmountInput } from './SwapLiteAmountInput';
import { SwapLiteProvider, useSwapLiteContext } from './SwapLiteProvider';
import { SwapLiteMessage } from './SwapLiteMessage';

export function SwapLiteContent({ className }: { className?: string }) {
  const { isDropdownOpen, setIsDropdownOpen } = useSwapLiteContext();
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
        <SwapLiteAmountInput />
        <SwapLiteButton />
        {isDropdownOpen && <SwapLiteDropdown />}
      </div>
      <SwapLiteMessage />
    </div>
  );
}
export function SwapLite({
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
  projectId,
}: SwapLiteReact) {
  return (
    <SwapLiteProvider
      config={config}
      experimental={experimental}
      isSponsored={isSponsored}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
      toToken={toToken}
      fromToken={fromToken}
      projectId={projectId}
    >
      <SwapLiteContent className={className} />
    </SwapLiteProvider>
  );
}
