import { background, border, cn, color } from '../../styles/theme';
import { useIsMounted } from '../../useIsMounted';
import { useTheme } from '../../useTheme';
import type { NFTReact } from '../types';

export function NFT({ children, className }: NFTReact) {
  const componentTheme = useTheme();

  const isMounted = useIsMounted();

  // prevents SSR hydration issue
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        componentTheme,
        color.foreground,
        background.default,
        border.defaultActive,
        border.radius,
        'flex w-full max-w-[500px] flex-col border px-6 py-4',
        className,
      )}
      data-testid="ockNFT_Container"
    >
      {children}
    </div>
  );
}
