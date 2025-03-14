import { NextResponse } from 'next/server';
import { getScores, setScore, resetScores } from '@/lib/scores';
import { Score } from '@/lib/scores';

export async function GET() {
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