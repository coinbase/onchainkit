import { isValidElement, useMemo } from 'react';
import { coinbasePaySvg } from './internal/svg/coinbasePaySvg';
import { fundWalletSvg } from './internal/svg/fundWallet';
import { swapSettingsSvg } from './internal/svg/swapSettings';
import { walletSvg } from './internal/svg/walletSvg';

export const useIcon = ({ icon }: { icon?: React.ReactNode }) => {
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
    if (isValidElement(icon)) {
      return icon;
    }
  }, [icon]);
};
