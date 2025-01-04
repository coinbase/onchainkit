import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { Draggable } from '@/internal/components/Draggable';
import { background, border, cn, text } from '@/styles/theme';
import type { Token } from '@/token';
import { useMemo } from 'react';
import { base } from 'viem/chains';
import type { WalletIslandProps } from '../types';
import { useWalletIslandContext } from './WalletIslandProvider';
import { WalletIslandQrReceive } from './WalletIslandQrReceive';
import { WalletIslandSwap } from './WalletIslandSwap';
import { useWalletContext } from './WalletProvider';

const WALLET_ISLAND_WIDTH = 352;
const WALLET_ISLAND_HEIGHT = 394;
const WALLET_ISLAND_DEFAULT_SWAPPABLE_TOKENS: Token[] = [
  {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: base.id,
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: base.id,
  },
];

export function WalletIslandContent({
  children,
  swappableTokens,
  walletContainerRef,
}: WalletIslandProps) {
  const { isClosing, setIsOpen, setIsClosing } = useWalletContext();
  const { showQr, showSwap, tokenBalances } = useWalletIslandContext();
  const componentTheme = useTheme();

  const position = useMemo(() => {
    if (walletContainerRef?.current) {
      const rect = walletContainerRef.current.getBoundingClientRect();
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
  }, [walletContainerRef]);

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
          isClosing
            ? 'fade-out slide-out-to-top-1.5 animate-out fill-mode-forwards ease-in-out'
            : 'fade-in slide-in-from-top-1.5 animate-in duration-300 ease-out',
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
