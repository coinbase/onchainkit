'use client';
import { useBuilderScore } from '../hooks/useBuilderScore';
import { background, border, cn, color, text } from '../../styles/theme';
import type { BuilderScoreCardReact } from '../types';

export function BuilderScoreCard({
  address,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chain,
  className = '',
}: BuilderScoreCardReact) {
  const { data: builderScore, isLoading, error } = useBuilderScore({ address });

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
        <div className={cn(text.body, color.error)}>
          Failed to fetch builder score
        </div>
      ) : builderScore ? (
        <>
          <div className={cn(text.title1, 'text-7xl mb-4')}>
            {builderScore.points}
          </div>
          <div
            className={cn(text.headline, color.foregroundMuted, 'uppercase')}
          >
            BUILDER SCORE
          </div>
          <div className={cn(text.caption, color.primary, 'mt-2')}>
            ✓ Verified Onchain
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <div className={cn(text.body, color.foregroundMuted, 'mb-3')}>
            No score available
          </div>
          <a
            href="https://www.talentprotocol.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              text.body,
              color.primary,
              'flex items-center underline hover:opacity-80 transition-opacity',
            )}
          >
            Claim a Builder Score
            <span
              className={cn(
                'ml-2 rounded-full bg-[#E0E7FF] px-2 py-0.5 text-center font-bold font-inter text-[#4F46E5] text-[0.6875rem] uppercase leading-none',
              )}
            >
              NEW
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
