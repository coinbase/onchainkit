import { Children, useMemo } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import { cn } from '../../styles/theme';
import type { SwapSettingsSlippageLayoutReact } from '../types';
import { SwapSettingsSlippageDescription } from './SwapSettingsSlippageDescription';
import { SwapSettingsSlippageInput } from './SwapSettingsSlippageInput';
import { SwapSettingsSlippageTitle } from './SwapSettingsSlippageTitle';

export function SwapSettingsSlippageLayoutBottomSheet({
  children,
  className,
}: SwapSettingsSlippageLayoutReact) {
  const { title, description, input } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      title: childrenArray.find(findComponent(SwapSettingsSlippageTitle)),
      description: childrenArray.find(
        findComponent(SwapSettingsSlippageDescription),
      ),
      input: childrenArray.find(findComponent(SwapSettingsSlippageInput)),
    };
  }, [children]);

  return (
    <div
      className={cn(
        'right-0 z-10 h-full w-full rounded-t-lg border border-gray-300 bg-gray-50',
        'px-3 pt-2 pb-3 shadow-lg dark:border-gray-700 dark:bg-gray-950',
        className,
      )}
      data-testid="ockSwapSettingsLayout_container"
    >
      <div className="mx-auto mb-2 h-1 w-4 rounded-[6.25rem] bg-slate-200 dark:bg-gray-700" />
      <div className="mb-4 flex items-center justify-center">
        <h2 className="font-bold text-sm">Settings</h2>
      </div>

      <div className="flex flex-col">
        {title}
        <div className="pb-4">{description}</div>
        {input && <div className="flex-grow">{input}</div>}
      </div>
      <div className="mt-4 flex justify-center">
        <div className="h-1 w-28 shrink-0 rounded-[0.43931rem] bg-zinc-950 dark:bg-gray-700" />
      </div>
    </div>
  );
}
