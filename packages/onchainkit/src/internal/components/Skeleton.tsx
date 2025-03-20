import { background, border, cn } from '../../styles/theme';

type SkeletonReact = {
  className?: string;
};

/**
 * A skeleton component is a visual placeholder that mimics the content of an element while it's loading
 */
export function Skeleton({ className }: SkeletonReact) {
  return (
    <div
      className={cn(
        'animate-pulse bg-opacity-50',
        background.alternate,
        border.radius,
        className,
      )}
      data-testid="ockSkeleton"
    />
  );
}
