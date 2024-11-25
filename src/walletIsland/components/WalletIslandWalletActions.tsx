import { useCallback } from 'react';
import { useDisconnect } from 'wagmi';
import { clockSvg } from '../../internal/svg/clockSvg';
import { collapseSvg } from '../../internal/svg/collapseSvg';
import { disconnectSvg } from '../../internal/svg/disconnectSvg';
import { qrIconSvg } from '../../internal/svg/qrIconSvg';
import { useWalletContext } from '../../wallet/components/WalletProvider';

export default function WalletIslandWalletActions() {
  const { disconnect, connectors } = useDisconnect();

  const { setIsOpen } = useWalletContext();

  const handleDisconnect = useCallback(() => {
    // Disconnect all the connectors (wallets). Usually only one is connected
    connectors.map((connector) => disconnect({ connector }));
    setIsOpen(false);
  }, [disconnect, connectors, setIsOpen]);

  const handleQr = useCallback(() => {
    console.log('qr');
  }, []);

  const handleCollapse = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <a
          href="https://wallet.coinbase.com/assets/transactions"
          target="_blank"
          rel="noreferrer noopener"
        >
          {clockSvg}
        </a>
        <button type="button" onClick={handleQr}>
          {qrIconSvg}
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button type="button" onClick={handleDisconnect}>
          {disconnectSvg}
        </button>
        <button type="button" onClick={handleCollapse}>
          {collapseSvg}
        </button>
      </div>
    </div>
  );
}
