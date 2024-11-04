import { fromReadableAmount } from './fromReadableAmount.js';
import { toReadableAmount } from './toReadableAmount.js';

/**
 * Formats an amount according to the decimals. Defaults to 18 decimals for ERC-20s.
 */
function formatDecimals(amount, inputInDecimals = true, decimals = 18) {
  let result;
  if (inputInDecimals) {
    // If input is already in decimals, convert to readable amount
    result = toReadableAmount(amount, decimals);
  } else {
    // If input is not in decimals, convert from readable amount
    result = fromReadableAmount(amount, decimals);
  }
  return result;
}
export { formatDecimals };
//# sourceMappingURL=formatDecimals.js.map
