import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Identity } from '../../identity/components/Identity';
import { background, cn } from '../../styles/theme';
import type { WalletBottomSheetReact } from '../types';
import { useWalletContext } from './WalletProvider';

export function WalletBottomSheet({
  children,
  className,
}: WalletBottomSheetReact) {
  const { isOpen, setIsOpen } = useWalletContext();
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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setIsOpen(false)} // Close drawer on overlay click
        />
      )}
      <div
        className={cn(
          background.default,
          'fixed bottom-0 left-0 right-0 z-50',
          'rounded-[20px_20px_0_0] p-4 transform transition-transform',
          `${isOpen ? 'translate-y-0' : 'translate-y-full'}`,
          className,
        )}
      >
        {childrenArray}
      </div>
    </>
  );
}
