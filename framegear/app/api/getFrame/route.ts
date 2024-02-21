import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const data = await req.json();
  try {
    const response = await fetch(data.url);
    const text = await response.text();
    return NextResponse.json({ html: text }, { status: 200 });
  } catch (error) {
    console.error('Error fetching frame:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
