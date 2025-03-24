import { NextResponse } from 'next/server';
import { getScores, setScore, resetScores } from '@/lib/scores';
import { Score } from '@/lib/scores';

export async function OPTIONS() {
  return NextResponse.json({
    enabled: !!(process.env.REDIS_TOKEN && process.env.REDIS_URL)
  });
}

export async function GET() {
  // Graceful fallback if Redis is not configured
  if (!process.env.REDIS_TOKEN || !process.env.REDIS_URL) {
    return NextResponse.json([]);
  }

  const scores = await getScores();
  return NextResponse.json(scores);
}

export async function POST(request: Request) {
  const score: Score = await request.json();
  await setScore(score);

  if (!process.env.REDIS_TOKEN || !process.env.REDIS_URL) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  if (!process.env.REDIS_TOKEN || !process.env.REDIS_URL) {
    return NextResponse.json({ success: true });
  }
  await resetScores();
  return NextResponse.json({ success: true });
}
