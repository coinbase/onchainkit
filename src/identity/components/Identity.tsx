import { Children, useMemo } from 'react';
import { IdentityContext } from '../context';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { Address } from './Address';
import type { IdentityReact } from '../types';
import { background, cn } from '../../styles/theme';

export function Identity({
  address,
  children,
  className,
  schemaId,
}: IdentityReact) {
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
        className={cn(
          background.default,
          'flex h-14 items-center space-x-4 px-2 py-1',
          className,
        )}
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
