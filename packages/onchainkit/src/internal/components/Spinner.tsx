import { cn } from '@/styles/theme';

type SpinnerProps = {
  className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className="flex h-full items-center justify-center"
      data-testid="ockSpinner"
    >
      <div
        className={cn(
          'animate-spin border-2 border-gray-200 border-t-3',
          'rounded-full border-t-gray-400 px-2.5 py-2.5',
          className,
        )}
      />
    </div>
  );
}
