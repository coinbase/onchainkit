import { useState } from 'react';
import { background, border, cn, color, pressable } from '../../styles/theme';
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
                isAutoMode === (mode === 'Auto')
                  ? cn(background.inverse, color.primary, pressable.shadow)
                  : color.foregroundMuted,
              )}
              onClick={() => handleModeChange(mode === 'Auto')}
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
            isAutoMode && 'opacity-50',
          )}
        >
          <input
            type="text"
            value={slippage}
            onChange={(e) => handleSlippageChange(e.target.value)}
            disabled={isAutoMode}
            className={cn(
              color.foreground,
              'w-full flex-grow bg-transparent pl-1 font-normal text-sm leading-6 focus:outline-none',
              isAutoMode && 'cursor-not-allowed',
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
