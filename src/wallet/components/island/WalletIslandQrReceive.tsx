import { useCallback } from 'react';
import { backArrowSvg } from '../../../internal/svg/backArrowSvg';
import { copySvg } from '../../../internal/svg/copySvg';
import { useWalletIslandContext } from './WalletIslandProvider';
import { border, cn, color, pressable, text } from '../../../styles/theme';
import { useWalletContext } from '../WalletProvider';

export function WalletIslandQrReceive() {
  const { address } = useWalletContext();
  const { setShowQr } = useWalletIslandContext();

  const handleCloseQr = useCallback(() => {
    setShowQr(false);
  }, [setShowQr]);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address ?? '');
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  }, [address]);

  return (
    <div
      className={cn(
        color.foreground,
        text.headline,
        'flex flex-col items-center justify-center gap-12',
        'w-full',
      )}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <button type="button" onClick={handleCloseQr}>
          {backArrowSvg}
        </button>
        <span>Scan to receive</span>
        <button
          type="button"
          onClick={handleCopyAddress}
          className="rounded-lg p-2 hover:bg-[var(--ock-bg-default-hover)] active:bg-[var(--ock-bg-default-active)]"
        >
          {copySvg}
        </button>
      </div>
      <div>QR CODE</div>
      <button
        type="button"
        className={cn(border.radius, pressable.alternate, 'w-full p-3')}
        onClick={handleCopyAddress}
      >
        <span>Copy address</span>
      </button>
    </div>
  );
}
