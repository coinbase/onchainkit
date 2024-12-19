/**
 * Limit the value to N decimal places
 */
export const truncateDecimalPlaces = (value: string, decimalPlaces: number) => {
    const decimalIndex = value.indexOf('.');
    let resultValue = value;
    if (decimalIndex !== -1 && value.length - decimalIndex - 1 > 2) {
      resultValue = value.substring(0, decimalIndex + decimalPlaces + 1);
    }
  
    return resultValue;
  };
