import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageInputReact } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapSettingsSlippageInput({
  className,
  defaultSlippage = 3,
}: SwapSettingsSlippageInputReact) {
  const { maxSlippage, setMaxSlippage } = useSwapContext();
  const [slippageValue, setSlippageValue] = useState(maxSlippage.toString());
  const [currentMode, setCurrentMode] = useState<'Auto' | 'Custom'>('Auto');

  useEffect(() => {
    setSlippageValue(maxSlippage.toString());
  }, [maxSlippage]);

  // Handles changes in the slippage input field
  // Updates the slippage value and sets the max slippage if the input is a valid number
  const handleSlippageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSlippageValue(newValue);
      const numericValue = Number.parseFloat(newValue);
      if (!Number.isNaN(numericValue)) {
        setMaxSlippage(numericValue);
      }
    },
    [setMaxSlippage],
  );

  // Handles changes between Auto and Custom modes
  // Resets to default slippage when switching to Auto mode
  const handleModeChange = useCallback(
    (mode: 'Auto' | 'Custom') => {
      setCurrentMode(mode);
      if (mode === 'Auto') {
        setMaxSlippage(defaultSlippage);
        setSlippageValue(defaultSlippage.toString());
      }
    },
    [defaultSlippage, setMaxSlippage],
  );

  return (
    <div className={className}>
      <div
        className={cn(
          'flex items-center gap-2 dark:border-gray-700 dark:bg-gray-950',
          className,
        )}
      >
        <div
          className={cn(
            'flex h-9 flex-1 rounded-xl border border-gray-300',
            'bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-950',
          )}
        >
          {['Auto', 'Custom'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={cn(
                'flex-1 rounded-lg px-3 py-1 font-medium text-sm transition-colors',
                'dark:bg-gray-950 dark:text-gray-50',
                currentMode === mode
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-indigo-900'
                  : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
              onClick={() => handleModeChange(mode as 'Auto' | 'Custom')}
            >
              {mode}
            </button>
          ))}
        </div>
        <div
          className={cn(
            'flex h-9 items-center justify-between rounded-lg border border-gray-300',
            'bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-950',
            'w-24',
            currentMode === 'Auto' && 'opacity-50',
          )}
        >
          <input
            type="text"
            value={slippageValue}
            onChange={handleSlippageChange}
            disabled={currentMode === 'Auto'}
            className={cn(
              'flex-grow bg-transparent pl-1 font-normal font-sans text-gray-900',
              'text-sm leading-6 focus:outline-none dark:text-gray-50',
              'w-full',
              currentMode === 'Auto' && 'cursor-not-allowed',
            )}
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
      </div>
    </div>
  );
}