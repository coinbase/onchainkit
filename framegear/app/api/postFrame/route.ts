import { NextRequest } from 'next/server';
import { getMockFrameRequest } from '@coinbase/onchainkit/frame';

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
  } else {
    const html = await res.text();
    return Response.json({ html });
  }
}
