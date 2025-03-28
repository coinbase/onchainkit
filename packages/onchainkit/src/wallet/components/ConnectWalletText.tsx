import { cn, color, text as dsText } from '../../styles/theme';
import type { ConnectWalletTextReact } from '../types';

/**
 * @deprecated Use the `disconnectedLabel` prop on `ConnectWallet` instead.
 */
export function ConnectWalletText({
  children,
  className,
}: ConnectWalletTextReact) {
  return (
    <span className={cn(dsText.headline, color.inverse, className)}>
      {children}
    </span>
  );
}
