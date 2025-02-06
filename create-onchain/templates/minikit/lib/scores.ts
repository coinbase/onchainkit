import { Address } from "viem";
import { redis } from "./redis";
import { MAX_SCORES } from "./scores-client";

export type Score = {
  attestationUid: string;
  transactionHash: string;
  address: Address;
  score: number;
}

const notificationServiceKey = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? 'minikit';

const scoresKey = `${notificationServiceKey}:scores`;

export async function getScores(): Promise<Score[]> {
  const exists = await redis.exists(scoresKey);
  if (!exists) {
    return [];
  }

  const scores = await redis.zrange(scoresKey, 0, -1, {
    withScores: true,
    rev: true
  }) as Array<{ address: Address, attestationUid: string, transactionHash: string } | number>;
  
  if (!Array.isArray(scores) || scores.length < 2) return [];
  
  const result: Score[] = [];
  
  // Process pairs of entries (member and score)
  for (let i = 0; i < scores.length; i += 2) {
    const memberData = scores[i] as { address: Address, attestationUid: string, transactionHash: string };
    const score = scores[i + 1] as number;
    
    result.push({
      ...memberData,
      score
    });
  }

  return result;
}

export async function setScore(score: Score): Promise<void> {
  await redis.zadd(scoresKey, {
    score: score.score,
    member: {
      attestationUid: score.attestationUid,
      transactionHash: score.transactionHash,
      address: score.address
    }
  });

  // only save the top MAX_SCORES scores
  const count = await redis.zcard(scoresKey);
  if (count > MAX_SCORES) {
    await redis.zremrangebyrank(scoresKey, 0, count - MAX_SCORES - 1);
  }  
}

export async function resetScores(): Promise<void> {
  await redis.del(scoresKey);
}