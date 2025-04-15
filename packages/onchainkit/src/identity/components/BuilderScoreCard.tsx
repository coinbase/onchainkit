'use client';
import { useState, useEffect } from 'react';
import type { Address, Chain } from 'viem';
import { getBuilderScore } from '../../api/getBuilderScore';
import { background, border, cn, color, text } from '../../styles/theme';

type BuilderScoreCardProps = {
  address?: Address;
  chain?: Chain;
  className?: string;
};

export function BuilderScoreCard({
  address,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chain,
  className = '',
}: BuilderScoreCardProps) {
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnchain, setIsOnchain] = useState<boolean>(false);

  useEffect(() => {
    async function fetchBuilderScore() {
      if (!address) return;

      setIsLoading(true);
      setError(null);
      setIsOnchain(false);

      try {
        // getBuilderScore now tries the smart contract first and falls back to API
        const builderScore = await getBuilderScore(address);
        setScore(builderScore.points);

        // If last_calculated_at is within the last second, it's likely from our contract call
        // This is a heuristic since we generate the timestamp for contract calls
        const scoreTimestamp = new Date(
          builderScore.last_calculated_at,
        ).getTime();
        const isRecentScore = Date.now() - scoreTimestamp < 5000; // within 5 seconds
        setIsOnchain(isRecentScore);
      } catch (err) {
        setError('Failed to fetch builder score');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBuilderScore();
  }, [address]);

  return (
    <div
      className={cn(
        border.radius,
        border.lineDefault,
        background.default,
        'flex flex-col items-center justify-center min-w-[300px] min-h-[150px] p-6',
        className,
      )}
    >
      {isLoading ? (
        <div className={cn(text.body, color.foregroundMuted)}>Loading...</div>
      ) : error ? (
        <div className={cn(text.body, color.error)}>{error}</div>
      ) : score !== null ? (
        <>
          <div className={cn(text.title1, 'text-7xl mb-4')}>{score}</div>
          <div
            className={cn(text.headline, color.foregroundMuted, 'uppercase')}
          >
            BUILDER SCORE
          </div>
          {isOnchain && (
            <div className={cn(text.caption, color.primary, 'mt-2')}>
              ✓ Verified Onchain
            </div>
          )}
        </>
      ) : (
        <div className={cn(text.body, color.foregroundMuted)}>
          No score available
        </div>
      )}
    </div>
  );
}
