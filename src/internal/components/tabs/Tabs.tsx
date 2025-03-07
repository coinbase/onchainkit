'use client';
import { useValue } from '@/internal/hooks/useValue';
import { cn } from '@/styles/theme';
import { createContext, useContext, useState } from 'react';

type TabsContextType = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

type TabsProviderReact = {
  children: React.ReactNode;
  defaultValue: string;
};

function TabsProvider({ children, defaultValue }: TabsProviderReact) {
  const [selectedTab, setSelectedTab] = useState<string>(defaultValue);
  const value = useValue({ selectedTab, setSelectedTab });

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within an TabsProvider');
  }
  return context;
}

type TabsReact = {
  children: React.ReactNode;
  defaultValue: string;
  className?: string;
};

export function Tabs({ children, defaultValue, className }: TabsReact) {
  return (
    <TabsProvider defaultValue={defaultValue}>
      <div data-testid="ockTabs" className={cn('flex flex-col', className)}>
        {children}
      </div>
    </TabsProvider>
  );
}
