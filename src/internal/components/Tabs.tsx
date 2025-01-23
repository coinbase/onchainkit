import { useValue } from '@/core-react/internal/hooks/useValue';
import { createContext, useCallback, useContext, useState } from 'react';

export function Tabs({ children }: { children: React.ReactNode }) {
  return <TabsProvider>{children}</TabsProvider>;
}

type TabsContextType = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function TabsProvider({ children }: { children: React.ReactNode }) {
  const [selectedTab, setSelectedTab] = useState<string>('');
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

type TabReact = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

export function Tab({ value, children, className }: TabReact) {
  const { setSelectedTab } = useTabsContext();

  const handleClick = useCallback(() => {
    setSelectedTab(value);
  }, [value, setSelectedTab]);

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
}

type TabsListReact = {
  className?: string;
  children: React.ReactNode;
};

export function TabsList({ className, children }: TabsListReact) {
  return <div className={className}>{children}</div>;
}

type TabContentReact = {
  children: React.ReactNode;
  value: string;
  className?: string;
};

export function TabContent({ children, value, className }: TabContentReact) {
  const { selectedTab } = useTabsContext();

  if (selectedTab !== value) return null;

  return <div className={className}>{children}</div>;
}
