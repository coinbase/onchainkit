import type { FrameMetadataResponse, FrameMetadataType } from '../types';

/**
 * This function generates the metadata for a Farcaster Frame.
 */
export const getFrameMetadata = ({
  accepts = {},
  buttons,
  image,
  input,
  isOpenFrame = false,
  postUrl,
  post_url,
  refreshPeriod,
  refresh_period,
  state,
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
}: FrameMetadataType): FrameMetadataResponse => {
  const postUrlToUse = postUrl || post_url;
  const refreshPeriodToUse = refreshPeriod || refresh_period;

  const metadata: Record<string, string> = {
    'fc:frame': 'vNext',
  };
  let imageSrc = '';
  if (typeof image === 'string') {
    imageSrc = image;
  } else {
    imageSrc = image.src;
    if (image.aspectRatio) {
      metadata['fc:frame:image:aspect_ratio'] = image.aspectRatio;
    }
  }
  metadata['fc:frame:image'] = imageSrc;
  if (input) {
    metadata['fc:frame:input:text'] = input.text;
  }
  if (buttons) {
    buttons.forEach((button, index) => {
      metadata[`fc:frame:button:${index + 1}`] = button.label;
      if (button.action) {
        metadata[`fc:frame:button:${index + 1}:action`] = button.action;
      }
      if (button.target) {
        metadata[`fc:frame:button:${index + 1}:target`] = button.target;
      }
      if (button.action && (button.action === 'tx' || button.action === 'post') && button.postUrl) {
        metadata[`fc:frame:button:${index + 1}:post_url`] = button.postUrl;
      }
    });
  }
  if (postUrlToUse) {
    metadata['fc:frame:post_url'] = postUrlToUse;
  }
  if (refreshPeriodToUse) {
    metadata['fc:frame:refresh_period'] = refreshPeriodToUse.toString();
  }
  if (state) {
    metadata['fc:frame:state'] = encodeURIComponent(JSON.stringify(state));
  }
  if (isOpenFrame) {
    metadata['of:version'] = 'vNext';
    if (accepts) {
      /* biome-ignore lint: code needs to be refactored */
      Object.keys(accepts).forEach((protocolIdentifier) => {
        metadata[`of:accepts:${protocolIdentifier}`] =
          accepts[protocolIdentifier];
      });
    }
    metadata['of:image'] = imageSrc;
  }
  return metadata;
};
