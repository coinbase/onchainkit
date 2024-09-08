import { cn, color, text as dsText } from '../../styles/theme';
import type { ConnectWalletTextReact } from '../types';

export function ConnectWalletText({
  children,
  className,
}: ConnectWalletTextReact) {
  return (
    <span className={cn(dsText.body, color.inverse, className)}>
      {children}
    </span>
  );
}
