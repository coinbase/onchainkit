import { background, border, cn, text } from '@/styles/theme';
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
    isSubComponentClosing,
    setIsSubComponentOpen,
    setIsSubComponentClosing,
  } = useWalletContext();
  const { showQr, showSwap, tokenBalances, animations } =
    useWalletAdvancedContext();

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
        classNames?.container,
      )}
      onAnimationEnd={() => {
        if (isSubComponentClosing) {
          setIsSubComponentOpen(false);
          setIsSubComponentClosing(false);
        }
      }}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'h-120 w-88',
          showQr ? '' : 'hidden',
        )}
      >
        <WalletAdvancedQrReceive classNames={classNames?.qr} />
      </div>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'h-120 w-88',
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
          classNames={{
            container: cn('w-full px-4 pt-3 pb-4', classNames?.swap?.container),
            ...classNames?.swap,
          }}
        />
      </div>
      <div
        className={cn(
          'flex flex-col items-center justify-between',
          'h-120 w-88',
          'px-4 py-3',
          showQr || showSwap ? 'hidden' : '',
        )}
      >
        {children}
      </div>
    </div>
  );
}
