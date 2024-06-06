import { getMockFrameRequest } from '@coinbase/onchainkit/frame';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { frameData, options } = data;
  const postUrl = frameData.url;
  const debugPayload = getMockFrameRequest(
    { untrustedData: frameData, trustedData: { messageBytes: '' } },
    options,
  );

  const res = await fetch(postUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(debugPayload),
    redirect: 'manual',
  });

  if (res.status === 302) {
    const redirectUrl = res.headers.get('Location');
    return Response.json({ redirectUrl });
  }
  const html = await res.text();
  return Response.json({ html });
}
