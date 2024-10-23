export function multiplyFloats(...numbers: number[]) {
  // Convert all numbers to strings and count decimal places
  const decimalPlaces: number[] = numbers.map((num) => {
    const str: string = num.toString();
    const decimal: number = str.indexOf('.');
    return decimal === -1 ? 0 : str.length - decimal - 1;
  });

  // Calculate the multiplier needed to convert to integers
  const multiplier: number =
    10 ** decimalPlaces.reduce((sum, places) => sum + places, 0);

  // Convert to integers, multiply, then convert back
  const result: number =
    numbers.reduce((acc, num) => {
      // Convert to integer by multiplying by appropriate power of 10
      const factor: number = 10 ** decimalPlaces[numbers.indexOf(num)];
      return acc * (num * factor);
    }, 1) / multiplier;

  return result;
}
