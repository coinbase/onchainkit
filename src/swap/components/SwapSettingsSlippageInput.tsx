'use client';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { SwapEvent } from '@/core/analytics/types';
import { useCallback, useState } from 'react';
import {
  background,
  border,
  cn,
  color,
  pressable,
  text,
} from '../../styles/theme';
import type { SwapSettingsSlippageInputReact } from '../types';
import { useSwapContext } from './SwapProvider';

const SLIPPAGE_SETTINGS = {
  AUTO: 'Auto',
  CUSTOM: 'Custom',
};

export function SwapSettingsSlippageInput({
  className,
}: SwapSettingsSlippageInputReact) {
  const { sendAnalytics } = useAnalytics();
  const {
    config: { maxSlippage: defaultMaxSlippage },
    updateLifecycleStatus,
    lifecycleStatus,
  } = useSwapContext();

  // Set initial slippage values to match previous selection or default,
  // ensuring consistency when dropdown is reopened
  const [slippageSetting, setSlippageSetting] = useState(
    lifecycleStatus.statusData.maxSlippage === defaultMaxSlippage
      ? SLIPPAGE_SETTINGS.AUTO
      : SLIPPAGE_SETTINGS.CUSTOM,
  );

  const handleAnalyticsSlippageChange = useCallback(
    (previousSlippage: number, newSlippage: number) => {
      sendAnalytics(SwapEvent.SlippageChanged, {
        previousSlippage,
        slippage: newSlippage,
      });
    },
    [sendAnalytics],
  );

  const updateSlippage = useCallback(
    (newSlippage: number) => {
      const currentSlippage = lifecycleStatus.statusData.maxSlippage;
      if (newSlippage !== currentSlippage) {
        handleAnalyticsSlippageChange(currentSlippage, newSlippage);

        updateLifecycleStatus({
          statusName: 'slippageChange',
          statusData: {
            maxSlippage: newSlippage,
          },
        });
      }
    },
    [
      lifecycleStatus.statusData.maxSlippage,
      updateLifecycleStatus,
      handleAnalyticsSlippageChange,
    ],
  );

  // Handles user input for custom slippage.
  // Parses the input and updates slippage state.
  const handleSlippageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSlippage = e.target.value;
      const parsedSlippage = Number.parseFloat(newSlippage);
      const isValidNumber = !Number.isNaN(parsedSlippage);

      // Update slippage to parsed value if valid, otherwise set to 0	
      updateSlippage(isValidNumber ? parsedSlippage : 0);
    },
    [updateSlippage],
  );

  // Toggles between auto and custom slippage settings
  // Resets to default slippage when auto is selected
  const handleSlippageSettingChange = useCallback(
    (setting: string) => {
      setSlippageSetting(setting);
      if (setting === SLIPPAGE_SETTINGS.AUTO) {
        updateSlippage(defaultMaxSlippage);
      }
    },
    [defaultMaxSlippage, updateSlippage],
  );

  return (
    <section
      className={cn(
        background.default,
        border.defaultActive,
        border.radius,
        'flex items-center gap-2',
        className,
      )}
    >
      <fieldset
        className={cn(
          background.default,
          border.defaultActive,
          border.radius,
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
              text.label1,
              border.radiusInner,
              'flex-1 px-3 py-1 transition-colors',
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
          border.radius,
          'flex h-9 w-24 items-center justify-between border px-2 py-1',
          slippageSetting === SLIPPAGE_SETTINGS.AUTO && 'opacity-50',
        )}
      >
        <label htmlFor="slippage-input" className="sr-only">
          Slippage Percentage
        </label>
        <input
          id="slippage-input"
          type="text"
          value={lifecycleStatus.statusData.maxSlippage}
          onChange={handleSlippageChange}
          disabled={slippageSetting === SLIPPAGE_SETTINGS.AUTO}
          className={cn(
            color.foreground,
            text.label2,
            'w-full flex-grow bg-transparent pl-1 font-normal leading-6 focus:outline-none',
            slippageSetting === SLIPPAGE_SETTINGS.AUTO && 'cursor-not-allowed',
          )}
        />
        <span
          className={cn(
            background.default,
            color.foreground,
            text.label2,
            'ml-1 flex-shrink-0 font-normal leading-6',
          )}
        >
          %
        </span>
      </div>
    </section>
  );
}
