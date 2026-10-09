const BASE_CHAIN_IDS = [base.id, baseSepolia.id];

export function isBase({
  chainId,
  isMainnetOnly = false,
}: IsBaseParams): boolean {
  if (isMainnetOnly) {
    return chainId === base.id;
  }

  return BASE_CHAIN_IDS.includes(chainId);
}
