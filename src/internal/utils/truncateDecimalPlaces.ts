/**
 * Limit the value to N decimal places
 */
export const truncateDecimalPlaces = (
  value: string | number,
  decimalPlaces: number,
) => {
  if (value === '' || value === '.') {
    return value;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
    useGrouping: false,
  }).format(Number(value));
};
