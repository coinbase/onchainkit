import { useTheme } from '@/internal/hooks/useTheme';
import { findComponent } from '@/internal/utils/findComponent';
import { background, cn, color } from '@/styles/theme';
import { Children, cloneElement, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Address } from './Address';
import { Avatar } from './Avatar';
import { EthBalance } from './EthBalance';
import { Name } from './Name';
import { Socials } from './Socials';

type IdentityLayoutReact = {
  children: ReactNode;
  className?: string;
  hasCopyAddressOnClick?: boolean;
};

export function IdentityLayout({
  children,
  className,
  hasCopyAddressOnClick,
}: IdentityLayoutReact) {
  const componentTheme = useTheme();

  const {
    avatar,
    name,
    address: addressComponent,
    ethBalance,
    socials,
  } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    const addressElement = childrenArray.find(findComponent(Address));
    return {
      avatar: childrenArray.find(findComponent(Avatar)),
      name: childrenArray.find(findComponent(Name)),
      address: addressElement
        ? cloneElement(addressElement, { hasCopyAddressOnClick })
        : undefined,
      ethBalance: childrenArray.find(findComponent(EthBalance)),
      socials: childrenArray.find(findComponent(Socials)),
    } as const;
  }, [children, hasCopyAddressOnClick]);

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
          {addressComponent && !ethBalance && addressComponent}
          {!addressComponent && ethBalance && ethBalance}
          {addressComponent && ethBalance && (
            <div className="flex items-center gap-1">
              {addressComponent}
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
