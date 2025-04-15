import type { Address } from 'viem';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';
import { TALENT_PROTOCOL_API_KEY } from '../identity/constants';

interface BuilderScore {
  points: number;
  last_calculated_at: string;
}

interface BuilderScoreResponse {
  score: BuilderScore;
}

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
 * Falls back to the API if the smart contract request fails
 *
 * @param address - The wallet address to fetch the builder score for
 * @returns The builder score data
 */
export async function getBuilderScore(address: Address): Promise<BuilderScore> {
  try {
    if (!address) {
      throw new Error('Address is required');
    }

    // First attempt: Try getting the score from the smart contract
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
    } catch (contractError) {
      console.info(
        'Could not fetch builder score from contract, falling back to API',
        contractError,
      );

      // Second attempt: Fall back to the API
      const response = await fetch(
        `https://api.talentprotocol.com/score?id=${address}&account_source=wallet`,
        {
          headers: {
            'X-API-KEY': TALENT_PROTOCOL_API_KEY,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch builder score: ${response.statusText}`,
        );
      }

      const data = (await response.json()) as BuilderScoreResponse;
      return data.score;
    }
  } catch (error) {
    console.error('Error fetching builder score:', error);
    throw error;
  }
}
