export function fromReadableAmount(amount: string, decimals: number): string {
  const [wholePart, fractionalPart = ''] = amount.split('.');
  const paddedFractionalPart = fractionalPart.padEnd(decimals, '0');
  const trimmedFractionalPart = paddedFractionalPart.slice(0, decimals);
  return (
    BigInt(wholePart + trimmedFractionalPart) *
    BigInt(10) ** BigInt(decimals - trimmedFractionalPart.length)
  ).toString();
}
