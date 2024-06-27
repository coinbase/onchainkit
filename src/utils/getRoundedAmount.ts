export function getRoundedAmount(balance: string, fractionDigits: number) {
  if (balance === '0') {
    return balance;
  }
  const parsedBalance = Number.parseFloat(balance);
  const result = Number(parsedBalance)
    ?.toFixed(fractionDigits)
    .replace(/0+$/, '');

  if (parsedBalance > 0 && Number.parseFloat(result) === 0) {
    return '0';
  }

  return result;
}
