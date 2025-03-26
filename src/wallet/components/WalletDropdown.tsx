'use client';

import { Address, Avatar, EthBalance, Identity, Name } from '@/identity';
import { cn, color } from '@/styles/theme';
import type { WalletDropdownReact } from '../types';
import { WalletDropdownContent } from './WalletDropdownContent';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
import { WalletDropdownLink } from './WalletDropdownLink';
import { useWalletContext } from './WalletProvider';

const defaultWalletDropdownChildren = (
  <>
    <Identity className="px-4 pt-3 pb-2" key="wallet-dd-identity">
      <Avatar />
      <Name />
      <Address className={color.foregroundMuted} />
      <EthBalance />
    </Identity>
    <WalletDropdownLink
      icon="wallet"
      key="wallet-dd-link"
      href="https://keys.coinbase.com"
      target="_blank"
    >
      Wallet
    </WalletDropdownLink>
    <WalletDropdownDisconnect key="wallet-dd-disconnect" />
  </>
);

export function WalletDropdown({
  children,
  className,
  classNames,
  swappableTokens,
}: WalletDropdownReact) {
  const {
    address,
    breakpoint,
    isSubComponentOpen,
    showSubComponentAbove,
    alignSubComponentRight,
  } = useWalletContext();

  if (!address) {
    return null;
  }

  if (!breakpoint) {
    return null;
  }

  if (!isSubComponentOpen) {
    return null;
  }

  return (
    <div
      data-testid="ockWalletDropdown"
      className={cn(
        'absolute',
        showSubComponentAbove ? 'bottom-full' : 'top-full',
        alignSubComponentRight ? 'right-0' : 'left-0',
        className,
      )}
    >
      <WalletDropdownContent
        classNames={classNames}
        swappableTokens={swappableTokens}
      >
        {children || defaultWalletDropdownChildren}
      </WalletDropdownContent>
    </div>
  );
}
