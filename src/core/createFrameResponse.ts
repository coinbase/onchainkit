import { Button, FrameMetadata } from './sharedTypes';

/**
 * Creates a response with a new valid frame to be rendered.
 *
 * @param buttons: The buttons to use for the frame.
 * @param image: The image to use for the frame.
 * @param post_url: The URL to post the frame to.
 * @param refresh_period: The refresh period for the image used.
 * @returns An HTML response containing metadata for the frame.
 */
function createFrameResponse({
  buttons,
  image,
  post_url,
  refresh_period,
}: FrameMetadata): Response {
  const imageHtml = image ? `<meta property="fc:frame:image" content="${image}" />` : '';
  // Ensure only up to 4 buttons are processed
  let buttonsHtml = '';
  if (buttons) {
    const validButtons = buttons
      .slice(0, 4)
      .filter((button): button is Button => button !== undefined);
    buttonsHtml = validButtons
      .map((button, index) => {
        let buttonHtml = `<meta property="fc:frame:button:${index + 1}" content="${button.label}" />`;
        if (button.action) {
          buttonHtml += `\n<meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />`;
        }
        return buttonHtml;
      })
      .join('\n');
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

  const response = new Response(html);
  response.headers.set('Cache-Control', 'private, no-cache, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  return response;
}

export { createFrameResponse };
