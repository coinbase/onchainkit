'use client';

import { Identity } from '@/identity/components/Identity';
import { background, cn } from '@/styles/theme';
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
} from 'react';
import type { WalletBottomSheetReact } from '../types';
import { useWalletContext } from './WalletProvider';

export function WalletBottomSheet({
  children,
  className,
}: WalletBottomSheetReact) {
  const { address, isSubComponentOpen, setIsSubComponentOpen } =
    useWalletContext();

  const childrenArray = useMemo(() => {
    return Children.toArray(children).map((child) => {
      if (isValidElement(child) && child.type === Identity) {
        // @ts-expect-error - Testing undefined address case
        return cloneElement(child, { address });
      }
      return child;
    });
  }, [children, address]);

  const handleOverlayClick = useCallback(() => {
    setIsSubComponentOpen(false);
  }, [setIsSubComponentOpen]);

  const handleEscKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        setIsSubComponentOpen(false);
      }
    },
    [setIsSubComponentOpen],
  );

  if (!address) {
    return null;
  }

  return (
    <>
      {isSubComponentOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={handleOverlayClick}
          onKeyDown={handleEscKeyPress}
          role="button"
          tabIndex={0}
        />
      )}
      <div
        className={cn(
          background.default,
          'fixed right-0 bottom-0 left-0 z-50',
          'transform rounded-[20px_20px_0_0] p-4 transition-transform',
          `${isSubComponentOpen ? 'translate-y-0' : 'translate-y-full'}`,
          className,
        )}
        data-testid="ockWalletBottomSheet"
      >
        {childrenArray}
      </div>
    </>
  );
}
