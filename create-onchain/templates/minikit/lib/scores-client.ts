import { Score } from './scores';

export const MAX_SCORES = 8;

export async function getTopScores(): Promise<Score[]> {
  const res = await fetch('/api/scores');
  return res.json();
}

export async function addScore(score: Score): Promise<void> {
  await fetch('/api/scores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(score)
  });
}

export async function resetScores(): Promise<void> {
  await fetch('/api/scores', {
    method: 'DELETE'
  });
} 