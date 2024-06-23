import { Children, useMemo } from 'react';
import { ConnectAccount } from './ConnectAccount';
import { WalletDropdown } from './WalletDropdown';
import { WalletContext } from '../context';
import type { WalletReact } from '../types';

export function Wallet({ children }: WalletReact) {
  const value = useMemo(() => {
    return {};
  }, []);

  const { connect, dropdown } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      connect: childrenArray.filter(({ type }) => type === ConnectAccount),
      // @ts-ignore
      dropdown: childrenArray.filter(({ type }) => type === WalletDropdown),
    };
  }, [children]);

  return (
    <WalletContext.Provider value={value}>
      {connect}
      {dropdown}
    </WalletContext.Provider>
  );
}
