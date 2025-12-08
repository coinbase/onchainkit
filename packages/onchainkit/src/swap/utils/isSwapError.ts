import type { SwapError } from '../types';

export function isSwapError(response: unknown): response is SwapError {
  return (
    response !== null && typeof response === 'object' && 'error' in response
  );
}
