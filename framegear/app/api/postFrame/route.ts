import { NextRequest } from 'next/server';
import { getDebugFrameRequest } from '@coinbase/onchainkit';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { frameData, options } = data;
  const postUrl = frameData.url;
  const debugPayload = getDebugFrameRequest({ untrustedData: frameData }, options);

  const res = await fetch(postUrl, {
    method: 'POST',
    body: JSON.stringify(debugPayload),
  });

  const text = await res.text();

  return Response.json({ text });
}
