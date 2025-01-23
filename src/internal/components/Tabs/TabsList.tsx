import { border, cn } from '@/styles/theme';

type TabsListReact = {
  className?: string;
  children: React.ReactNode;
};

export function TabsList({ className, children }: TabsListReact) {
  return (
    <div
      className={cn(
        border.lineDefault,
        'flex overflow-hidden !border-r-0 !border-l-0 !border-t-0',
        className,
      )}
    >
      {children}
    </div>
  );
}
