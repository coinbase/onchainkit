export function formatTokenAmount(amount: string, decimals: number) {
  // Convert the string amount to a number using decimals value
  const numberAmount = Number(amount) / 10 ** decimals;
  
  // Use toFixed to avoid scientific notation for small numbers
  // Then remove trailing zeros
  if (numberAmount < 1 && numberAmount > 0) {
    return numberAmount.toFixed(decimals).replace(/\.?0+$/, '');
  }
  
  return numberAmount.toString();
}
