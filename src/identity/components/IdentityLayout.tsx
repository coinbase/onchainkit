import {
  Children,
  useMemo,
  type ReactNode,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { Avatar } from './Avatar';
import { Name } from './Name';
import { Address } from './Address';
import { background, cn, color, pressable } from '../../styles/theme';
import { EthBalance } from './EthBalance';
import { findComponent } from '../../internal/utils/findComponent';

// istanbul ignore next
const noop = () => {};

export function usePopover(onClick?: () => Promise<boolean>) {
  const [popoverText, setPopoverText] = useState('Copy');
  const [showPopover, setShowPopover] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setPopoverText('Copy');
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowPopover(false);
  }, []);

  const handleClick = useCallback(async () => {
    if (onClick) {
      const result = await onClick();
      if (result) {
        setPopoverText('Copied');
        // istanbul ignore next
        setTimeout(() => {
          setShowPopover(false);
        }, 1000);
      }
    }
  }, [onClick]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isHovered) {
      timer = setTimeout(() => setShowPopover(true), 200);
    } else {
      setShowPopover(false);
    }

    return () => clearTimeout(timer);
  }, [isHovered]);

  if (!onClick) return {};

  return {
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    showPopover,
    popoverText,
  };
}

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
      data-testid="ockIdentity_container"
      className={cn(
        background.default,
        'flex items-center space-x-4 px-2 py-1',
        onClick && `${pressable.default} relative`,
        className,
      )}
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
          className={cn(background.inverse, color.foreground, 'absolute z-10')}
          style={{
            top: 'calc(100% - 5px)',
            left: '46px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
            padding: '5px 10px',
          }}
        >
          {popoverText}
          <div
            style={{
              position: 'absolute',
              top: '-5px',
              left: '24px',
              width: '0',
              height: '0',
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '5px solid var(--bg-inverse)',
            }}
          />
        </div>
      )}
    </div>
  );
}
