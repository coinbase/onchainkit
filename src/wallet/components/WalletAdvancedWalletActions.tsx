'use client';

import { PressableIcon } from '@/internal/components/PressableIcon';
import { baseScanSvg } from '@/internal/svg/baseScanSvg';
import { disconnectSvg } from '@/internal/svg/disconnectSvg';
import { qrIconSvg } from '@/internal/svg/qrIconSvg';
import { refreshSvg } from '@/internal/svg/refreshSvg';
import { cn } from '@/styles/theme';
import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import type { WalletAdvancedWalletActionsProps } from '../types';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';

export function WalletAdvancedWalletActions({
  classNames,
}: WalletAdvancedWalletActionsProps) {
  const { address, handleClose } = useWalletContext();
  const { setShowQr, refetchPortfolioData, animations } =
    useWalletAdvancedContext();
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
      data-testid="ockWalletAdvanced_WalletActions"
      className={cn(
        'flex w-80 items-center justify-between',
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
            className={cn('h-7 w-7 scale-110 p-2', classNames?.iconOne)}
          >
            {baseScanSvg}
          </div>
        </PressableIcon>
        <PressableIcon ariaLabel="Show QR code" onClick={handleQr}>
          <div
            data-testid="ockWalletAdvanced_QrButton"
            className={cn('h-7 w-7 scale-110', classNames?.iconTwo)}
          >
            {qrIconSvg}
          </div>
        </PressableIcon>
      </div>
      <div className="flex items-center">
        <PressableIcon ariaLabel="Disconnect wallet" onClick={handleDisconnect}>
          <div
            data-testid="ockWalletAdvanced_DisconnectButton"
            className={cn('h-7 w-7 scale-110 p-2', classNames?.iconThree)}
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
            className={cn('h-7 w-7 scale-110 p-2', classNames?.iconFour)}
          >
            {refreshSvg}
          </div>
        </PressableIcon>
      </div>
    </div>
  );
}
