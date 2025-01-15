/**
 * Ensure the decimal value is formatted correctly (i.e. "0.1" instead of ".1" and "0.1" instead of "01")
 */
export const formatDecimalInputValue = (value: string) => {
  let resultValue = value;
  // Add a leading zero if the value starts with a zero and is not a decimal. (i.e. "01" -> "0.1")
  if (
    resultValue.length === 2 &&
    resultValue[0] === '0' &&
    resultValue[1] !== '.'
  ) {
    resultValue = `${resultValue[0]}.${resultValue[1]}`;
  }

  return resultValue;
};
