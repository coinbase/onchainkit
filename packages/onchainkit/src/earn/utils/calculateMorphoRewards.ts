import type { MorphoVaultApiResponse } from '@/earn/utils/fetchMorphoApy';

/**
 * Morpho rewards are the difference between total APY and APY from native + other token rewards
 */
export default function calculateMorphoRewards(
  data: MorphoVaultApiResponse['data']['vaultByAddress']['state'],
) {
  const nativeApy = data.netApyWithoutRewards;
  const otherRewards = data.rewards.reduce(
    (acc, reward) => acc + reward.supplyApr,
    0,
  );

  const morphoApy = data.netApy - (nativeApy + otherRewards);

  return morphoApy;
}
