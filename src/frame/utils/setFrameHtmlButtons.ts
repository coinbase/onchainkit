import type { FrameMetadataType } from '../types';

export function setFrameHtmlButtons(buttons: FrameMetadataType['buttons']) {
  if (!buttons) {
    return '';
  }

  return buttons
    .map((button, index) => {
      let buttonHtml = `  <meta property="fc:frame:button:${
        index + 1
      }" content="${button.label}" />\n`;
      if (button.action) {
        buttonHtml += `  <meta property="fc:frame:button:${
          index + 1
        }:action" content="${button.action}" />\n`;
      }
      if (button.target) {
        buttonHtml += `  <meta property="fc:frame:button:${
          index + 1
        }:target" content="${button.target}" />\n`;
      }
      if (
        button.action &&
        (button.action === 'tx' || button.action === 'post') &&
        button.postUrl
      ) {
        buttonHtml += `  <meta property="fc:frame:button:${
          index + 1
        }:post_url" content="${button.postUrl}" />\n`;
      }
      return buttonHtml;
    })
    .join('');
}
