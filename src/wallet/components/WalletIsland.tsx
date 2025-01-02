import { useMemo } from 'react';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { Draggable } from '@/internal/components/Draggable';
import { background, border, cn, text } from '../../styles/theme';
import type { WalletIslandProps } from '../types';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandQrReceive } from './WalletIslandQrReceive';
import { WalletIslandSwap } from './WalletIslandSwap';
import { useWalletContext } from './WalletProvider';
import { WalletIslandProvider } from './WalletIslandProvider';

export function WalletIsland({ children }: WalletIslandProps) {
  const { isOpen } = useWalletContext();

  if (!isOpen) {
    return null;
  }

  return (
    <WalletIslandProvider>
      <WalletIslandContent>{children}</WalletIslandContent>
    </WalletIslandProvider>
  );
}



const WALLET_ISLAND_WIDTH = 384;
const WALLET_ISLAND_HEIGHT = 394;

export function WalletIslandContent({ children }: WalletIslandProps) {
  const { containerRef } = useWalletContext();
  const { showQr, showSwap, tokenHoldings, animationClasses } =
    useWalletIslandContext();
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
        yPos = rect.bottom - WALLET_ISLAND_HEIGHT - rect.height - 10;
      } else {
        yPos = rect.bottom + 10;
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
          'h-auto w-88',
          'flex items-center justify-center',
          animationClasses.content,
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'h-auto w-88',
            'p-4',
            showQr ? '' : 'hidden',
          )}
        >
          <WalletIslandQrReceive />
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'h-auto w-88',
            'p-2',
            showSwap ? '' : 'hidden',
          )}
        >
          <WalletIslandSwap
            title={
              <div
                className={cn(text.headline, 'w-full text-center text-base')}
              >
                Swap
              </div>
            }
            to={tokenHoldings.map((token) => token.token)}
            from={tokenHoldings.map((token) => token.token)}
            className="w-full p-2"
          />
        </div>
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'h-auto w-88',
            'px-4 pt-3 pb-2',
            showQr || showSwap ? 'hidden' : '',
          )}
        >
          {children}
        </div>
      </div>
    </Draggable>
  );
}
