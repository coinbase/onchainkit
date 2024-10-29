import { Children, useMemo } from 'react';
import type { ReactNode } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import { background, cn, color } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import { Address } from './Address';
import { Avatar } from './Avatar';
import { EthBalance } from './EthBalance';
import { Name } from './Name';
import { Socials } from './Socials';

type IdentityLayoutReact = {
  children: ReactNode;
  className?: string;
};

export function IdentityLayout({ children, className }: IdentityLayoutReact) {
  const componentTheme = useTheme();

  const { avatar, name, address, ethBalance, socials } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      avatar: childrenArray.find(findComponent(Avatar)),
      name: childrenArray.find(findComponent(Name)),
      address: childrenArray.find(findComponent(Address)),
      ethBalance: childrenArray.find(findComponent(EthBalance)),
      socials: childrenArray.find(findComponent(Socials)),
    };
  }, [children]);

  return (
    <div
      className={cn(
        componentTheme,
        background.default,
        'flex flex-col px-4 py-1',
        className,
      )}
      data-testid="ockIdentityLayout_container"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">{avatar}</div>
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
      {socials}
    </div>
  );
}
