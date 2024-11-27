import Draggable from '../../../internal/components/Draggable';
import { background, border, cn } from '../../../styles/theme';
import { useTheme } from '../../../useTheme';
import type { WalletIslandProps } from '../../types';
import { useWalletContext } from '../WalletProvider';

export function WalletIsland({ children }: WalletIslandProps) {
  const componentTheme = useTheme();
  const { isOpen } = useWalletContext();

  if (!isOpen) {
    return null;
  }

  return (
    <Draggable gridSize={25}>
      <div
        className={cn(
          componentTheme,
          background.default,
          border.radius,
          border.lineDefault,
          'h-auto w-96',
          'flex items-center justify-center',
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'h-auto w-96',
            'p-4',
          )}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
}
