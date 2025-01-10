import { PressableIcon } from '@/internal/components/PressableIcon';
import { baseScanSvg } from '@/internal/svg/baseScanSvg';
import { disconnectSvg } from '@/internal/svg/disconnectSvg';
import { qrIconSvg } from '@/internal/svg/qrIconSvg';
import { refreshSvg } from '@/internal/svg/refreshSvg';
import { cn } from '@/styles/theme';
import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

export function WalletIslandWalletActions() {
  const { address, handleClose } = useWalletContext();
  const { setShowQr, refetchPortfolioData, animations } =
    useWalletIslandContext();
  const { disconnect, connectors } = useDisconnect();

  const handleTransactions = useCallback(() => {
    window.open(`https://basescan.org/address/${address}`, '_blank');
  }, [address]);

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
        'flex w-80 items-center justify-between',
        animations.content,
      )}
    >
      <div className="flex items-center">
        <PressableIcon
          ariaLabel="Open transaction history"
          onClick={handleTransactions}
        >
          <div
            data-testid="ockWalletIsland_TransactionsButton"
            className="h-7 w-7 scale-110 p-2"
          >
            {baseScanSvg}
          </div>
        </PressableIcon>
        <PressableIcon ariaLabel="Show QR code" onClick={handleQr}>
          <div
            data-testid="ockWalletIsland_QrButton"
            className="h-7 w-7 scale-110"
          >
            {qrIconSvg}
          </div>
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
