import { PressableIcon } from '@/internal/components/PressableIcon';
import { clockSvg } from '@/internal/svg/clockSvg';
import { disconnectSvg } from '@/internal/svg/disconnectSvg';
import { qrIconSvg } from '@/internal/svg/qrIconSvg';
import { refreshSvg } from '@/internal/svg/refreshSvg';
import { cn } from '@/styles/theme';
import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

export function WalletIslandWalletActions() {
  const { handleClose } = useWalletContext();
  const { setShowQr, refetchPortfolioData, animations } =
    useWalletIslandContext();
  const { disconnect, connectors } = useDisconnect();

  const handleTransactions = useCallback(() => {
    window.open('https://wallet.coinbase.com/assets/transactions', '_blank');
  }, []);

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
    await refetchPortfolioData();
  }, [refetchPortfolioData]);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between',
        animations.content,
      )}
    >
      <div className="flex items-center">
        <PressableIcon
          ariaLabel="Open transaction history"
          onClick={handleTransactions}
        >
          <div data-testid="ockWalletIsland_TransactionsButton">{clockSvg}</div>
        </PressableIcon>
        <PressableIcon ariaLabel="Show QR code" onClick={handleQr}>
          <div data-testid="ockWalletIsland_QrButton">{qrIconSvg}</div>
        </PressableIcon>
      </div>
      <div className="flex items-center">
        <PressableIcon ariaLabel="Disconnect wallet" onClick={handleDisconnect}>
          <div
            data-testid="ockWalletIsland_DisconnectButton"
            className="h-7 w-7 scale-110 p-2"
          >
            {disconnectSvg}
          </div>
        </PressableIcon>
        <PressableIcon
          ariaLabel="Refresh portfolio data"
          onClick={handleRefreshPortfolioData}
        >
          <div
            data-testid="ockWalletIsland_RefreshButton"
            className="h-7 w-7 scale-110 p-2"
          >
            {refreshSvg}
          </div>
        </PressableIcon>
      </div>
    </div>
  );
}
