import { useMemo } from 'react';
import Draggable from '../../../internal/components/Draggable';
import { background, border, cn } from '../../../styles/theme';
import { useTheme } from '../../../useTheme';
import type { WalletIslandProps } from '../../types';
import { useWalletContext } from '../WalletProvider';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandQrReceive } from './WalletIslandQrReceive';
import { WalletIslandSwap } from './WalletIslandSwap';

const WALLET_ISLAND_WIDTH = 384;
const WALLET_ISLAND_HEIGHT = 394;

export function WalletIslandContent({ children }: WalletIslandProps) {
  const { containerRef, isClosing } = useWalletContext();
  const { showQr, showSwap, tokenHoldings } = useWalletIslandContext();
  const componentTheme = useTheme();

  const position = useMemo(() => {
    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let xPos: number;
      let yPos: number;

      if (windowWidth - rect.right < WALLET_ISLAND_WIDTH) {
        xPos = rect.right - WALLET_ISLAND_WIDTH;
      } else {
        xPos = rect.left;
      }

      if (windowHeight - rect.bottom < WALLET_ISLAND_HEIGHT) {
        yPos = rect.bottom - WALLET_ISLAND_HEIGHT - rect.height - 5;
      } else {
        yPos = rect.bottom + 5;
      }

      return {
        x: xPos,
        y: yPos,
      };
    }

    return {
      x: 20,
      y: 20,
    };
  }, [containerRef]);

  return (
    <Draggable startingPosition={position}>
      <div
        data-testid="ockWalletIslandContent"
        className={cn(
          componentTheme,
          background.default,
          border.radius,
          border.lineDefault,
          'h-auto w-96',
          'flex items-center justify-center',
          isClosing
            ? 'animate-walletIslandOut'
            : 'animate-walletIslandContainerIn',
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'h-auto w-96',
            'p-2',
            showQr ? '' : 'hidden',
          )}
        >
          <WalletIslandQrReceive />
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'h-auto w-96',
            'p-2',
            showSwap ? '' : 'hidden',
          )}
        >
          <WalletIslandSwap
            to={tokenHoldings.map((token) => token.token)}
            from={tokenHoldings.map((token) => token.token)}
            className="w-full p-2"
          />
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'h-auto w-96',
            'p-2',
            showQr || showSwap ? 'hidden' : '',
          )}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
}
