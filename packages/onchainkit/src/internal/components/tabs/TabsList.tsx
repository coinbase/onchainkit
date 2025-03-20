import { cn } from '@/styles/theme';
import { type KeyboardEvent, useCallback } from 'react';
import { useTabsContext } from './Tabs';

type TabsListReact = {
  className?: string;
  children: React.ReactNode;
};

export function TabsList({ className, children }: TabsListReact) {
  const { setSelectedTab } = useTabsContext();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const tabs = Array.from(
        target.parentElement?.querySelectorAll('[role="tab"]') || [],
      );
      const currentIndex = tabs.indexOf(target);

      if (currentIndex === -1) {
        return;
      }

      let nextIndex: number;

      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        default:
          return;
      }

      const nextTab = tabs[nextIndex] as HTMLElement;
      nextTab.focus();

      // Extract the value from the tab's aria-controls attribute
      const tabValue = nextTab
        .getAttribute('aria-controls')
        ?.replace('-panel', '');
      if (tabValue) {
        setSelectedTab(tabValue);
      }

      event.preventDefault();
    },
    [setSelectedTab],
  );

  return (
    <div
      className={cn('flex overflow-hidden', className)}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
