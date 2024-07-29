import { Children, useMemo } from 'react';
import type { ReactNode } from 'react';
import { findComponent } from '../../internal/utils/findComponent';
import { background, cn, color, pressable } from '../../styles/theme';
import { usePopover } from '../hooks/usePopover';
import { Address } from './Address';
import { Avatar } from './Avatar';
import { EthBalance } from './EthBalance';
import { Name } from './Name';

// istanbul ignore next
const noop = () => {};

type IdentityLayoutReact = {
  children: ReactNode;
  className?: string;
  onClick?: () => Promise<boolean>;
};

export function IdentityLayout({
  children,
  className,
  onClick,
}: IdentityLayoutReact) {
  const { avatar, name, address, ethBalance } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      avatar: childrenArray.find(findComponent(Avatar)),
      name: childrenArray.find(findComponent(Name)),
      address: childrenArray.find(findComponent(Address)),
      ethBalance: childrenArray.find(findComponent(EthBalance)),
    };
  }, [children]);

  const {
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    showPopover,
    popoverText,
  } = usePopover(onClick);

  return (
    <div
      className={cn(
        background.default,
        'flex items-center space-x-4 px-2 py-1',
        onClick && `${pressable.default} relative`,
        className,
      )}
      data-testid="ockIdentityLayout_container"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyUp={noop}
      onKeyDown={noop}
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
      {showPopover && (
        <div
          className={cn(
            background.inverse,
            color.foreground,
            'absolute top-[calc(100%_-_5px)] left-[46px] z-10 rounded px-2 py-1 shadow-[0px_4px_8px_rgba(0,0,0,0.1)]',
          )}
          data-testid="ockIdentityLayout_copy"
        >
          {popoverText}
          <div
            className={cn(
              'absolute top-[-5px] left-6 h-0 w-0',
              'border-x-[5px] border-x-transparent border-b-[5px] border-b-[color:var(--bg-ock-inverse)] border-solid',
            )}
            data-testid="ockIdentityLayout_copyArrow"
          />
        </div>
      )}
    </div>
  );
}
