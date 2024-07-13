import { Children, useMemo } from 'react';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import { WalletProvider } from './WalletProvider';
import type { WalletReact } from '../types';

export function Wallet({ children }: WalletReact) {
  const { connect, dropdown } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      connect: childrenArray.filter(({ type }) => type === ConnectWallet),
      // @ts-ignore
      dropdown: childrenArray.filter(({ type }) => type === WalletDropdown),
    };
  }, [children]);

  return (
    <WalletProvider>
        <div className="relative w-fit shrink-0">
          {connect}
          {dropdown}
        </div>
    </WalletProvider>
  );
}
