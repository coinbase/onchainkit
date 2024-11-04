import { useMemo, isValidElement } from 'react';
import { coinbasePaySvg } from '../svg/coinbasePaySvg.js';
import { fundWalletSvg } from '../svg/fundWallet.js';
import { swapSettingsSvg } from '../svg/swapSettings.js';
import { walletSvg } from '../svg/walletSvg.js';
const useIcon = ({
  icon
}) => {
  return useMemo(() => {
    if (icon === undefined) {
      return null;
    }
    switch (icon) {
      case 'coinbasePay':
        return coinbasePaySvg;
      case 'fundWallet':
        return fundWalletSvg;
      case 'swapSettings':
        return swapSettingsSvg;
      case 'wallet':
        return walletSvg;
    }
    if ( /*#__PURE__*/isValidElement(icon)) {
      return icon;
    }
  }, [icon]);
};
export { useIcon };
//# sourceMappingURL=useIcon.js.map
