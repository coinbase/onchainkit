import { FrameImageMetadata, FrameMetadataType } from '@coinbase/onchainkit';

export type FrameMetadataWithImageObject = FrameMetadataType & {
  image: FrameImageMetadata;
};

export function frameResultToFrameMetadata(
  result: Record<string, string>,
): FrameMetadataWithImageObject {
  const buttons = [1, 2, 3, 4].map((idx) =>
    result[`fc:frame:button:${idx}`]
      ? {
          action: result[`fc:frame:button:${idx}:action`],
          label: result[`fc:frame:button:${idx}`],
          target: result[`fc:frame:button:${idx}:target`],
        }
      : undefined,
  );
  const imageSrc = result['fc:frame:image'];
  const imageAspectRatio = result['fc:frame:image:aspect_ratio'];
  const inputText = result['fc:frame:input'];
  const input = inputText ? { text: inputText } : undefined;
  const postUrl = result['fc:frame:post_url'];
  const rawState = result['fc:frame:state'];
  const rawRefreshPeriod = result['fc:frame:refresh_period'];
  const refreshPeriod = rawRefreshPeriod ? parseInt(rawRefreshPeriod, 10) : undefined;
  const state = rawState ? JSON.parse(result['fc:frame:state']) : undefined;

  return {
    buttons: buttons as any,
    image: { src: imageSrc, aspectRatio: imageAspectRatio as any },
    input,
    postUrl,
    state,
    refreshPeriod,
  };
}
