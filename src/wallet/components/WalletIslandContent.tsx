import { background, border, cn, text } from '@/styles/theme';
import { WALLET_ISLAND_DEFAULT_SWAPPABLE_TOKENS } from '../constants';
import type { WalletIslandReact } from '../types';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandQrReceive } from './WalletIslandQrReceive';
import { WalletIslandSwap } from './WalletIslandSwap';
import { useWalletContext } from './WalletProvider';

export function WalletIslandContent({
  children,
  swappableTokens,
}: WalletIslandReact) {
  const { isClosing, setIsOpen, setIsClosing } = useWalletContext();
  const { showQr, showSwap, tokenBalances, animations } =
    useWalletIslandContext();

  return (
    <div
      data-testid="ockWalletIslandContent"
      className={cn(
        background.default,
        border.radius,
        border.lineDefault,
        'my-1.5 h-auto w-88',
        'flex items-center justify-center',
        animations.container,
      )}
      onAnimationEnd={() => {
        if (isClosing) {
          setIsOpen(false);
          setIsClosing(false);
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
        <WalletIslandQrReceive />
      </div>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          'h-120 w-88',
          showSwap ? '' : 'hidden',
        )}
      >
        <WalletIslandSwap
          title={
            <div className={cn(text.headline, 'w-full text-center text-base')}>
              Swap
            </div>
          }
          to={swappableTokens ?? WALLET_ISLAND_DEFAULT_SWAPPABLE_TOKENS}
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
