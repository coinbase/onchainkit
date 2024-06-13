import type { SwapError } from './types';

// checks that input is a number
export function isValidAmount(value: string) {
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

export function formatTokenAmount(amount: string, decimals: number) {
  // Convert the string amount to a number using decimals value
  const numberAmount = Number(amount) / 10 ** decimals;
  return numberAmount.toString();
}

export function getRoundedAmount(balance: string, fractionDigits: number) {
  const parsedBalance = Number.parseFloat(balance);
  return Number(parsedBalance)?.toFixed(fractionDigits).replace(/0+$/, '');
}
