import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Identity } from '../../../identity';
import Draggable from '../../../internal/components/Draggable';
import { background, border, cn } from '../../../styles/theme';
import { useTheme } from '../../../useTheme';
import type { WalletIslandProps } from '../../types';

export function WalletIsland({ children }: WalletIslandProps) {
  const componentTheme = useTheme();
  const { address } = useAccount();

  const childrenArray = useMemo(() => {
    return Children.toArray(children).map((child) => {
      if (isValidElement(child) && child.type === Identity) {
        return cloneElement(child, { ...child.props, address });
      }
      return child;
    });
  }, [children, address]);

  return (
    <Draggable gridSize={25}>
      <div
        className={cn(
          componentTheme,
          background.default,
          border.radius,
          border.lineDefault,
          'h-auto w-96',
          'flex items-center justify-center',
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'h-auto w-96',
            'm-4',
          )}
        >
          {childrenArray}
        </div>
      </div>
    </Draggable>
  );
}
