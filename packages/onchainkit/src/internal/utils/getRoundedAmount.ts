export function getRoundedAmount(balance: string, fractionDigits: number) {
  if (balance === '0') {
    return balance;
  }
  
  // Validate fractionDigits to prevent RangeError from toFixed
  if (fractionDigits < 0 || fractionDigits > 100) {
    return balance;
  }
  
  const parsedBalance = Number.parseFloat(balance);
  const result = Number(parsedBalance)
    ?.toFixed(fractionDigits)
    .replace(/\.?0+$/, '');

  // checking if balance is more than 0 but less than fractionDigits
  // without this prints "0."
  if (parsedBalance > 0 && Number.parseFloat(result) === 0) {
    return '0';
  }

  return result;
}
