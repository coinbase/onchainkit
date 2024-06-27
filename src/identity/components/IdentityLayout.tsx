import {
  Children,
  useMemo,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { Address } from './Address';
import { background, cn, color } from '../../styles/theme';
import { EthBalance } from './EthBalance';

function findComponent<T>(component: React.ComponentType<T>) {
  return (child: ReactNode): child is ReactElement<T> => {
    return isValidElement(child) && child.type === component;
  };
}

type IdentityLayoutReact = {
  children: ReactNode;
  className?: string;
};

export function IdentityLayout({ children, className }: IdentityLayoutReact) {
  const { avatar, name, address, ethBalance } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      avatar: childrenArray.find(findComponent(Avatar)),
      name: childrenArray.find(findComponent(Name)),
      address: childrenArray.find(findComponent(Address)),
      ethBalance: childrenArray.find(findComponent(EthBalance)),
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
        {address && !ethBalance && address}
        {!address && ethBalance && ethBalance}
        {address && ethBalance && (
          <div className="flex items-center gap-1">
            {address}
            <span className={color.foregroundMuted}>·</span>
            {ethBalance}
          </div>
        )}
      </div>
    </div>
  );
}
