import { NextRequest } from 'next/server';
import { getMockFrameRequest } from '@coinbase/onchainkit';

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
    body: JSON.stringify(debugPayload),
  });

  const html = await res.text();

  return Response.json({ html });
}
