import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { cn, color, pressable } from '../../styles/theme';
import { Identity } from '../../ui/react/identity/components/Identity';
import { useBreakpoints } from '../../ui/react/internal/hooks/useBreakpoints';
import type { WalletDropdownReact } from '../types';
import { WalletBottomSheet } from './WalletBottomSheet';
import { useWalletContext } from './WalletProvider';

export function WalletDropdown({ children, className }: WalletDropdownReact) {
  const breakpoint = useBreakpoints();
  const { address } = useAccount();
  const { isClosing } = useWalletContext();

  const childrenArray = useMemo(() => {
    return Children.toArray(children).map((child) => {
      if (isValidElement(child) && child.type === Identity) {
        // @ts-ignore
        return cloneElement(child, { address });
      }
      return child;
    });
  }, [children, address]);

  if (!address) {
    return null;
  }

  if (!breakpoint) {
    return null;
  }

  if (breakpoint === 'sm') {
    return (
      <WalletBottomSheet className={className}>{children}</WalletBottomSheet>
    );
  }

  return (
    <div
      className={cn(
        pressable.default,
        color.foreground,
        'absolute right-0 z-10 mt-1 flex w-max min-w-[300px] cursor-default flex-col overflow-hidden rounded-xl',
        isClosing
          ? 'fade-out slide-out-to-top-2.5 animate-out duration-300 ease-in'
          : 'fade-in slide-in-from-top-2.5 animate-in duration-300 ease-out',
        className,
      )}
      data-testid="ockWalletDropdown"
    >
      {childrenArray}
    </div>
  );
}
