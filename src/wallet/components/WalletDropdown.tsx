import { useAccount } from 'wagmi';
import type { WalletDropdownReact } from '../types';
import { useWalletContext } from './WalletProvider';
import { background, cn } from '../../styles/theme';
import { Children, cloneElement, useMemo } from 'react';
import { Identity } from '../../identity';

export function WalletDropdown({ children }: WalletDropdownReact) {
  const { isOpen } = useWalletContext();

  const { address } = useAccount();

  const childrenArray = useMemo(() => {
    return Children.toArray(children).map((component) => {
      // @ts-ignore
      if (component.type === Identity) {
        // @ts-ignore
        return cloneElement(component, { address });
      }
      return component;
    });
  }, [children]);

  if (!isOpen || !address) {
    return null;
  }

  return (
    <div
      className={cn(
        background.default,
        'absolute right-0 z-10 mt-1 flex w-max min-w-[250px] flex-col overflow-hidden rounded-xl pb-2',
      )}
    >
      {childrenArray}
    </div>
  );
}
