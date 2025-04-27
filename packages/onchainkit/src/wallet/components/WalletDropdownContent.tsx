import { BottomSheet } from '@/internal/components/BottomSheet';
import { zIndex } from '@/styles/constants';
import { background, border, cn, text } from '@/styles/theme';
import { useCallback, useMemo } from 'react';
import { WALLET_ADVANCED_DEFAULT_SWAPPABLE_TOKENS } from '../constants';
import type { WalletAdvancedReact } from '../types';
import { WalletAdvancedQrReceive } from './WalletAdvancedQrReceive';
import { WalletAdvancedSwap } from './WalletAdvancedSwap';
import { useWalletContext } from './WalletProvider';
import { Send } from './wallet-advanced-send/components/Send';
import { RequestContext } from '@/core/network/constants';
import { usePortfolio } from '@/wallet/hooks/usePortfolio';
import { useAccount } from 'wagmi';

export function WalletDropdownContent({
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
    activeFeature,
    animations,
  } = useWalletContext();

  const { address } = useAccount();
  const { data: portfolioData } = usePortfolio(
    { address, enabled: Boolean(activeFeature) },
    RequestContext.Wallet,
  );
  const tokenBalances = portfolioData?.tokenBalances;

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
    if (activeFeature === 'send') {
      return (
        <ContentWrapper>
          <Send className="border-none" />
        </ContentWrapper>
      );
    }

    if (activeFeature === 'qr') {
      return (
        <ContentWrapper>
          <WalletAdvancedQrReceive classNames={classNames?.qr} />
        </ContentWrapper>
      );
    }

    if (activeFeature === 'swap') {
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

    return <ContentWrapper>{children}</ContentWrapper>;
  }, [activeFeature, swappableTokens, tokenBalances, children, classNames]);

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
      data-testid="ockWalletDropdownContent"
      className={cn(
        background.default,
        border.radius,
        border.lineDefault,
        zIndex.dropdown,
        'my-1.5 h-auto w-full',
        'flex justify-center',
        // ensure border radius is respected
        'overflow-hidden',
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
        'flex flex-col justify-between',
        'min-w-80 max-h-120',
        className,
      )}
    >
      {children}
    </div>
  );
}
