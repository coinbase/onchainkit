import { FrameMetadataType, FrameImageMetadata } from './types';

/**
 * Returns an HTML string containing metadata for a new valid frame.
 *
 * @param buttons: The buttons to use for the frame.
 * @param image: The image to use for the frame.
 * @param input: The text input to use for the frame.
 * @param postUrl: The URL to post the frame to.
 * @param refreshPeriod: The refresh period for the image used.
 * @returns An HTML string containing metadata for the frame.
 */
function getFrameHtmlResponse({
  buttons,
  image,
  input,
  postUrl,
  post_url,
  refreshPeriod,
  refresh_period,
}: FrameMetadataType): string {
  const ogImageHtml = `  <meta property="og:image" content="${image}" />\n`;

  // Set the image metadata if it exists.
  let imageHtml = '';
  if (typeof image === 'string') {
    imageHtml = `  <meta property="fc:frame:image" content="${image}" />\n`;
  } else {
    imageHtml = `  <meta property="fc:frame:image" content="${image.src}" />\n`;
    if (image.aspectRatio) {
      imageHtml += `  <meta property="fc:frame:image:aspect_ratio" content="${image.aspectRatio}" />\n`;
    }
  }

  // Set the input metadata if it exists.
  const inputHtml = input
    ? `  <meta property="fc:frame:input:text" content="${input.text}" />\n`
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
        if ((button.action == 'link' || button.action == 'mint') && button.target) {
          buttonHtml += `  <meta property="fc:frame:button:${index + 1}:target" content="${button.target}" />\n`;
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
  <meta property="fc:frame" content="vNext" />
${buttonsHtml}${imageHtml}${ogImageHtml}${inputHtml}${postUrlHtml}${refreshPeriodHtml}
</head>
</html>`;

  return html;
}

export { getFrameHtmlResponse };
