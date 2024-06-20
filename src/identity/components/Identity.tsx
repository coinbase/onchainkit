import { Children, useMemo } from 'react';
import { IdentityContext } from '../context';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { Address } from './Address';
import type { IdentityReact } from '../types';

export function Identity({ address, children, schemaId }: IdentityReact) {
  const value = useMemo(() => {
    return {
      address,
      schemaId,
    };
  }, [address, schemaId]);

  const { avatar, name, addressComponent } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      avatar: childrenArray.find(({ type }) => type === Avatar),
      // @ts-ignore
      name: childrenArray.find(({ type }) => type === Name),
      // @ts-ignore
      addressComponent: childrenArray.find(({ type }) => type === Address),
    };
  }, [children]);

  return (
    <IdentityContext.Provider value={value}>
      <div
        className="flex h-14 items-center space-x-4 bg-white px-2 py-1"
        data-testid="ockIdentity_container"
      >
        {avatar}
        <div className="flex flex-col">
          {name}
          {addressComponent}
        </div>
      </div>
    </IdentityContext.Provider>
  );
}
