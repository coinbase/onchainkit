import { Children, useMemo } from 'react';
import type { ReactNode } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import { background, cn, pressable } from '../../styles/theme';
import { SlippageLabel } from './SlippageLabel';
import { SlippageDescription } from './SlippageDescription';
import { SlippageToggle } from './SlippageToggle';
import { SlippageInput } from './SlippageInput';

type SwapSettingsLayoutReact = {
  children: ReactNode;
  className?: string;
};

export function SlippageLayout({
  children,
  className,
}: SwapSettingsLayoutReact) {
  const { label, description, toggle, input } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      label: childrenArray.find(findComponent(SlippageLabel)),
      description: childrenArray.find(findComponent(SlippageDescription)),
      toggle: childrenArray.find(findComponent(SlippageToggle)),
      input: childrenArray.find(findComponent(SlippageInput)),
    };
  }, [children]);

  return (
    <div
      className={cn(
        background.default,
        'flex flex-col space-y-2 p-4',
        className,
      )}
      data-testid="ockSwapSettingsLayout_container"
    >
      {label}
      {description}
      <div className="flex items-center gap-2">
        {toggle}
        {input}
      </div>
    </div>
  );
}
