export function getRoundedAmount(balance: string, fractionDigits: number) {
  const parsedBalance = Number.parseFloat(balance);
  return Number(parsedBalance)?.toFixed(fractionDigits).replace(/0+$/, '');
}
