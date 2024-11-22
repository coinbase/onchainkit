import { clockSvg } from '../../internal/svg/clockSvg';
import { collapseSvg } from '../../internal/svg/collapseSvg';
import { disconnectSvg } from '../../internal/svg/disconnectSvg';
import { qrIconSvg } from '../../internal/svg/qrIconSvg';

export default function WalletIslandWalletActions() {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        {clockSvg}
        {qrIconSvg}
      </div>
      <div className="flex items-center gap-1">
        {disconnectSvg}
        {collapseSvg}
      </div>
    </div>
  );
}
