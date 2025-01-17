import { MobileTray } from '@/internal/components/MobileTray';
import { background, border, cn, text } from '@/styles/theme';
import { useBreakpoints } from '@/ui-react/internal/hooks/useBreakpoints';
import { useCallback } from 'react';
import { WALLET_ADVANCED_DEFAULT_SWAPPABLE_TOKENS } from '../constants';
import type { WalletAdvancedReact } from '../types';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { WalletAdvancedQrReceive } from './WalletAdvancedQrReceive';
import { WalletAdvancedSwap } from './WalletAdvancedSwap';
import { useWalletContext } from './WalletProvider';

export function WalletAdvancedContent({
  children,
  swappableTokens,
}: WalletAdvancedReact) {
  const breakpoint = useBreakpoints();

  const {
    isSubComponentOpen,
    setIsSubComponentOpen,
    isSubComponentClosing,
    setIsSubComponentClosing,
    handleClose,
  } = useWalletContext();

  const { showQr, showSwap, tokenBalances, animations } =
    useWalletAdvancedContext();

  const handleAnimationEnd = useCallback(() => {
    if (isSubComponentClosing) {
      setIsSubComponentOpen(false);
      setIsSubComponentClosing(false);
    }
  }, [isSubComponentClosing, setIsSubComponentOpen, setIsSubComponentClosing]);

  const content = (
    <>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'h-120 w-full',
          showQr ? '' : 'hidden',
        )}
      >
        <WalletAdvancedQrReceive />
      </div>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'h-120 w-full',
          showSwap ? '' : 'hidden',
        )}
      >
        <WalletAdvancedSwap
          title={
            <div className={cn(text.headline, 'w-full text-center text-base')}>
              Swap
            </div>
          }
          to={swappableTokens ?? WALLET_ADVANCED_DEFAULT_SWAPPABLE_TOKENS}
          from={
            tokenBalances?.map((token) => ({
              address: token.address,
              chainId: token.chainId,
              symbol: token.symbol,
              decimals: token.decimals,
              image: token.image,
              name: token.name,
            })) ?? []
          }
          className="w-full px-4 pt-3 pb-4"
        />
      </div>
      <div
        className={cn(
          'flex flex-col items-center justify-between',
          'h-120 w-full',
          'px-4 py-3',
          showQr || showSwap ? 'hidden' : '',
        )}
      >
        {children}
      </div>
    </>
  );

  if (breakpoint === 'sm') {
    return (
      <MobileTray
        isOpen={isSubComponentOpen}
        onOverlayClick={handleClose}
        onEscKeyPress={handleClose}
        onAnimationEnd={handleAnimationEnd}
        animation={{
          tray: animations.mobileContainer,
          overlay: animations.mobileContainerOverlay,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          {content}
        </div>
      </MobileTray>
    );
  }

  return (
    <div
      data-testid="ockWalletAdvancedContent"
      className={cn(
        background.default,
        border.radius,
        border.lineDefault,
        'my-1.5 h-auto w-88',
        'flex items-center justify-center',
        animations.container,
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      {content}
    </div>
  );
}
