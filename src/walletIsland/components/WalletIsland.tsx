import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { useAccount } from 'wagmi';
import Draggable from '../../internal/components/Draggable';
import { background, border, cn, line } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import type { WalletIslandProps } from '../types';
import { Identity } from '../../identity';

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
          line.default,
          'w-[360px] h-auto',
          'flex items-center justify-center',
        )}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'w-80 h-auto',
            'm-4',
          )}
        >
          {childrenArray}
        </div>
      </div>
    </Draggable>
  );
}
