import { useCallback, useMemo } from 'react';
import Draggable from '../../../internal/components/Draggable';
import { backArrowSvg } from '../../../internal/svg/backArrowSvg';
import { background, border, cn, pressable } from '../../../styles/theme';
import { useTheme } from '../../../useTheme';
import type { WalletIslandProps } from '../../types';
import { useWalletContext } from '../WalletProvider';
import {
  WalletIslandProvider,
  useWalletIslandContext,
} from './WalletIslandProvider';
import { WalletIslandQrReceive } from './WalletIslandQrReceive';
import WalletIslandSwap from './WalletIslandSwap';

function WalletIslandContent({ children }: WalletIslandProps) {
  const { containerRef } = useWalletContext();
  const { showQr, showSwap, setShowSwap, tokenHoldings } =
    useWalletIslandContext();
  const componentTheme = useTheme();

  const position = useMemo(() => {
    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.bottom + 10,
      };
    }
  }, [containerRef]);

  const handleCloseSwap = useCallback(() => {
    setShowSwap(false);
  }, [setShowSwap]);

  const backButton = (
    <button
      type="button"
      onClick={handleCloseSwap}
      className={cn(
        pressable.default,
        border.radius,
        border.default,
        'flex items-center justify-center p-3',
      )}
    >
      {backArrowSvg}
    </button>
  );

  return (
    <Draggable startingPosition={position}>
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
            backButton={backButton}
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
