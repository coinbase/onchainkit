import { FrameMetadataType } from '@coinbase/onchainkit';

export function frameResultToFrameMetadata(result: Record<string, string>): FrameMetadataType {
  const buttons = [1, 2, 3, 4].map((idx) =>
    result[`fc:frame:button:${idx}`]
      ? {
          action: result[`fc:frame:button:${idx}:action`],
          label: result[`fc:frame:button:${idx}`],
          target: result[`fc:frame:button:${idx}:target`],
        }
      : undefined,
  );
  const image = result['fc:frame:image'];
  const inputText = result['fc:frame:input'];
  const input = inputText ? { text: inputText } : undefined;
  const postUrl = result['fc:frame:post_url'];
  const rawState = result['fc:frame:state'];
  const rawRefreshPeriod = result['fc:frame:refresh_period'];
  const refreshPeriod = rawRefreshPeriod ? parseInt(rawRefreshPeriod, 10) : undefined;
  const state = rawState ? JSON.parse(result['fc:frame:state']) : undefined;

  return { buttons: buttons as any, image, input, postUrl, state, refreshPeriod };
}
