import { fromReadableAmount } from './fromReadableAmount';
import { toReadableAmount } from './toReadableAmount';

/**
 * Formats an amount according to the decimals. Defaults to 18 decimals for ERC-20s.
 */
export function formatDecimals(
  amount: string,
  inputInDecimals = true,
  decimals = 18,
): string {
  let result: string;

  if (inputInDecimals) {
    // If input is already in decimals, convert to readable amount
    result = toReadableAmount(amount, decimals);
  } else {
    // If input is not in decimals, convert from readable amount
    result = fromReadableAmount(amount, decimals);
  }

  return result;
}
