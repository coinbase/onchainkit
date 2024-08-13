import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Identity } from '../../identity/components/Identity';
import { background, cn } from '../../styles/theme';
import type { WalletDropdownReact } from '../types';

export function WalletBottomSheet({
  children,
  className,
}: WalletDropdownReact) {
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

  console.log({ address });

  if (!address) {
    return null;
  }

  return (
    <div
      className={cn(
        background.default,
        'fixed bottom-0 right-0 w-64 rounded-lg shadow-lg p-4 w-full z-10',
        className,
      )}
    >
      {childrenArray}
    </div>
  );
}
