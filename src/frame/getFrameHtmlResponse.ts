import { FrameMetadataType } from './types';

type FrameMetadataHTMLResponse = FrameMetadataType & {
  ogDescription?: string;
  ogTitle?: string;
};

/**
 * Returns an HTML string containing metadata for a new valid frame.
 *
 * @param buttons: The buttons to use for the frame.
 * @param image: The image to use for the frame.
 * @param input: The text input to use for the frame.
 * @param ogDescription: The Open Graph description for the frame.
 * @param ogTitle: The Open Graph title for the frame.
 * @param postUrl: The URL to post the frame to.
 * @param refreshPeriod: The refresh period for the image used.
 * @param state: The serialized state (e.g. JSON) for the frame.
 * @returns An HTML string containing metadata for the frame.
 */
function getFrameHtmlResponse({
  buttons,
  image,
  input,
  ogDescription,
  ogTitle,
  postUrl,
  post_url,
  refreshPeriod,
  refresh_period,
  state,
}: FrameMetadataHTMLResponse): string {
  const imgSrc = typeof image === 'string' ? image : image.src;
  const ogImageHtml = `  <meta property="og:image" content="${imgSrc}" />\n`;
  let imageHtml = `  <meta property="fc:frame:image" content="${imgSrc}" />\n`;
  if (typeof image !== 'string' && image.aspectRatio) {
    imageHtml += `  <meta property="fc:frame:image:aspect_ratio" content="${image.aspectRatio}" />\n`;
  }

  // Set the input metadata if it exists.
  const inputHtml = input
    ? `  <meta property="fc:frame:input:text" content="${input.text}" />\n`
    : '';

  // Set the state metadata if it exists.
  const stateHtml = state
    ? `  <meta property="fc:frame:state" content="${encodeURIComponent(JSON.stringify(state))}" />\n`
    : '';

  // Set the button metadata if it exists.
  let buttonsHtml = '';
  if (buttons) {
    buttonsHtml = buttons
      .map((button, index) => {
        let buttonHtml = `  <meta property="fc:frame:button:${index + 1}" content="${button.label}" />\n`;
        if (button.action) {
          buttonHtml += `  <meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />\n`;
        }
        if (button.target) {
          buttonHtml += `  <meta property="fc:frame:button:${index + 1}:target" content="${button.target}" />\n`;
        }
        if (button.action && button.action === 'tx' && button.postUrl) {
          buttonHtml += `  <meta property="fc:frame:button:${index + 1}:post_url" content="${button.postUrl}" />\n`;
        }
        return buttonHtml;
      })
      .join('');
  }

  // Set the post_url metadata if it exists.
  const postUrlToUse = postUrl || post_url;
  const postUrlHtml = postUrlToUse
    ? `  <meta property="fc:frame:post_url" content="${postUrlToUse}" />\n`
    : '';

  // Set the refresh_period metadata if it exists.
  const refreshPeriodToUse = refreshPeriod || refresh_period;
  const refreshPeriodHtml = refreshPeriodToUse
    ? `  <meta property="fc:frame:refresh_period" content="${refreshPeriodToUse.toString()}" />\n`
    : '';

  // Return the HTML string containing all the metadata.
  let html = `<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="${ogDescription || 'Frame description'}" />
  <meta property="og:title" content="${ogTitle || 'Frame title'}" />
  <meta property="fc:frame" content="vNext" />
${buttonsHtml}${ogImageHtml}${imageHtml}${inputHtml}${postUrlHtml}${refreshPeriodHtml}${stateHtml}
</head>
</html>`;

  return html;
}

export { getFrameHtmlResponse };
