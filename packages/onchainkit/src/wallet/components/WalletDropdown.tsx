'use client';

import { Address, Avatar, EthBalance, Identity, Name } from '@/identity';
import { cn } from '@/styles/theme';
import type {
  WalletAdvancedQrReceiveProps,
  WalletAdvancedSwapProps,
} from '../types';
import { WalletDropdownContent } from './WalletDropdownContent';
import { WalletDropdownDisconnect } from './WalletDropdownDisconnect';
import { WalletDropdownLink } from './WalletDropdownLink';
import { useWalletContext } from './WalletProvider';
import { useAccount } from 'wagmi';
import { LayerConfigProvider } from '@/internal/components/LayerConfigProvider';
import { Token } from '@/token';

export type WalletDropdownProps = {
  children?: React.ReactNode;
  /** Optional className override for top div element */
  className?: string;
  classNames?: {
    container?: string;
    qr?: WalletAdvancedQrReceiveProps['classNames'];
    swap?: WalletAdvancedSwapProps['classNames'];
  };
  swappableTokens?: Token[];
};

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
}: WalletDropdownProps) {
  const {
    breakpoint,
    isSubComponentOpen,
    showSubComponentAbove,
    alignSubComponentRight,
  } = useWalletContext();
  const { address } = useAccount();

  if (!address || !breakpoint || !isSubComponentOpen) {
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
