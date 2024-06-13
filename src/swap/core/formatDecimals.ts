/**
 * Formats an amount according to the decimals. Defaults to 18 decimals for ERC-20s.
 */
export function formatDecimals(
  amount: string,
  inputInDecimals = true,
  decimals = 18,
): string {
  if (inputInDecimals) {
    return (Number(amount) / 10 ** decimals).toString();
  }
  return (Number(amount) * 10 ** decimals).toString();
}
