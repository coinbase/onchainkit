export function getRoundedAmount(balance: string, fractionDigits: number) {
  const parsedBalance = Number.parseFloat(balance);
  const roundedBalance = Number(parsedBalance)
    ?.toFixed(fractionDigits)
    .replace(/0+$/, '');
  if (roundedBalance === '0.') {
    return '0';
  }
  return roundedBalance;
}
