import type { FrameMetadataType } from '../types';

export function setFrameMetadataButtons(
  metadata: Record<string, string>,
  buttons: FrameMetadataType['buttons'],
) {
  if (!buttons) {
    return;
  }

  buttons.forEach((button, index) => {
    metadata[`fc:frame:button:${index + 1}`] = button.label;
    if (button.action) {
      metadata[`fc:frame:button:${index + 1}:action`] = button.action;
    }
    if (button.target) {
      metadata[`fc:frame:button:${index + 1}:target`] = button.target;
    }
    if (
      button.action &&
      (button.action === 'tx' || button.action === 'post') &&
      button.postUrl
    ) {
      metadata[`fc:frame:button:${index + 1}:post_url`] = button.postUrl;
    }
  });
}
