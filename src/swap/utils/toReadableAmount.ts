import JSBI from 'jsbi';

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
