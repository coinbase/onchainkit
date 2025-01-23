import { background, cn, color, text } from '@/styles/theme';
import { useCallback } from 'react';
import { useTabsContext } from './Tabs';

type TabReact = {
  value: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function Tab({ value, children, className, ariaLabel }: TabReact) {
  const { selectedTab, setSelectedTab } = useTabsContext();

  const isSelected = selectedTab === value;

  const handleClick = useCallback(() => {
    setSelectedTab(value);
  }, [value, setSelectedTab]);

  return (
    <button
      className={cn(
        text.label1,
        isSelected ? color.primary : color.foreground,
        isSelected ? background.washed : background.default,
        'w-1/2 text-center',
        'cursor-pointer px-3 py-4',
        className,
      )}
      onClick={handleClick}
      aria-label={ariaLabel}
      role="tab"
    >
      {children}
    </button>
  );
}
