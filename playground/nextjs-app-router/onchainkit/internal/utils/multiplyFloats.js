function multiplyFloats(...numbers) {
  if (numbers.length === 1) {
    return numbers[0];
  }

  // multiply ints and count decimals
  const _numbers$reduce = numbers.reduce((acc, num) => {
      const str = num.toString();
      const currentDecimalPlaces = (str.split('.')[1] || '').length;
      const integer = Number(str.replace('.', ''));
      return {
        result: acc.result * integer,
        decimalPlaces: acc.decimalPlaces + currentDecimalPlaces
      };
    }, {
      result: 1,
      decimalPlaces: 0
    }),
    result = _numbers$reduce.result,
    decimalPlaces = _numbers$reduce.decimalPlaces;

  // convert back to float with correct decimal places
  return result / 10 ** decimalPlaces;
}
export { multiplyFloats };
//# sourceMappingURL=multiplyFloats.js.map
