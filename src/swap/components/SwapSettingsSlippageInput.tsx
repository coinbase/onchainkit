import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { background, border, cn, color, pressable } from '../../styles/theme';
import type { LifeCycleStatus, SwapSettingsSlippageInputReact } from '../types';
import { useSwapContext } from './SwapProvider';

function hasMaxSlippage(
  statusData: any,
): statusData is { maxSlippage: number } {
  return statusData?.maxSlippage !== undefined;
}

function updateMaxSlippage(
  status: LifeCycleStatus,
  newMaxSlippage: number,
): LifeCycleStatus {
  if (['init', 'amountChange'].includes(status.statusName)) {
    return {
      statusName: 'amountChange',
      statusData: {
        ...status.statusData,
        amountFrom: '',
        amountTo: '',
        isMissingRequiredField: true,
        maxSlippage: newMaxSlippage,
      },
    };
  }
  return status;
}

export function SwapSettingsSlippageInput({
  className,
  defaultSlippage = 3,
}: SwapSettingsSlippageInputReact) {
  const { lifeCycleStatus, setLifeCycleStatus } = useSwapContext();
  const [currentMode, setCurrentMode] = useState<'Auto' | 'Custom'>(() =>
    ['init', 'amountChange'].includes(lifeCycleStatus.statusName) &&
    hasMaxSlippage(lifeCycleStatus.statusData) &&
    lifeCycleStatus.statusData.maxSlippage !== defaultSlippage
      ? 'Custom'
      : 'Auto',
  );
  const [slippageValue, setSlippageValue] = useState(() =>
    ['init', 'amountChange'].includes(lifeCycleStatus.statusName) &&
    hasMaxSlippage(lifeCycleStatus.statusData)
      ? lifeCycleStatus.statusData.maxSlippage.toString()
      : defaultSlippage.toString(),
  );

  useEffect(() => {
    const newSlippage = Number(slippageValue);
    if (
      !Number.isNaN(newSlippage) &&
      ['init', 'amountChange'].includes(lifeCycleStatus.statusName) &&
      hasMaxSlippage(lifeCycleStatus.statusData) &&
      newSlippage !== lifeCycleStatus.statusData.maxSlippage
    ) {
      setLifeCycleStatus(updateMaxSlippage(lifeCycleStatus, newSlippage));
    }
  }, [slippageValue, lifeCycleStatus, setLifeCycleStatus]);

  const handleSlippageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSlippageValue(e.target.value);
      setCurrentMode('Custom');
    },
    [],
  );

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
