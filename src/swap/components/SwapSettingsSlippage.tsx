import { useState } from 'react';
import { cn } from '../../styles/theme';
import { useBreakpoints } from '../../useBreakpoints';
import type { SwapSettingsSlippageReact } from '../types';

export function SwapSettingsSlippage({ className }: SwapSettingsSlippageReact) {
  const [slippageMode, setSlippageMode] = useState<'Auto' | 'Custom'>('Auto');
  const [customSlippage, setCustomSlippage] = useState('0.5');

  const breakpoint = useBreakpoints();

  if (!breakpoint) {
    return null;
  }

  // Placeholder for SwapSettingsBottomSheet
  // Implement mobile version here, similar to WalletBottomSheet
  //   if (breakpoint === 'sm') {
  //     return <div>Mobile version not implemented</div>;
  //   }

  return (
    <div
      className={cn(
        'right-0 z-10 w-[21.75rem] rounded-lg border border-gray-300 bg-gray-50 p-4 shadow-lg dark:border-gray-700 dark:bg-gray-950',
        className,
      )}
      data-testid="ockSwapSettingsDropdown"
    >
      <h3 className="mb-2 font-semibold text-base text-gray-950 leading-normal dark:text-gray-50">
        Max. slippage
      </h3>
      <p className="mb-2 font-normal font-sans text-gray-600 text-xs leading-4 dark:text-gray-400">
        Your swap will revert if the prices change by more than the selected
        percentage.
      </p>

      <div className="flex items-center gap-2 dark:border-gray-700 dark:bg-gray-950">
        <div className="flex flex-1 rounded-xl border border-gray-300 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-950">
          <button
            type="button"
            className={cn(
              'flex-1 rounded-lg px-3 py-1 font-medium text-sm transition-colors dark:bg-gray-950 dark:text-gray-50',
              slippageMode === 'Auto'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-indigo-900'
                : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
            onClick={() => setSlippageMode('Auto')}
          >
            Auto
          </button>
          <button
            type="button"
            className={cn(
              'flex-1 rounded-lg px-3 py-1 font-medium text-sm transition-colors dark:bg-gray-950 dark:text-gray-50',
              slippageMode === 'Custom'
                ? 'bg-white text-blue-600 shadow-sm dark:bg-indigo-900'
                : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700',
            )}
            onClick={() => setSlippageMode('Custom')}
          >
            Custom
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-950">
          <input
            type="text"
            value={customSlippage}
            onChange={(e) => setCustomSlippage(e.target.value)}
            className="w-12 bg-transparent pl-1 font-normal font-sans text-gray-900 text-sm leading-6 focus:outline-none dark:text-gray-50"
            disabled={slippageMode === 'Auto'}
          />
          <span className="ml-1 font-normal font-sans text-gray-400 text-sm leading-6 dark:bg-gray-950 dark:text-gray-50 ">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
