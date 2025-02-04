import { BottomSheet } from '@/internal/components/BottomSheet';
import { zIndex } from '@/styles/constants';
import { background, border, cn, text } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import { WALLET_ADVANCED_DEFAULT_SWAPPABLE_TOKENS } from '../constants';
import type { WalletAdvancedReact } from '../types';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { WalletAdvancedQrReceive } from './WalletAdvancedQrReceive';
import { WalletAdvancedSwap } from './WalletAdvancedSwap';
import { useWalletContext } from './WalletProvider';

export function WalletAdvancedContent({
  children,
  swappableTokens,
  classNames,
}: WalletAdvancedReact) {
  const {
    isSubComponentOpen,
    setIsSubComponentOpen,
    isSubComponentClosing,
    setIsSubComponentClosing,
    connectRef,
    breakpoint,
  } = useWalletContext();

  const { showQr, showSwap, tokenBalances, animations } =
    useWalletAdvancedContext();

  const handleBottomSheetClose = useCallback(() => {
    setIsSubComponentOpen(false);
  }, [setIsSubComponentOpen]);

  const handleAnimationEnd = useCallback(() => {
    if (isSubComponentClosing) {
      setIsSubComponentOpen(false);
      setIsSubComponentClosing(false);
    }
  }, [isSubComponentClosing, setIsSubComponentOpen, setIsSubComponentClosing]);

  const content = useMemo(() => {
    if (showQr) {
      return (
        <ContentWrapper>
          <WalletAdvancedQrReceive classNames={classNames?.qr} />
        </ContentWrapper>
      );
    }

    if (showSwap) {
      return (
        <ContentWrapper>
          <WalletAdvancedSwap
            title={
              <div
                className={cn(text.headline, 'w-full text-center text-base')}
              >
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
            classNames={classNames?.swap}
          />
        </ContentWrapper>
      );
    }

    return <ContentWrapper className="px-4 py-3">{children}</ContentWrapper>;
  }, [showQr, showSwap, swappableTokens, tokenBalances, children, classNames]);

  if (breakpoint === 'sm') {
    return (
      <BottomSheet
        isOpen={isSubComponentOpen}
        triggerRef={connectRef}
        onClose={handleBottomSheetClose}
        className={classNames?.container}
      >
        <div className="flex h-full w-full flex-col items-center justify-center">
          {content}
        </div>
      </BottomSheet>
    );
  }

  return (
    <div
      data-testid="ockWalletAdvancedContent"
      className={cn(
        background.default,
        border.radius,
        border.lineDefault,
        zIndex.dropdown,
        'my-1.5 h-auto w-full',
        'flex items-center justify-center',
        animations.container,
        classNames?.container,
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      {content}
    </div>
  );
}

function ContentWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between',
        'h-120 w-88',
        className,
      )}
    >
      {children}
    </div>
  );
}
