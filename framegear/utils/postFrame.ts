import { FrameRequest, DebugFrameRequestOptions } from '@coinbase/onchainkit';

type FrameData = FrameRequest['untrustedData'];

export async function postFrame(frameData: FrameData, options?: DebugFrameRequestOptions) {
  const res = await fetch('/api/postFrame', {
    body: JSON.stringify({
      frameData,
      options,
    }),
    method: 'POST',
    headers: {
      contentType: 'application/json',
    },
  });
  const json = await res.json();
  console.log(json.text);
}
