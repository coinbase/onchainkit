import { FrameMetadata } from './farcasterTypes';

/**
 * Returns an HTML string containing metadata for a new valid frame.
 *
 * @param buttons: The buttons to use for the frame.
 * @param image: The image to use for the frame.
 * @param post_url: The URL to post the frame to.
 * @param refresh_period: The refresh period for the image used.
 * @returns An HTML string containing metadata for the frame.
 */
function getFrameHtmlResponse({ buttons, image, post_url, refresh_period }: FrameMetadata): string {
  // Set the image metadata if it exists.
  const imageHtml = image ? `<meta property="fc:frame:image" content="${image}" />` : '';

  // Set the button metadata if it exists.
  let buttonsHtml = '';
  if (buttons) {
    buttonsHtml = buttons
      .map((button, index) => {
        let buttonHtml = `<meta property="fc:frame:button:${index + 1}" content="${button.label}" />`;
        if (button.action) {
          buttonHtml += `<meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />`;
        }
        return buttonHtml;
      })
      .join('');
  }

  // Set the post_url metadata if it exists.
  const postUrlHtml = post_url ? `<meta property="fc:frame:post_url" content="${post_url}" />` : '';

  // Set the refresh_period metadata if it exists.
  const refreshPeriodHtml = refresh_period
    ? `<meta property="fc:frame:refresh_period" content="${refresh_period.toString()}" />`
    : '';

  // Return the HTML string containing all the metadata.
  let html = '<!DOCTYPE html><html><head><meta property="fc:frame" content="vNext" />';
  html += `${imageHtml}${buttonsHtml}${postUrlHtml}${refreshPeriodHtml}</head></html>`;

  return html;
}

export { getFrameHtmlResponse };
