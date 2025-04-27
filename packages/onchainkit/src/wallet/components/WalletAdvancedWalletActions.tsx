'use client';

import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { WalletEvent, WalletOption } from '@/core/analytics/types';
import { PressableIcon } from '@/internal/components/PressableIcon';
import { baseScanSvg } from '@/internal/svg/baseScanSvg';
import { disconnectSvg } from '@/internal/svg/disconnectSvg';
import { qrIconSvg } from '@/internal/svg/qrIconSvg';
import { refreshSvg } from '@/internal/svg/refreshSvg';
import { cn } from '@/styles/theme';
import { useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWalletContext } from './WalletProvider';
import { usePortfolio } from '../hooks/usePortfolio';
import { RequestContext } from '@/core/network/constants';

type WalletAdvancedWalletActionsProps = {
  classNames?: {
    container?: string;
    baseScanIcon?: string;
    qrIcon?: string;
    disconnectIcon?: string;
    refreshIcon?: string;
  };
};

export function WalletAdvancedWalletActions({
  classNames,
}: WalletAdvancedWalletActionsProps) {
  const { address } = useAccount();
  const { handleClose, setActiveFeature, animations } = useWalletContext();
  const { disconnect, connectors } = useDisconnect();
  const { sendAnalytics } = useAnalytics();

  const { refetch: refetchPortfolioData } = usePortfolio(
    { address },
    RequestContext.Wallet,
  );

  const handleAnalyticsOptionSelected = useCallback(
    (option: WalletOption) => {
      sendAnalytics(WalletEvent.OptionSelected, {
        option,
      });
    },
    [sendAnalytics],
  );

  const handleAnalyticsDisconnect = useCallback(
    (walletProvider: string) => {
      sendAnalytics(WalletEvent.Disconnect, {
        component: 'WalletAdvanced',
        walletProvider,
      });
    },
    [sendAnalytics],
  );

  const handleTransactions = useCallback(() => {
    handleAnalyticsOptionSelected(WalletOption.Explorer);
    window.open(`https://basescan.org/address/${address}`, '_blank');
  }, [address, handleAnalyticsOptionSelected]);

  const handleDisconnect = useCallback(() => {
    const walletProvider = connectors[0]?.name || 'unknown';
    handleAnalyticsDisconnect(walletProvider);

    handleClose();
    for (const connector of connectors) {
      disconnect({ connector });
    }
  }, [disconnect, connectors, handleClose, handleAnalyticsDisconnect]);

  const handleQr = useCallback(() => {
    handleAnalyticsOptionSelected(WalletOption.QR);
    setActiveFeature('qr');
  }, [setActiveFeature, handleAnalyticsOptionSelected]);

  const handleRefreshPortfolioData = useCallback(async () => {
    handleAnalyticsOptionSelected(WalletOption.Refresh);
    await refetchPortfolioData();
  }, [refetchPortfolioData, handleAnalyticsOptionSelected]);

  return (
    <div
      data-testid="ockWalletAdvanced_WalletActions"
      className={cn(
        'flex w-88 items-center justify-between px-4 py-3',
        animations.content,
        classNames?.container,
      )}
    >
      <div className="flex items-center">
        <PressableIcon
          ariaLabel="Open transaction history"
          onClick={handleTransactions}
        >
          <div
            data-testid="ockWalletAdvanced_TransactionsButton"
            className={cn('h-7 w-7 scale-110 p-2', classNames?.baseScanIcon)}
          >
            {baseScanSvg}
          </div>
        </PressableIcon>
        <PressableIcon ariaLabel="Show QR code" onClick={handleQr}>
          <div
            data-testid="ockWalletAdvanced_QrButton"
            className={cn('h-7 w-7 scale-110', classNames?.qrIcon)}
          >
            {qrIconSvg}
          </div>
        </PressableIcon>
      </div>
      <div className="flex items-center">
        <PressableIcon ariaLabel="Disconnect wallet" onClick={handleDisconnect}>
          <div
            data-testid="ockWalletAdvanced_DisconnectButton"
            className={cn('h-7 w-7 scale-110 p-2', classNames?.disconnectIcon)}
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
            className={cn('h-7 w-7 scale-110 p-2', classNames?.refreshIcon)}
          >
            {refreshSvg}
          </div>
        </PressableIcon>
      </div>
    </div>
  );
}
