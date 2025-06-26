'use client';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { SwapEvent } from '@/core/analytics/types';
import { ComponentProps, useCallback, useId, useState } from 'react';
import { cn, pressable, text } from '@/styles/theme';
import type { SwapSettingsSlippageInputProps } from '../types';
import { useSwapContext } from './SwapProvider';
import { TextInput } from '@/internal/components/TextInput';
import { SLIPPAGE_SETTINGS, SlippageSettingsType } from '../constants';

export function SwapSettingsSlippageInput({
  className,
  render,
}: SwapSettingsSlippageInputProps) {
  const { sendAnalytics } = useAnalytics();
  const {
    config: { maxSlippage: defaultMaxSlippage },
    updateLifecycleStatus,
    lifecycleStatus,
  } = useSwapContext();

  // Set initial slippage values to match previous selection or default,
  // ensuring consistency when dropdown is reopened
  const [slippageSetting, setSlippageSetting] = useState<SlippageSettingsType>(
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

        if (slippageSetting === SLIPPAGE_SETTINGS.AUTO) {
          setSlippageSetting(SLIPPAGE_SETTINGS.CUSTOM);
        }

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
      slippageSetting,
    ],
  );

  // Handles user input for custom slippage.
  // Parses the input and updates slippage state.
  const handleSlippageChange: ComponentProps<typeof TextInput>['onChange'] =
    useCallback(
      (newSlippage: string) => {
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
      setSlippageSetting(setting as SlippageSettingsType);
      if (setting === SLIPPAGE_SETTINGS.AUTO) {
        updateSlippage(defaultMaxSlippage);
      }
    },
    [defaultMaxSlippage, updateSlippage],
  );

  const slippageInputId = useId();

  if (render) {
    return render({
      slippageSetting,
      setSlippageSetting: handleSlippageSettingChange,
      setSlippageValue: updateSlippage,
    });
  }

  return (
    <section
      className={cn(
        'bg-ock-background',
        'border-ock-background-active',
        'rounded-ock-default',
        'flex items-center gap-2 flex-grow max-sm:pt-4',
        className,
      )}
    >
      <fieldset
        className={cn(
          'bg-ock-background',
          'border-ock-background-active',
          'rounded-ock-default',
          'flex h-9 flex-1 rounded-xl border p-1',
        )}
      >
        <legend className="sr-only">Slippage Setting</legend>
        {Object.values(SLIPPAGE_SETTINGS).map((setting) => (
          <button
            key={setting}
            type="button"
            aria-current={slippageSetting === setting ? 'true' : undefined}
            className={cn(
              pressable.default,
              'text-ock-foreground',
              text.label1,
              'rounded-ock-inner',
              'flex-1 px-3 py-1 transition-colors',
              // Highlight the button if it is selected
              slippageSetting === setting
                ? cn(
                    'bg-ock-background-inverse',
                    'text-ock-primary',
                    'shadow-ock-default',
                  )
                : 'text-ock-foreground-muted',
            )}
            onClick={() => handleSlippageSettingChange(setting)}
          >
            {setting}
          </button>
        ))}
      </fieldset>
      <div
        className={cn(
          'bg-ock-background',
          'border-ock-background-active',
          'rounded-ock-default',
          'flex h-9 w-24 items-center justify-between border px-2 py-1',
          slippageSetting === SLIPPAGE_SETTINGS.AUTO && 'opacity-50',
        )}
      >
        <label htmlFor={slippageInputId} className="sr-only">
          Slippage Percentage
        </label>
        <TextInput
          id={slippageInputId}
          type="text"
          value={String(lifecycleStatus.statusData.maxSlippage)}
          onChange={handleSlippageChange}
          placeholder="0"
          disabled={slippageSetting === SLIPPAGE_SETTINGS.AUTO}
          className={cn(
            'text-ock-foreground truncate',
            text.label2,
            'w-full flex-grow bg-transparent pl-1 font-normal leading-6 focus:outline-none',
            slippageSetting === SLIPPAGE_SETTINGS.AUTO && 'cursor-not-allowed',
          )}
        />
        <span
          className={cn(
            'bg-ock-background',
            'text-ock-foreground',
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
