import type { SwapError } from './types';

// checks that input is a number
export function isValidAmount(value: string) {
  if (value.length > 11) {
    return false;
  }
  if (value === '') {
    return true;
  }
  const regex = /^[0-9]*\.?[0-9]*$/;
  return regex.test(value);
}

export function isSwapError(response: unknown): response is SwapError {
  return (
    response !== null && typeof response === 'object' && 'error' in response
  );
}
