import { FrameRequest, MockFrameRequestOptions } from '@coinbase/onchainkit';
import { parseHtml } from './parseHtml';

type FrameData = FrameRequest['untrustedData'];

export async function postFrame(frameData: FrameData, options?: MockFrameRequestOptions) {
  // TODO: handle exceptional cases
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
  const html = json.html;
  return parseHtml(html);
}
