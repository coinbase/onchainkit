import { Children, useMemo } from 'react';
import { Avatar } from './Avatar';
import { IdentityContext } from '../context';
import type { IdentityReact } from '../types';

export function Identity({ address, children }: IdentityReact) {
  const value = useMemo(() => {
    return {
      address,
    };
  }, [address]);

  const { avatar } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      avatar: childrenArray.filter(({ type }) => type === Avatar),
    };
  }, [children]);

  return (
    <IdentityContext.Provider value={value}>
      <div className="flex h-10 items-center space-x-4">
        {avatar}
        <div className="flex flex-col text-sm"></div>
      </div>
    </IdentityContext.Provider>
  );
}
