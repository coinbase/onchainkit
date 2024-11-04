/**
 * checks that input is a number
 */
function isValidAmount(value) {
  if (value === '') {
    return true;
  }
  const regex = /^[0-9]*\.?[0-9]*$/;
  return regex.test(value);
}
export { isValidAmount };
//# sourceMappingURL=isValidAmount.js.map
