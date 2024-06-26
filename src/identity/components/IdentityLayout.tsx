import { Children, useMemo, ReactNode } from 'react';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { Address } from './Address';
import { background, cn } from '../../styles/theme';

type IdentityLayoutReact = {
  children: ReactNode;
  className?: string;
};

export function IdentityLayout({ children, className }: IdentityLayoutReact) {
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
    <div
      className={cn(
        background.default,
        'flex items-center space-x-4 px-2 py-1',
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
  );
}
