import { Children, useMemo } from 'react';
import { ConnectWallet } from './ConnectWallet';
import { WalletDropdown } from './WalletDropdown';
import type { WalletReact } from '../types';
import { WalletProvider } from './WalletProvider';

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
      <div className="relative shrink-0 w-fit">
        {connect}
        {dropdown}
      </div>
    </WalletProvider>
  );
}
