import { isValidElement, useMemo } from 'react';
import { coinbasePaySvg } from '../svg/coinbasePaySvg';
import { fundWalletSvg } from '../svg/fundWallet';
import { swapSettingsSvg } from '../svg/swapSettings';
import { walletSvg } from '../svg/walletSvg';

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
