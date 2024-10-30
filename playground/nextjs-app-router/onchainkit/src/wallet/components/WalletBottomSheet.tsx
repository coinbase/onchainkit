import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
} from 'react';
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

  const handleOverlayClick = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const handleEscKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [setIsOpen],
  );

  if (!address) {
    return null;
  }

  return (
    <>
      {isOpen && (
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
          `${isOpen ? 'translate-y-0' : 'translate-y-full'}`,
          className,
        )}
        data-testid="ockWalletBottomSheet"
      >
        {childrenArray}
      </div>
    </>
  );
}
