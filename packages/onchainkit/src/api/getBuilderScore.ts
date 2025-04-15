import type { Address } from 'viem';
import type { BuilderScore } from '../identity/types';

// Builder Score API endpoint
const BUILDER_SCORE_API_URL = 'https://api.developer.coinbase.com/builderscore';

/**
 * Fetches a builder score from the Builder Score API endpoint
 *
 * @param address - The wallet address to fetch the builder score for
 * @returns The builder score data
 */
export async function getBuilderScore(address: Address): Promise<BuilderScore> {
  if (!address) {
    throw new Error('Address is required');
  }

  try {
    const response = await fetch(`${BUILDER_SCORE_API_URL}?address=${address}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch builder score: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      points: data.points || 0,
      last_calculated_at: data.last_calculated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching builder score:', error);
    throw error;
  }
}
