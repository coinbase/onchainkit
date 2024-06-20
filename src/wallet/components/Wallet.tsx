import { Children, useMemo } from 'react';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { WalletContext } from '../context';
import type { WalletReact } from '../types';

export function Wallet({ address, children, schemaId }: WalletReact) {
  const value = useMemo(() => {
    return {
      address,
      schemaId,
    };
  }, [address, schemaId]);

  const { avatar, names } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      avatar: childrenArray.filter(({ type }) => type === Avatar),
      // @ts-ignore
      names: childrenArray.filter(({ type }) => type === Name),
    };
  }, [children]);

  return (
    <WalletContext.Provider value={value}>
      <div
        className="flex h-10 items-center space-x-4"
        data-testid="ockIdentity_container"
      >
        {avatar}
        <div className="flex flex-col text-sm">
          {names[0]}
          {names[1]}
        </div>
      </div>
    </WalletContext.Provider>
  );
}
