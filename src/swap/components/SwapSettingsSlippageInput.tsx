import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { background, border, cn, color, pressable } from '../../styles/theme';
import type { SwapSettingsSlippageInputReact, LifeCycleStatus } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapSettingsSlippageInput({
  className,
  defaultSlippage = 3,
}: SwapSettingsSlippageInputReact) {
  const { lifeCycleStatus, setLifeCycleStatus } = useSwapContext();

  const [currentMode, setCurrentMode] = useState<'Auto' | 'Custom'>('Auto');
  const [slippageValue, setSlippageValue] = useState(
    defaultSlippage.toString(),
  );

  useEffect(() => {
    if (lifeCycleStatus.statusName === 'init') {
      setLifeCycleStatus({
        statusName: 'init',
        statusData: {
          ...lifeCycleStatus.statusData,
          maxSlippage: Number(slippageValue),
        },
      });
    } else if (lifeCycleStatus.statusName === 'amountChange') {
      setLifeCycleStatus({
        statusName: 'amountChange',
        statusData: {
          ...lifeCycleStatus.statusData,
          maxSlippage: Number(slippageValue),
        },
      });
    }
  }, [slippageValue, setLifeCycleStatus, lifeCycleStatus]);

  // Handles changes in the slippage input field
  // Updates the slippage value and sets the max slippage if the input is a valid number
  const handleSlippageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSlippageValue(newValue);
    },
    [],
  );

  // Handles changes between Auto and Custom modes
  // Resets to default slippage when switching to Auto mode
  const handleModeChange = useCallback(
    (mode: 'Auto' | 'Custom') => {
      setCurrentMode(mode);
      if (mode === 'Auto') {
        setSlippageValue(defaultSlippage.toString());
      }
    },
    [defaultSlippage],
  );

  return (
    <div className={className}>
      <div
        className={cn(
          background.default,
          border.defaultActive,
          'flex items-center gap-2',
          className,
        )}
      >
        <div
          className={cn(
            background.default,
            border.defaultActive,
            'flex h-9 flex-1 rounded-xl border p-1 ',
          )}
        >
          {['Auto', 'Custom'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={cn(
                pressable.default,
                color.foreground,
                'flex-1 rounded-lg px-3 py-1 font-medium text-sm transition-colors',
                currentMode === mode
                  ? cn(background.inverse, color.primary, pressable.shadow)
                  : color.foregroundMuted,
              )}
              onClick={() => handleModeChange(mode as 'Auto' | 'Custom')}
            >
              {mode}
            </button>
          ))}
        </div>
        <div
          className={cn(
            background.default,
            border.defaultActive,
            'flex h-9 w-24 items-center justify-between rounded-lg border px-2 py-1',
            currentMode === 'Auto' && 'opacity-50',
          )}
        >
          <input
            type="text"
            value={slippageValue}
            onChange={handleSlippageChange}
            disabled={currentMode === 'Auto'}
            className={cn(
              color.foreground,
              'flex-grow bg-transparent pl-1 font-normal font-sans',
              'text-sm leading-6 focus:outline-none',
              'w-full',
              currentMode === 'Auto' && 'cursor-not-allowed',
            )}
          />
          <span
            className={cn(
              background.default,
              color.foreground,
              'ml-1 flex-shrink-0 font-normal font-sanstext-sm leading-6',
            )}
          >
            %
          </span>
        </div>
      </div>
    </div>
  );
}
