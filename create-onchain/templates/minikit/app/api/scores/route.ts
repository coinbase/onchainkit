import { NextResponse } from 'next/server';
import { getScores, setScore, resetScores } from '@/lib/scores';
import { Score } from '@/lib/scores';

export async function GET() {
  // Clear error handling for bootstrapped applications
  if (!process.env.REDIS_TOKEN || !process.env.REDIS_URL) {
    return NextResponse.json(
      {
        error:
          'REDIS_TOKEN and/or REDIS_URL is not set. Please set the REDIS_TOKEN and REDIS_URL environment variables or remove the sample application code.',
      },
      { status: 500 },
    );
  }

  const scores = await getScores();
  return NextResponse.json(scores);
}

export async function POST(request: Request) {
  const score: Score = await request.json();
  await setScore(score);
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  await resetScores();
  return NextResponse.json({ success: true });
}
