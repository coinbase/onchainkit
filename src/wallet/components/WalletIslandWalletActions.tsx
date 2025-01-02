import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { clockSvg } from '@/internal/svg/clockSvg';
import { collapseSvg } from '@/internal/svg/collapseSvg';
import { disconnectSvg } from '@/internal/svg/disconnectSvg';
import { qrIconSvg } from '@/internal/svg/qrIconSvg';
import { border, cn, pressable } from '../../styles/theme';
import { useWalletContext } from './WalletProvider';
import { useWalletIslandContext } from './WalletIslandProvider';

export function WalletIslandWalletActions() {
  const { handleClose } = useWalletContext();
  const { setShowQr, animationClasses } = useWalletIslandContext();
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

  const handleCollapse = useCallback(() => {
    handleClose();
  }, [handleClose]);

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between',
        'opacity-0',
        animationClasses.walletActions,
      )}
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
          {disconnectSvg}
        </button>
        <button
          data-testid="ockWalletIsland_CollapseButton"
          type="button"
          onClick={handleCollapse}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-2',
          )}
        >
          {collapseSvg}
        </button>
      </div>
    </div>
  );
}
