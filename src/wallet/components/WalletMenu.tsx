import { useAccount } from 'wagmi';
import useBreakpoints from '../../useBreakpoints';
import { WalletMenuReact } from '../types';
import { WalletDropdown } from './WalletDropdown';
import { WalletBottomSheet } from './WalletBottomSheet';

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
