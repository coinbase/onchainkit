import { coinbasePaySvg } from '@/core/svg/coinbasePaySvg';
import { fundWalletSvg } from '@/core/svg/fundWallet';
import { swapSettingsSvg } from '@/core/svg/swapSettings';
import { walletSvg } from '@/core/svg/walletSvg';
import { isValidElement, useMemo } from 'react';

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
