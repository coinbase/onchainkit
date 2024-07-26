import JSBI from 'jsbi';

/**
 * Formats an amount according to the decimals. Defaults to 18 decimals for ERC-20s.
 */
export function formatDecimals(
  amount: string,
  inputInDecimals = true,
  decimals = 18,
): string {
  // Input validation
  if (typeof amount !== 'string' || amount.trim() === '') {
    throw new Error('Invalid input: amount must be a non-empty string');
  }
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new Error('Invalid input: decimals must be a non-negative integer');
  }
  if (!/^-?\d*\.?\d+$/.test(amount)) {
    throw new Error('Invalid input: amount must be a valid number string');
  }

  let result: string;

  if (inputInDecimals) {
    // If input is already in decimals, convert to readable amount
    result = toReadableAmount(amount, decimals);
  } else {
    // If input is not in decimals, convert from readable amount
    result = fromReadableAmount(amount, decimals);
  }

  return result;
}

export function fromReadableAmount(amount: string, decimals: number): string {
  const [wholePart, fractionalPart = ''] = amount.split('.');
  const paddedFractionalPart = fractionalPart.padEnd(decimals, '0');
  const trimmedFractionalPart = paddedFractionalPart.slice(0, decimals);
  return JSBI.multiply(
    JSBI.BigInt(wholePart + trimmedFractionalPart),
    JSBI.exponentiate(
      JSBI.BigInt(10),
      JSBI.BigInt(decimals - trimmedFractionalPart.length),
    ),
  ).toString();
}

export function toReadableAmount(amount: string, decimals: number): string {
  const bigIntAmount = JSBI.BigInt(amount);
  const divisor = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals));
  const wholePart = JSBI.divide(bigIntAmount, divisor).toString();
  const fractionalPart = JSBI.remainder(bigIntAmount, divisor)
    .toString()
    .padStart(decimals, '0');
  const trimmedFractionalPart = fractionalPart.replace(/0+$/, '');
  return trimmedFractionalPart
    ? `${wholePart}.${trimmedFractionalPart}`
    : wholePart;
}
