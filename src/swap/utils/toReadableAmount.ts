export function toReadableAmount(amount: string, decimals: number): string {
  const bigIntAmount = BigInt(amount);
  const divisor = 10n ** BigInt(decimals);
  const wholePart = (bigIntAmount / divisor).toString();
  const fractionalPart = (bigIntAmount % divisor)
    .toString()
    .padStart(decimals, '0');
  const trimmedFractionalPart = fractionalPart.replace(/0+$/, '');
  return trimmedFractionalPart
    ? `${wholePart}.${trimmedFractionalPart}`
    : wholePart;
}
