export function hasMaxSlippage(
  statusData: any,
): statusData is { maxSlippage: number } {
  return statusData?.maxSlippage !== undefined;
}
