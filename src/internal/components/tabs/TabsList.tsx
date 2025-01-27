import { cn } from '@/styles/theme';

type TabsListReact = {
  className?: string;
  children: React.ReactNode;
};

export function TabsList({ className, children }: TabsListReact) {
  return (
    <div
      className={cn('flex overflow-hidden', className)}
      role="tablist"
      aria-orientation="horizontal"
    >
      {children}
    </div>
  );
}
