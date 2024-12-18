import { isValidElement, useMemo } from 'react';
import { applePaySvg } from '../../../internal/svg/applePaySvg';
import { CoinbasePaySvg } from '../../../internal/svg/coinbasePaySvg';
import { creditCardSvg } from '../../../internal/svg/creditCardSvg';
import { fundWalletSvg } from '../../../internal/svg/fundWallet';
import { swapSettingsSvg } from '../../../internal/svg/swapSettings';
import { toggleSvg } from '../../../internal/svg/toggleSvg';
import { walletSvg } from '../../../internal/svg/walletSvg';

export const useIcon = ({
  icon,
  className,
}: { icon?: React.ReactNode; className?: string }) => {
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
