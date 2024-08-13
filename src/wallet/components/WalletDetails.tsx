import { useAccount } from 'wagmi';
import useBreakpoints from '../../useBreakpoints';
import { WalletDropdownReact } from '../types';
import { WalletDropdown } from './WalletDropdown';
import { WalletBottomSheet } from './WalletBottomSheet';

export function WalletDetails({ children }: WalletDropdownReact) {
  const breakpoint = useBreakpoints();
  const { address } = useAccount();
  if (!address) {
    return null;
  }

  if (!breakpoint) {
    return null;
  }

  if (breakpoint === 'sm') {
    return <WalletBottomSheet>{children}</WalletBottomSheet>;
  }

  return <WalletDropdown>{children}</WalletDropdown>;
}
