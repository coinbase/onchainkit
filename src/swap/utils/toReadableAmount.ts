export function toReadableAmount(amount: string, decimals: number): string {
  // Remove any leading/trailing whitespace
  amount = amount.trim();

  // Check if the amount contains a decimal point
  if (amount.includes('.')) {
    const [wholePart, fractionalPart] = amount.split('.');
    const paddedFractionalPart = fractionalPart.padEnd(decimals, '0');
    const combinedAmount = wholePart + paddedFractionalPart;
    return combinedAmount.replace(/^0+/, '') || '0'; // Remove leading zeros, but keep at least one digit
  }

  // If no decimal point, proceed with the original logic
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
