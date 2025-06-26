'use client';

import { Address, Avatar, EthBalance, Identity, Name } from '@/identity';
import { cn } from '@/styles/theme';
import type { WalletDropdownReact } from '../types';
import { WalletDropdownContent } from './WalletDropdownContent';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
import { WalletDropdownLink } from './WalletDropdownLink';
import { useWalletContext } from './WalletProvider';
import { LayerConfigProvider } from '@/internal/components/LayerConfigProvider';

const defaultWalletDropdownChildren = (
  <>
    <Identity className="px-4 pt-3 pb-2" key="wallet-dd-identity">
      <Avatar />
      <Name />
      <Address className={'text-ock-foreground-muted'} />
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
  const { address, breakpoint, showSubComponentAbove, alignSubComponentRight } =
    useWalletContext();

  if (!address) {
    return null;
  }

  if (!breakpoint) {
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
      <LayerConfigProvider skipPopoverPortal>
        <WalletDropdownContent
          classNames={classNames}
          swappableTokens={swappableTokens}
        >
          {children || defaultWalletDropdownChildren}
        </WalletDropdownContent>
      </LayerConfigProvider>
    </div>
  );
}
