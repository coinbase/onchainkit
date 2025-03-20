import { background, cn, color, text } from '@/styles/theme';
import { useCallback } from 'react';
import { useTabsContext } from './Tabs';

type TabReact = {
  value: string;
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  onClick?: () => void;
};

export function Tab({
  value,
  children,
  className,
  'aria-label': ariaLabel,
  onClick,
}: TabReact) {
  const { selectedTab, setSelectedTab } = useTabsContext();

  const isSelected = selectedTab === value;

  const handleClick = useCallback(() => {
    setSelectedTab(value);
    onClick?.();
  }, [value, setSelectedTab, onClick]);

  return (
    <button
      className={cn(
        text.headline,
        isSelected ? color.inverse : color.foreground,
        isSelected ? background.primary : background.default,
        'w-1/2 text-center',
        'cursor-pointer px-3 py-2',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ock-text-foreground)] focus-visible:ring-inset',
        className,
      )}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-selected={isSelected}
      aria-controls={`${value}-panel`}
      role="tab"
      type="button"
      tabIndex={isSelected ? 0 : -1}
    >
      {children}
    </button>
  );
}
