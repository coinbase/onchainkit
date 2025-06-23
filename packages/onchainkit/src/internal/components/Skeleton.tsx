import { cn } from '@/styles/theme';

type SkeletonProps = {
  className?: string;
};

/**
 * A skeleton component is a visual placeholder that mimics the content of an element while it's loading
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-opacity-50',
        'bg-background-alternate',
        'rounded-default',
        className,
      )}
      data-testid="ockSkeleton"
    />
  );
}
