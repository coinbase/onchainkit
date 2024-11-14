import { cn } from '../../utils/index.ts';

interface CodeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'blue' | 'gray';
}

export function Code({ children, variant = 'gray', className }: CodeProps) {
  return (
    <code
      className={cn(
        'box-border h-fit rounded-[calc(.5px+.2em)] px-1 py-0.5 font-mono text-[0.8rem] leading-tight',
        variant === 'blue' &&
          'bg-blue-100/60 text-blue-500 dark:bg-blue-900/60 dark:text-blue-400',
        variant === 'gray' &&
          'bg-gray-200/60 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300',
        className,
      )}
    >
      {children}
    </code>
  );
}
