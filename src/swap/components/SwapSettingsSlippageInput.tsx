import { type ChangeEvent, useState } from 'react';
import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageInputReact } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapSettingsSlippageInput({
  className,
  defaultSlippage = 3,
}: SwapSettingsSlippageInputReact) {
  const { setLifeCycleStatus } = useSwapContext();
  const [slippage, setSlippage] = useState(defaultSlippage);
  const [isAutoMode, setIsAutoMode] = useState(true);

  const updateSlippage = (newSlippage: number) => {
    setSlippage(newSlippage);
    setLifeCycleStatus({
      statusName: 'slippageChange',
      statusData: { maxSlippage: newSlippage },
    });
  };

  const handleSlippageChange = (newSlippage: string) => {
    const newSlippageNumber = Number.parseFloat(newSlippage);
    if (!Number.isNaN(newSlippageNumber)) {
      updateSlippage(newSlippageNumber);
    }
  };

  const handleModeChange = (auto: boolean) => {
    setIsAutoMode(auto);
    if (auto) {
      updateSlippage(defaultSlippage);
    }
  };

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
            'flex h-9 flex-1 rounded-xl border border-gray-300 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-950',
          )}
        >
          {['Auto', 'Custom'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={cn(
                'flex-1 rounded-lg px-3 py-1 font-medium text-sm transition-colors',
                'dark:bg-gray-950 dark:text-gray-50',
                isAutoMode === (mode === 'Auto')
                  ? 'bg-white text-blue-600 shadow-sm dark:bg-indigo-900'
                  : 'text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700',
              )}
              onClick={() => handleModeChange(mode === 'Auto')}
            >
              {mode}
            </button>
          ))}
        </div>
        <div
          className={cn(
            'flex h-9 items-center justify-between rounded-lg border border-gray-300',
            'w-24 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-950',
            isAutoMode && 'opacity-50',
          )}
        >
          <input
            type="text"
            value={slippage}
            onChange={(e) => handleSlippageChange(e.target.value)}
            disabled={isAutoMode}
            className={cn(
              'flex-grow bg-transparent pl-1 font-normal font-sans text-gray-900',
              'w-full text-sm leading-6 focus:outline-none dark:text-gray-50',
              isAutoMode && 'cursor-not-allowed',
            )}
          />
          <span className="ml-1 flex-shrink-0 font-normal font-sans text-gray-400 text-sm leading-6 dark:bg-gray-950 dark:text-gray-50">
            %
          </span>
        </div>
      </div>
    </div>
  );
}
