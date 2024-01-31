import { FrameMetadata } from './farcasterTypes';

/**
 * Gets an HTML string containing metadata for a new valid frame.
 *
 * @param buttons: The buttons to use for the frame.
 * @param image: The image to use for the frame.
 * @param post_url: The URL to post the frame to.
 * @param refresh_period: The refresh period for the image used.
 * @returns An HTML string containing metadata for the frame.
 */
function getFrameHtml({
  buttons,
  image,
  post_url,
  refresh_period,
}: FrameMetadata): string {
  const imageHtml = image ? `<meta property="fc:frame:image" content="${image}" />` : '';
  // Ensure only up to 4 buttons are processed
  let buttonsHtml = '';
  if (buttons) {
    buttonsHtml = buttons.map((button, index) => {
        let buttonHtml = `<meta property="fc:frame:button:${index + 1}" content="${button.label}" />`;
        if (button.action) {
          buttonHtml += `<meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />`;
        }
        return buttonHtml;
      })
      .join('');
  }
  const postUrlHtml = post_url ? `<meta property="fc:frame:post_url" content="${post_url}" />` : '';
  const refreshPeriodHtml = refresh_period
    ? `<meta property="fc:frame:refresh_period" content="${refresh_period.toString()}" />`
    : '';

  const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        ${imageHtml}
        ${buttonsHtml}
        ${postUrlHtml}
        ${refreshPeriodHtml}
      </head>
    </html>`;

  return html;
}

export { getFrameHtml };
