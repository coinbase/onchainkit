import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageLayoutReact } from '../types';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';
import { SwapSettingsSlippageToggle } from './SwapSettingsSlippageToggle';

export function SwapSettingsSlippageLayoutBottomSheet({
  children,
  className,
  customSlippageEnabled,
  onToggleCustomSlippage,
}: SwapSettingsSlippageLayoutReact) {
  const { title, description, toggle, input } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      title: childrenArray.find(findComponent(SwapSettingsSlippageTitle)),
      description: childrenArray.find(
        findComponent(SwapSettingsSlippageDescription),
      ),
      toggle: childrenArray.find(findComponent(SwapSettingsSlippageToggle)),
      input: childrenArray.find(findComponent(SwapSettingsSlippageInput)),
    };
  }, [children]);

  const enhancedToggle = useMemo(() => {
    if (isValidElement(toggle)) {
      return cloneElement(toggle, {
        customSlippageEnabled,
        onToggle: onToggleCustomSlippage,
      });
    }
    return toggle;
  }, [toggle, customSlippageEnabled, onToggleCustomSlippage]);

  const enhancedInput = useMemo(() => {
    if (isValidElement(input)) {
      return cloneElement(input, { customSlippageEnabled });
    }
    return input;
  }, [input, customSlippageEnabled]);

  return (
    <div
      className={cn(
        'right-0 z-10 w-full h-full rounded-lg border border-gray-300 bg-gray-50',
        'p-4 shadow-lg dark:border-gray-700 dark:bg-gray-950',
        className,
      )}
      data-testid="ockSwapSettingsLayout_container"
    >
      {title}
      {description}
      <div className="flex items-center justify-between gap-2">
        {enhancedToggle && <div className="flex-grow">{enhancedToggle}</div>}
        {enhancedInput && <div className="flex-grow">{enhancedInput}</div>}
      </div>
    </div>
  );
}
