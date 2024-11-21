import Draggable from '../../internal/components/Draggable';
import { background, border, cn } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import type { WalletIslandProps } from '../types';

export function WalletIsland({ children }: WalletIslandProps) {
  const componentTheme = useTheme();

  return (
    <Draggable gridSize={25}>
      <div
        className={cn(
          componentTheme,
          background.default,
          // border.default,
          border.radius,
          'border-[1px] border-gray-300 dark:border-gray-700', // TODO [BOE-884]: move this to the theme definitions
          'w-[360px] h-auto',
          'flex items-center justify-center',
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'w-80 h-auto',
            'm-4',
          )}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
}
