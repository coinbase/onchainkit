import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { clockSvg } from '../../../internal/svg/clockSvg';
import { collapseSvg } from '../../../internal/svg/collapseSvg';
import { disconnectSvg } from '../../../internal/svg/disconnectSvg';
import { qrIconSvg } from '../../../internal/svg/qrIconSvg';
import { useWalletContext } from '../WalletProvider';
import { useWalletIslandContext } from './WalletIslandProvider';
import { border, cn, pressable } from '../../../styles/theme';

export default function WalletIslandWalletActions() {
  const { setShowQr } = useWalletIslandContext();
  const { disconnect, connectors } = useDisconnect();

  const { setIsOpen } = useWalletContext();

  const handleDisconnect = useCallback(() => {
    connectors.map((connector) => disconnect({ connector }));
    setIsOpen(false);
  }, [disconnect, connectors, setIsOpen]);

  const handleQr = useCallback(() => {
    setShowQr(true);
  }, [setShowQr]);

  const handleCollapse = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center">
        <a
          href="https://wallet.coinbase.com/assets/transactions"
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-1',
          )}
        >
          {clockSvg}
        </a>
        <button
          type="button"
          onClick={handleQr}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-1',
          )}
        >
          {qrIconSvg}
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleDisconnect}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-1',
          )}
        >
          {disconnectSvg}
        </button>
        <button
          type="button"
          onClick={handleCollapse}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-1',
          )}
        >
          {collapseSvg}
        </button>
      </div>
    </div>
  );
}
