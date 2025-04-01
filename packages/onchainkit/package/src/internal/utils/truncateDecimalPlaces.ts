/**
 * Limit the value to N decimal places
 */
export const truncateDecimalPlaces = (
  value: string | number,
  decimalPlaces: number,
) => {
  const stringValue = String(value);
  const decimalIndex = stringValue.indexOf('.');
  let resultValue = stringValue;

  if (
    decimalIndex !== -1 &&
    stringValue.length - decimalIndex - 1 > decimalPlaces
  ) {
    resultValue = stringValue.substring(0, decimalIndex + decimalPlaces + 1);
  }

  return resultValue;
};
