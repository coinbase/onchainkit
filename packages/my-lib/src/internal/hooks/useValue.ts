import { useMemo } from 'react';

export function useValue<T>(object: T): T {
  return useMemo(() => object, [object]);
}
