import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { background, border, cn, color, pressable } from '../../styles/theme';
import type { SwapSettingsSlippageInputReact } from '../types';
import { hasMaxSlippage } from '../utils/hasMaxSlippage';
import { updateMaxSlippage } from '../utils/updateMaxSlippage';
import { useSwapContext } from './SwapProvider';

export function SwapSettingsSlippageInput({
  className,
  defaultSlippage = 3,
}: SwapSettingsSlippageInputReact) {
  const { lifeCycleStatus, setLifeCycleStatus } = useSwapContext();

  const initialSlippage = hasMaxSlippage(lifeCycleStatus.statusData)
    ? lifeCycleStatus.statusData.maxSlippage
    : defaultSlippage;

  const [currentMode, setCurrentMode] = useState<'Auto' | 'Custom'>(
    initialSlippage !== defaultSlippage ? 'Custom' : 'Auto',
  );
  const [slippageValue, setSlippageValue] = useState(
    initialSlippage.toString(),
  );

  // Update lifecycle status when slippage value changes
  useEffect(() => {
    const newSlippage = Number(slippageValue);
    if (
      hasMaxSlippage(lifeCycleStatus.statusData) &&
      newSlippage !== lifeCycleStatus.statusData.maxSlippage
    ) {
      setLifeCycleStatus(updateMaxSlippage(lifeCycleStatus, newSlippage));
    }
  }, [slippageValue, lifeCycleStatus, setLifeCycleStatus]);

  // Handle changes to the slippage input field
  const handleSlippageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSlippageValue(e.target.value);
      setCurrentMode('Custom');
    },
    [],
  );

  // Handle changes between Auto and Custom modes
  const handleModeChange = useCallback(
    (mode: 'Auto' | 'Custom') => {
      setCurrentMode(mode);
      if (mode === 'Auto') {
        setSlippageValue(defaultSlippage.toString());
        setLifeCycleStatus(updateMaxSlippage(lifeCycleStatus, defaultSlippage));
      }
    },
    [defaultSlippage, setLifeCycleStatus, lifeCycleStatus],
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
            'flex h-9 flex-1 rounded-xl border p-1',
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
              'w-full flex-grow bg-transparent pl-1 font-normal text-sm leading-6 focus:outline-none',
              currentMode === 'Auto' && 'cursor-not-allowed',
            )}
          />
          <span
            className={cn(
              background.default,
              color.foreground,
              'ml-1 flex-shrink-0 font-normal text-sm leading-6',
            )}
          >
            %
          </span>
        </div>
      </div>
    </div>
  );
}
