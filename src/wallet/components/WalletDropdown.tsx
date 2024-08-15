import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Identity } from '../../identity/components/Identity';
import { background, cn } from '../../styles/theme';
import { useBreakpoints } from '../../useBreakpoints';
import type { WalletDropdownReact } from '../types';
import { WalletBottomSheet } from './WalletBottomSheet';

export function WalletDropdown({ children, className }: WalletDropdownReact) {
  const breakpoint = useBreakpoints();
  const { address } = useAccount();

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
        background.default,
        'absolute right-0 z-10 mt-1 flex w-max min-w-[250px] flex-col overflow-hidden rounded-xl pb-2',
        className,
      )}
      data-testid="ockWalletDropdown"
    >
      {childrenArray}
    </div>
  );
}
