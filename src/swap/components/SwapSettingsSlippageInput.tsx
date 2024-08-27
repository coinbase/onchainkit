import { type ChangeEvent, useCallback, useState } from 'react';
import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageInputReact } from '../types';

export function SwapSettingsSlippageInput({
  className,
  defaultSlippage = 0.5,
  customSlippageEnabled,
}: SwapSettingsSlippageInputReact) {
  const [slippageValue, setSlippageValue] = useState(
    defaultSlippage.toString(),
  );

  const handleSlippageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (customSlippageEnabled) {
        const newValue = e.target.value;
        if (newValue === '' || !Number.isNaN(Number.parseFloat(newValue))) {
          setSlippageValue(newValue);
        }
      }
    },
    [customSlippageEnabled],
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border border-gray-300',
        'w-full bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-950',
        className,
      )}
    >
      <input
        type="text"
        value={slippageValue}
        onChange={handleSlippageChange}
        className={cn(
          'flex-grow bg-transparent pl-1 font-normal font-sans text-gray-900',
          'text-sm leading-6 focus:outline-none dark:text-gray-50',
          'w-full',
          !customSlippageEnabled && 'cursor-not-allowed opacity-50',
        )}
        disabled={!customSlippageEnabled}
      />
      <span
        className={cn(
          'ml-1 font-normal font-sans text-gray-400 text-sm',
          'flex-shrink-0 leading-6 dark:bg-gray-950 dark:text-gray-50',
        )}
      >
        %
      </span>
    </div>
  );
}
