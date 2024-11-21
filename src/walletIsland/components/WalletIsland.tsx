import { cn } from '../../styles/theme';
import type { WalletIslandProps } from '../types';

export function WalletIsland({ children }: WalletIslandProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center border-2 border-red-500 '
      )}
    >
      {children}
    </div>
  );
}
