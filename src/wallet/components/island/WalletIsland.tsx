import Draggable from '../../../internal/components/Draggable';
import { background, border, cn } from '../../../styles/theme';
import { SwapDefault } from '../../../swap';
import { useTheme } from '../../../useTheme';
import type { WalletIslandProps } from '../../types';
import { useWalletContext } from '../WalletProvider';
import {
  WalletIslandProvider,
  useWalletIslandContext,
} from './WalletIslandProvider';
import { WalletIslandQrReceive } from './WalletIslandQrReceive';

function WalletIslandContent({ children }: WalletIslandProps) {
  const { showQr, showSwap } = useWalletIslandContext();
  const componentTheme = useTheme();

  return (
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
          showQr ? '' : 'hidden',
        )}
      >
        <WalletIslandQrReceive />
      </div>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'h-auto w-96',
          'p-4',
          showSwap ? '' : 'hidden',
        )}
      >
        <SwapDefault to={[]} from={[]} />
      </div>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'h-auto w-96',
          'p-4',
          showQr || showSwap ? 'hidden' : '',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function WalletIsland({ children }: WalletIslandProps) {
  const { isOpen } = useWalletContext();

  if (!isOpen) {
    return null;
  }

  return (
    <WalletIslandProvider>
      <Draggable gridSize={25}>
        <WalletIslandContent>{children}</WalletIslandContent>
      </Draggable>
    </WalletIslandProvider>
  );
}
