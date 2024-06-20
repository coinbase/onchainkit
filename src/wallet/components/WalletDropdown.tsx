import { Children, useMemo } from 'react';
import { Identity } from '../../identity/components/Identity';
import type { WalletDropdownReact } from '../types';

export function WalletDropdown({ children }: WalletDropdownReact) {
  const { identity } = useMemo(() => {
    const childrenArray = Children.toArray(children);
    return {
      // @ts-ignore
      identity: childrenArray.filter(({ type }) => type === Identity),
    };
  }, [children]);

  return <div>{identity}</div>;
}
