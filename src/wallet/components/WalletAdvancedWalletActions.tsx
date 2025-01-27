'use client';

import { PressableIcon } from '@/internal/components/PressableIcon';
import { useAnalytics } from '@/internal/hooks/useAnalytics';
import { baseScanSvg } from '@/internal/svg/baseScanSvg';
import { disconnectSvg } from '@/internal/svg/disconnectSvg';
import { qrIconSvg } from '@/internal/svg/qrIconSvg';
import { refreshSvg } from '@/internal/svg/refreshSvg';
import { AnalyticsEvent, WalletOption } from '@/internal/types';
import { cn } from '@/styles/theme';
import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';
export function WalletAdvancedWalletActions() {
  const { address, handleClose } = useWalletContext();
  const { setShowQr, refetchPortfolioData, animations } =
    useWalletAdvancedContext();
  const { disconnect, connectors } = useDisconnect();
  const { sendAnalytics } = useAnalytics();

  const handleTransactions = useCallback(() => {
    sendAnalytics(AnalyticsEvent.WALLET_OPTION_SELECTED, {
      option: WalletOption.EXPLORER,
    });
    window.open(`https://basescan.org/address/${address}`, '_blank');
  }, [address, sendAnalytics]);

  const handleDisconnect = useCallback(() => {
    handleClose();
    for (const connector of connectors) {
      disconnect({ connector });
    }
  }, [disconnect, connectors, handleClose]);

  const handleQr = useCallback(() => {
    sendAnalytics(AnalyticsEvent.WALLET_OPTION_SELECTED, {
      option: WalletOption.RECEIVE,
    });
    setShowQr(true);
  }, [sendAnalytics, setShowQr]);

  const handleRefreshPortfolioData = useCallback(async () => {
    sendAnalytics(AnalyticsEvent.WALLET_OPTION_SELECTED, {
      option: WalletOption.REFRESH,
    });
    await refetchPortfolioData();
  }, [refetchPortfolioData, sendAnalytics]);

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
            data-testid="ockWalletAdvanced_TransactionsButton"
            className="h-7 w-7 scale-110 p-2"
          >
            {baseScanSvg}
          </div>
        </PressableIcon>
        <PressableIcon ariaLabel="Show QR code" onClick={handleQr}>
          <div
            data-testid="ockWalletAdvanced_QrButton"
            className="h-7 w-7 scale-110"
          >
            {qrIconSvg}
          </div>
        </PressableIcon>
      </div>
      <div className="flex items-center">
        <PressableIcon ariaLabel="Disconnect wallet" onClick={handleDisconnect}>
          <div
            data-testid="ockWalletAdvanced_DisconnectButton"
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
            data-testid="ockWalletAdvanced_RefreshButton"
            className="h-7 w-7 scale-110 p-2"
          >
            {refreshSvg}
          </div>
        </PressableIcon>
      </div>
    </div>
  );
}
