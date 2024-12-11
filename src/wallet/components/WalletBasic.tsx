import { Children, useMemo } from 'react';
import { findComponent } from '../../core-react/internal/utils/findComponent';
import { cn } from '../../styles/theme';
import type { WalletReact } from '../types';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { useWalletContext } from './WalletProvider';

export function WalletBasic({ children, className }: WalletReact) {
  const { isOpen } = useWalletContext();

  const { connect, dropdown } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      connect: childrenArray.find(findComponent(ConnectWallet)),
      dropdown: childrenArray.find(findComponent(WalletDropdown)),
    };
  }, [children]);

  return (
    <div className={cn('relative w-fit shrink-0', className)}>
      {connect}
      {isOpen && dropdown}
    </div>
  );
}
