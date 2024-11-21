import { clockSvg } from '../../internal/svg/clockSvg';
import { qrIconSvg } from '../../internal/svg/qrIconSvg';
import { disconnectSvg } from '../../internal/svg/disconnectSvg';
import { collapseSvg } from '../../internal/svg/collapseSvg';
import { WalletIsland } from './WalletIsland';

export function WalletIslandDefault() {
  return (
    <WalletIsland>
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
      HelloNeo
    </WalletIsland>
  );
}
