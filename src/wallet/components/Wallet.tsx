import { Children, useMemo } from 'react';
import { ConnectAccount } from './ConnectAccount';
import { WalletDropdown } from './WalletDropdown';
import { WalletContext } from '../context';
import type { WalletReact } from '../types';

export function Wallet({ children }: WalletReact) {
  const value = useMemo(() => {
    return {};
  }, []);

  const { connectAccount, walletDropdown } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      connectAccount: childrenArray.filter(
        ({ type }) => type === ConnectAccount,
      ),
      // @ts-ignore
      walletDropdown: childrenArray.filter(
        ({ type }) => type === WalletDropdown,
      ),
    };
  }, [children]);

  return (
    <WalletContext.Provider value={value}>
      {connectAccount}
      {walletDropdown}
    </WalletContext.Provider>
  );
}
