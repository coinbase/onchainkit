import { useTabsContext } from './Tabs';

type TabContentReact = {
  children: React.ReactNode;
  value: string;
  className?: string;
};

export function TabContent({ children, value, className }: TabContentReact) {
  const { selectedTab } = useTabsContext();

  if (selectedTab !== value) {
    return null;
  }

  return (
    <div
      className={className}
      role="tabpanel"
      aria-labelledby={`${value}-panel`}
    >
      {children}
    </div>
  );
}
