export function formatAmount(num: string): string {
  // If the number is not in scientific notation return it as it is
  if (!/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    return num;
  }

  // Parse into coefficient and exponent
  const [coefficient, exponent] = num.toLowerCase().split('e');
  const exp = Number.parseInt(exponent);

  // Split coefficient into integer and decimal parts
  const [intPart, decPart = ''] = coefficient.split('.');

  // Combine integer and decimal parts
  const fullNumber = intPart + decPart;

  // Calculate the new decimal point position
  const newPosition = intPart.length + exp;

  if (newPosition <= 0) {
    // If the new position is less than or equal to 0, we need to add leading zeros
    return `0.${'0'.repeat(Math.abs(newPosition))}${fullNumber}`;
  }

  if (newPosition >= fullNumber.length) {
    // If the new position is greater than the number length, we need to add trailing zeros
    return fullNumber + '0'.repeat(newPosition - fullNumber.length);
  }

  // Otherwise, we insert the decimal point at the new position
  return `${fullNumber.slice(0, newPosition)}.${fullNumber.slice(newPosition)}`;
}
