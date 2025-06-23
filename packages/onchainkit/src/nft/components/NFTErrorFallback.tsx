import { useTheme } from '@/internal/hooks/useTheme';
import { cn } from '../../styles/theme';

export function NFTErrorFallback({ error }: { error: Error }) {
  const componentTheme = useTheme();

  return (
    <div
      className={cn(
        componentTheme,
        'text-foreground',
        'bg-background',
        'border-background-active',
        'rounded-default',
        'flex w-full max-w-[500px] flex-col items-center justify-center border px-6 py-4',
      )}
      data-testid="ockNFTErrorFallback_Container"
    >
      <div>Sorry, please try again later.</div>
      <div>{error.message}</div>
    </div>
  );
}
