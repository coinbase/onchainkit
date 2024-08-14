import { useAccount } from 'wagmi';
import useBreakpoints from '../../useBreakpoints';
import type { WalletMenuReact } from '../types';
import { WalletBottomSheet } from './WalletBottomSheet';
import { WalletDropdown } from './WalletDropdown';

export function WalletMenu({ children, className }: WalletMenuReact) {
  const breakpoint = useBreakpoints();
  const { address } = useAccount();
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

  return <WalletDropdown className={className}>{children}</WalletDropdown>;
}
