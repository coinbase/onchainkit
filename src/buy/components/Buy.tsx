import { useEffect, useRef } from 'react';
import { cn } from '../../styles/theme';
import { FALLBACK_DEFAULT_MAX_SLIPPAGE } from '../../swap/constants';
import type { BuyReact } from '../types';
import { BuyAmountInput } from './BuyAmountInput';
import { BuyButton } from './BuyButton';
import { BuyDropdown } from './BuyDropdown';
import { BuyMessage } from './BuyMessage';
import { BuyProvider, useBuyContext } from './BuyProvider';

export function BuyContent({ className }: { className?: string }) {
  const { isDropdownOpen, setIsDropdownOpen } = useBuyContext();
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
  experimental = { useAggregator: false },
  isSponsored = false,
  onError,
  onStatus,
  onSuccess,
  toToken,
  fromToken,
  projectId,
}: BuyReact) {
  return (
    <BuyProvider
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
      <BuyContent className={className} />
    </BuyProvider>
  );
}
