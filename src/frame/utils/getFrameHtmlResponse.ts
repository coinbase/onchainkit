import type { FrameMetadataType } from '../types';
import { setFrameHtmlButtons } from './setFrameHtmlButtons';

type FrameMetadataHtmlResponse = FrameMetadataType & {
  ogDescription?: string;
  ogTitle?: string;
};

/**
 * Returns an HTML string containing metadata for a new valid frame.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
function getFrameHtmlResponse({
  accepts = {},
  buttons,
  image,
  input,
  isOpenFrame = false,
  ogDescription,
  ogTitle,
  postUrl,
  post_url,
  refreshPeriod,
  refresh_period,
  state,
}: FrameMetadataHtmlResponse): string {
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
    buttonsHtml = setFrameHtmlButtons(buttons);
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

  let ofHtml = '';
  // Set the Open Frames metadata
  if (isOpenFrame) {
    ofHtml = `  <meta property="of:version" content="vNext" />\n`;
    const ofAcceptsHtml = Object.keys(accepts)
      .map((protocolIdentifier) => {
        return `  <meta property="of:accepts:${protocolIdentifier}" content="${accepts[protocolIdentifier]}" />\n`;
      })
      .join('');
    const ofImageHtml = `  <meta property="of:image" content="${imgSrc}" />\n`;
    ofHtml += ofAcceptsHtml + ofImageHtml;
  }

  // Return the HTML string containing all the metadata.
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta property="og:description" content="${ogDescription || 'Frame description'}" />
  <meta property="og:title" content="${ogTitle || 'Frame title'}" />
  <meta property="fc:frame" content="vNext" />
${buttonsHtml}${ogImageHtml}${imageHtml}${inputHtml}${postUrlHtml}${refreshPeriodHtml}${stateHtml}${ofHtml}
</head>
</html>`;

  return html;
}

export { getFrameHtmlResponse };
