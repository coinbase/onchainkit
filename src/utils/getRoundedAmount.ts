export function getRoundedAmount(balance: string, fractionDigits: number) {
  if (balance === '0') {
    return balance;
  }
  const parsedBalance = Number.parseFloat(balance);
  return Number(parsedBalance)?.toFixed(fractionDigits).replace(/0+$/, '');
}
