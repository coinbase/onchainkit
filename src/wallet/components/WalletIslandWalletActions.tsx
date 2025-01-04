import { clockSvg } from '@/internal/svg/clockSvg';
import { disconnectSvg } from '@/internal/svg/disconnectSvg';
import { qrIconSvg } from '@/internal/svg/qrIconSvg';
import { refreshSvg } from '@/internal/svg/refreshSvg';
import { border, cn, pressable } from '@/styles/theme';
import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

export function WalletIslandWalletActions() {
  const { isClosing, handleClose } = useWalletContext();
  const { setShowQr, refetchPortfolioData, portfolioDataUpdatedAt } =
    useWalletIslandContext();
  const { disconnect, connectors } = useDisconnect();

  const handleDisconnect = useCallback(() => {
    handleClose();
    for (const connector of connectors) {
      disconnect({ connector });
    }
  }, [disconnect, connectors, handleClose]);

  const handleQr = useCallback(() => {
    setShowQr(true);
  }, [setShowQr]);

  const handleRefreshPortfolioData = useCallback(async () => {
    if (
      portfolioDataUpdatedAt &&
      Date.now() - portfolioDataUpdatedAt < 1000 * 15
    ) {
      return; // TODO: Add toast
    }
    await refetchPortfolioData();
  }, [refetchPortfolioData, portfolioDataUpdatedAt]);

  return (
    <div
      className={cn('flex w-full items-center justify-between', {
        'fade-in slide-in-from-top-2.5 animate-in fill-mode-forwards duration-300 ease-out':
          !isClosing,
      })}
    >
      <div className="flex items-center">
        <a
          data-testid="ockWalletIsland_TransactionsButton"
          href="https://wallet.coinbase.com/assets/transactions"
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-2',
          )}
        >
          {clockSvg}
        </a>
        <button
          data-testid="ockWalletIsland_QrButton"
          type="button"
          onClick={handleQr}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-2',
          )}
        >
          {qrIconSvg}
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          data-testid="ockWalletIsland_DisconnectButton"
          type="button"
          onClick={handleDisconnect}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-2',
          )}
        >
          <div className="h-7 w-7 scale-110 p-2">{disconnectSvg}</div>
        </button>
        <button
          data-testid="ockWalletIsland_RefreshButton"
          type="button"
          onClick={handleRefreshPortfolioData}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-2',
          )}
        >
          <div className='h-7 w-7 scale-125 p-2'>{refreshSvg}</div>
        </button>
      </div>
    </div>
  );
}
