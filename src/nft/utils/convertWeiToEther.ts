const WEI_IN_ETHER = 1e18;

export function convertWeiToEther(wei: string): number {
  return Number.parseFloat(wei) / WEI_IN_ETHER;
}
