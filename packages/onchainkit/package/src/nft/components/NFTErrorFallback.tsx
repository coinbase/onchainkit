import { useTheme } from '@/internal/hooks/useTheme';
import { background, border, cn, color } from '../../styles/theme';

export function NFTErrorFallback({ error }: { error: Error }) {
  const componentTheme = useTheme();

  return (
    <div
      className={cn(
        componentTheme,
        color.foreground,
        background.default,
        border.defaultActive,
        border.radius,
        'flex w-full max-w-[500px] flex-col items-center justify-center border px-6 py-4',
      )}
      data-testid="ockNFTErrorFallback_Container"
    >
      <div>Sorry, please try again later.</div>
      <div>{error.message}</div>
    </div>
  );
}
