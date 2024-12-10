import { isValidElement, useMemo } from 'react';
import { CoinbasePaySvg } from '../svg/coinbasePaySvg';
import { toggleSvg } from '../../internal/svg/toggleSvg';
import { applePaySvg } from '../svg/applePaySvg';
import { fundWalletSvg } from '../svg/fundWallet';
import { swapSettingsSvg } from '../svg/swapSettings';
import { walletSvg } from '../svg/walletSvg';
import { creditCardSvg } from '../svg/creditCardSvg';

export const useIcon = ({ icon, className }: { icon?: React.ReactNode, className?: string }) => {
  return useMemo(() => {
    if (icon === undefined) {
      return null;
    }
    switch (icon) {
      case 'coinbasePay':
        return <CoinbasePaySvg className={className} />;
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
      case 'creditCard':
        return creditCardSvg;
    }
    if (isValidElement(icon)) {
      return icon;
    }
  }, [icon, className]);
};
