import { useCallback } from 'react';
import { backArrowSvg } from '../../../internal/svg/backArrowSvg';
import { copySvg } from '../../../internal/svg/copySvg';
import { useWalletIslandContext } from './WalletIslandProvider';
import { cn, color, text } from '../../../styles/theme';

export function WalletIslandQrReceive() {
  const { setShowQr } = useWalletIslandContext();

  const handleCloseQr = useCallback(() => {
    setShowQr(false);
  }, [setShowQr]);

  const handleCopyAddress = useCallback(() => {
    console.log('copy');
  }, []);

  return (
    <div
      className={cn(
        color.foreground,
        text.headline,
        'flex flex-col items-center justify-center',
        'w-full',
      )}
    >
      <div className="flex w-full flex-row items-center justify-around">
        <button type="button" onClick={handleCloseQr}>
          {backArrowSvg}
        </button>
        <span>Scan to receive</span>
        <button type="button" onClick={handleCopyAddress}>
          {copySvg}
        </button>
      </div>
      <div>QR CODE</div>
      <button type="button" onClick={handleCopyAddress}>
        <span>Copy address</span>
      </button>
    </div>
  );
}
