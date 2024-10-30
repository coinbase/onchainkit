export function formatTokenAmount(amount: string, decimals: number) {
  // Convert the string amount to a number using decimals value
  const numberAmount = Number(amount) / 10 ** decimals;
  return numberAmount.toString();
}
