import { background, cn } from '../../styles/theme';

type SkeletonReact = {
  className?: string;
};

export function Skeleton({ className }: SkeletonReact) {
  return (
    <div
      className={cn(
        'animate-pulse bg-opacity-50',
        background.alternate,
        'rounded',
        className,
      )}
      data-testid="ockSkeleton"
    />
  );
}
