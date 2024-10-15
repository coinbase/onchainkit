export const formatAmount = (num: string) => {
  if (num.includes('e')) {
    const parts = num.split('e');
    const base = parts[0].replace('.', '');
    const exponent = Number.parseInt(parts[1]);

    if (exponent >= 0) {
      return base.padEnd(base.length + exponent, '0');
    } else {
      const absExponent = Math.abs(exponent);
      return '0.' + '0'.repeat(absExponent - 1) + base.replace('.', '');
    }
  }

  return num;
};
