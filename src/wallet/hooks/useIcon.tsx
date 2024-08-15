import { isValidElement, useMemo } from 'react';
import { fundWalletSvg } from '../../internal/svg/fundWallet';
import { walletSvg } from '../../internal/svg/walletSvg';

export const useIcon = ({ icon }: { icon?: React.ReactNode }) => {
  return useMemo(() => {
    if (icon === undefined) {
      return null;
    }
    switch (icon) {
      case 'wallet':
        return walletSvg;
      case 'fundWallet':
        return fundWalletSvg;
    }
    if (isValidElement(icon)) {
      return icon;
    }
  }, [icon]);
};
