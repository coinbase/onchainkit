import { useCallback, useState } from 'react';
import {
  background,
  cn,
  color,
  pressable,
  text as themeText,
} from '../../styles/theme';
import { useBreakpoints } from '../../useBreakpoints';
import { useIcon } from '../../wallet/hooks/useIcon';
import type { SwapSettingsReact } from '../types';

export function SwapSettings({
  className,
  icon = 'swapSettings',
  text = '',
}: SwapSettingsReact) {
  const [isOpen, setIsOpen] = useState(false);
  const [slippageMode, setSlippageMode] = useState<'Auto' | 'Custom'>('Auto');
  const [customSlippage, setCustomSlippage] = useState('0.5');
  const breakpoint = useBreakpoints();

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const iconSvg = useIcon({ icon });

  if (!breakpoint) {
    return null;
  }

  // Placeholder for SwapSettingsBottomSheet
  // Implement mobile version here, similar to WalletBottomSheet
  if (breakpoint === 'sm') {
    return <div>Mobile version not implemented</div>;
  }

  return (
    <div
      className={cn(
        background.default,
        className,
        'flex w-full items-center justify-end space-x-1',
      )}
      data-testid="ockSwapSettings_Settings"
    >
      <span className={themeText.body}>{text}</span>
      <div className="relative">
        <button
          type="button"
          aria-label="Toggle swap settings"
          className="rounded-full p-2 opacity-50 transition-opacity hover:opacity-100"
          onClick={handleToggle}
        >
          {iconSvg}
        </button>
        {isOpen && (
          <div
            className={cn(
              pressable.default,
              className,
              'absolute right-0 z-10 mt-1 w-[350px] rounded-xl shadow-lg',
            )}
            data-testid="ockSwapSettingsDropdown"
          >
            <div className="p-4">
              <h3 className={cn(themeText.caption, 'mb-2 text-base')}>
                Max. slippage
              </h3>
              <p className={cn(themeText.body, color.foregroundMuted, 'mb-2')}>
                Your swap will revert if the prices change by more than the
                selected percentage.
              </p>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex space-x-2 px-1 py-2">
                  <button
                    className={cn(
                      'items-center gap-1 rounded-xl px-4 py-2 font-sans text-base leading-5',
                      slippageMode === 'Auto'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600',
                    )}
                    onClick={() => setSlippageMode('Auto')}
                  >
                    Auto
                  </button>
                  <button
                    className={cn(
                      themeText.label1,
                      'items-center gap-1 rounded-xl px-4 py-2 text-base',
                      slippageMode === 'Custom'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600',
                    )}
                    onClick={() => setSlippageMode('Custom')}
                  >
                    Custom
                  </button>
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={customSlippage}
                    onChange={(e) => setCustomSlippage(e.target.value)}
                    className={cn(
                      background.default,
                      'w-16 rounded-l-md border-t border-b border-l px-2 py-1 text-left',
                    )}
                    disabled={slippageMode === 'Auto'}
                  />
                  <span
                    className={cn(
                      background.default,
                      'rounded-r-md border border-l-0 px-2 py-1 focus:outline-none',
                    )}
                  >
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
