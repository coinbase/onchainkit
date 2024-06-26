import { useAccount } from 'wagmi';
import { IdentityProvider } from '../../identity/components/IdentityProvider';
import type { WalletDropdownReact } from '../types';
import { useWalletContext } from './WalletProvider';
import { background, cn } from '../../styles/theme';

export function WalletDropdown({ children }: WalletDropdownReact) {
  const { isOpen } = useWalletContext();

  const { address } = useAccount();

  if (!isOpen || !address) {
    return null;
  }

  return (
    <IdentityProvider address={address}>
      <div
        className={cn(
          background.default,
          'absolute right-0 z-10 mt-1 flex w-max min-w-[250px] flex-col overflow-hidden rounded-xl pb-2',
        )}
      >
        {children}
      </div>
    </IdentityProvider>
  );
}
