import { useCallback, useState } from 'react';
import { background, border, cn, color, pressable } from '../../styles/theme';
import type { SwapSettingsSlippageInputReact } from '../types';
import { useSwapContext } from './SwapProvider';

const SLIPPAGE_SETTINGS = {
  AUTO: 'Auto',
  CUSTOM: 'Custom',
};

export function SwapSettingsSlippageInput({
  className,
  defaultSlippage = 3,
}: SwapSettingsSlippageInputReact) {
  const { setLifeCycleStatus, lifeCycleStatus } = useSwapContext();
  // Set initial slippage values to match previous selection or default,
  // ensuring consistency when dropdown is reopened
  const [slippage, setSlippage] = useState(
    lifeCycleStatus.statusData.maxSlippage,
  );
  const [slippageSetting, setSlippageSetting] = useState(
    lifeCycleStatus.statusData.maxSlippage === defaultSlippage
      ? SLIPPAGE_SETTINGS.AUTO
      : SLIPPAGE_SETTINGS.CUSTOM,
  );

  const updateSlippage = useCallback(
    (newSlippage: number) => {
      setSlippage(newSlippage);
      setLifeCycleStatus({
        statusName: 'slippageChange',
        statusData: {
          isMissingRequiredField: false,
          maxSlippage: newSlippage,
        },
      });
    },
    [setLifeCycleStatus],
  );

  // Handles user input for custom slippage
  // Parses the input and updates slippage if valid
  const handleSlippageChange = useCallback(
    (newSlippage: string) => {
      // Empty '' when the input field is cleared.
      if (newSlippage === '') {
        setSlippage(0);
        return;
      }

      const newSlippageNumber = Number.parseFloat(newSlippage);
      if (!Number.isNaN(newSlippageNumber)) {
        updateSlippage(newSlippageNumber);
      }
    },
    [updateSlippage],
  );

  // Toggles between auto and custom slippage settings
  // Resets to default slippage when auto is selected
  const handleSlippageSettingChange = useCallback(
    (setting: string) => {
      setSlippageSetting(setting);
      if (setting === SLIPPAGE_SETTINGS.AUTO) {
        updateSlippage(defaultSlippage);
      }
    },
    [updateSlippage, defaultSlippage],
  );

  return (
    <section
      className={cn(
        background.default,
        border.defaultActive,
        'flex items-center gap-2',
        className,
      )}
    >
      <fieldset
        className={cn(
          background.default,
          border.defaultActive,
          'flex h-9 flex-1 rounded-xl border p-1',
        )}
      >
        <legend className="sr-only">Slippage Setting</legend>
        {Object.values(SLIPPAGE_SETTINGS).map((setting) => (
          <button
            key={setting}
            type="button"
            className={cn(
              pressable.default,
              color.foreground,
              'flex-1 rounded-lg px-3 py-1 font-medium text-sm transition-colors',
              // Highlight the button if it is selected
              slippageSetting === setting
                ? cn(background.inverse, color.primary, pressable.shadow)
                : color.foregroundMuted,
            )}
            onClick={() => handleSlippageSettingChange(setting)}
          >
            {setting}
          </button>
        ))}
      </fieldset>
      <div
        className={cn(
          background.default,
          border.defaultActive,
          'flex h-9 w-24 items-center justify-between rounded-lg border px-2 py-1',
          slippageSetting === SLIPPAGE_SETTINGS.AUTO && 'opacity-50',
        )}
      >
        <label htmlFor="slippage-input" className="sr-only">
          Slippage Percentage
        </label>
        <input
          id="slippage-input"
          type="text"
          value={slippage}
          onChange={(e) => handleSlippageChange(e.target.value)}
          disabled={slippageSetting === SLIPPAGE_SETTINGS.AUTO}
          className={cn(
            color.foreground,
            'w-full flex-grow bg-transparent pl-1 font-normal text-sm leading-6 focus:outline-none',
            slippageSetting === SLIPPAGE_SETTINGS.AUTO && 'cursor-not-allowed',
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
    </section>
  );
}
