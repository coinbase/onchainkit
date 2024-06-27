import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useAccount } from 'wagmi';
import type { WalletDropdownReact } from '../types';
import { useWalletContext } from './WalletProvider';
import { background, cn } from '../../styles/theme';
import { Identity } from '../../identity/components/Identity';

export function WalletDropdown({ children, className }: WalletDropdownReact) {
  const { isOpen } = useWalletContext();

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

  if (!isOpen || !address) {
    return null;
  }

  return (
    <div
      className={cn(
        background.default,
        'absolute right-0 z-10 mt-1 flex w-max min-w-[250px] flex-col overflow-hidden rounded-xl pb-2',
        className,
      )}
    >
      {childrenArray}
    </div>
  );
}
