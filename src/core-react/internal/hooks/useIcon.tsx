import { applePaySvg } from '@/internal/svg/applePaySvg';
import { isValidElement, useMemo } from 'react';
import { appleSvg } from '../../../internal/svg/appleSvg';
import { coinbaseLogoSvg } from '../../../internal/svg/coinbaseLogoSvg';
import { coinbasePaySvg } from '../../../internal/svg/coinbasePaySvg';
import { creditCardSvg } from '../../../internal/svg/creditCardSvg';
import { fundWalletSvg } from '../../../internal/svg/fundWallet';
import { swapSettingsSvg } from '../../../internal/svg/swapSettings';
import { toggleSvg } from '../../../internal/svg/toggleSvg';
import { walletSvg } from '../../../internal/svg/walletSvg';

export const useIcon = ({ icon }: { icon?: React.ReactNode }) => {
  return useMemo(() => {
    if (icon === undefined) {
      return null;
    }
    switch (icon) {
      case 'coinbasePay':
        return coinbasePaySvg;
      case 'coinbaseLogo':
        return coinbaseLogoSvg;
      case 'fundWallet':
        return fundWalletSvg;
      case 'swapSettings':
        return swapSettingsSvg;
      case 'wallet':
        return walletSvg;
      case 'toggle':
        return toggleSvg;
      case 'applePay':
        return applePaySvg;
      case 'apple':
        return appleSvg;
      case 'creditCard':
        return creditCardSvg;
    }
    if (isValidElement(icon)) {
      return icon;
    }
  }, [icon]);
};
