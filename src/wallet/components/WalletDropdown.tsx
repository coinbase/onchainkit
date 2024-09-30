import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Identity } from '../../identity/components/Identity';
import { cn, pressable } from '../../styles/theme';
import { useBreakpoints } from '../../useBreakpoints';
import type { WalletDropdownReact } from '../types';
import { WalletBottomSheet } from './WalletBottomSheet';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
import { WalletDropdownFundLink } from './WalletDropdownFundLink';
import { WalletDropdownLink } from './WalletDropdownLink';
import { WalletDropdownBasename } from './WalletDropdownBasename';

const DEFAULT_CHILDREN = [
  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick={true} key="identity" />,
  <WalletDropdownBasename key="basename" />,
  <WalletDropdownLink
    key="dropdownlink"
    icon="wallet"
    href="https://keys.coinbase.com"
    target="_blank"
  >
    Wallet
  </WalletDropdownLink>,
  <WalletDropdownFundLink key="fund" />,
  <WalletDropdownDisconnect key="disconnect" />
];

export function WalletDropdown({ children = DEFAULT_CHILDREN, className }: WalletDropdownReact) {
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
        pressable.default,
        'absolute right-0 z-10 mt-1 flex w-max min-w-[250px] flex-col overflow-hidden rounded-xl',
        className,
      )}
      data-testid="ockWalletDropdown"
    >
      {childrenArray}
    </div>
  );
}
