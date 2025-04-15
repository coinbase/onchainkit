import type { Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import type { BuilderScore } from '../identity/types';

// Builder Score contract on Base
const BUILDER_SCORE_CONTRACT = '0xBBFeDA7c4d8d9Df752542b03CdD715F790B32D0B';

// Simplified ABI for just the getScoreByAddress function
const builderScoreABI = [
  {
    inputs: [{ name: 'userAddress', type: 'address' }],
    name: 'getScoreByAddress',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

/**
 * Fetches a builder score from the Talent Protocol smart contract on Base
 *
 * @param address - The wallet address to fetch the builder score for
 * @returns The builder score data
 */
export async function getBuilderScore(address: Address): Promise<BuilderScore> {
  if (!address) {
    throw new Error('Address is required');
  }

  try {
    const client = createPublicClient({
      chain: base,
      transport: http(),
    });

    const scoreResult = await client.readContract({
      address: BUILDER_SCORE_CONTRACT as Address,
      abi: builderScoreABI,
      functionName: 'getScoreByAddress',
      args: [address],
    });

    // Convert BigInt to number
    const points = Number(scoreResult);

    return {
      points,
      last_calculated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching builder score from contract:', error);
    throw error;
  }
}
