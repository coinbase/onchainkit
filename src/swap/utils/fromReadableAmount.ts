import JSBI from 'jsbi';

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
