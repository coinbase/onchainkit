import { Fragment } from 'react';
import type { FrameMetadataType } from '../core/types';

type FrameMetadataReact = FrameMetadataType & {
  wrapper?: React.ComponentType<any>;
};

/**
 * FrameMetadata component
 *
 * @description
 * This component is used to add React Frame Metadata to the page.
 *
 * @example
 * ```tsx
 * <FrameMetadata
 *   buttons={[
 *     {
 *       label: 'Tell me the story',
 *     },
 *     {
 *       label: 'Redirect to cute dog pictures',
 *       action: 'post_redirect',
 *     },
 *     {
 *      label: 'Mint',
 *      action: 'mint',
 *      target: 'https://zizzamia.xyz/api/frame/mint',
 *    },
 *   ]}
 *   image="https://zizzamia.xyz/park-1.png"
 *   input={{
 *     text: 'Tell me a boat story',
 *   }}
 *   postUrl="https://zizzamia.xyz/api/frame"
 * />
 * ```
 *
 * @param {FrameMetadataReact} props - The metadata for the frame.
 * @param {Array<{ label: string, action?: string }>} props.buttons - The buttons.
 * @param {string} props.image - The image URL.
 * @param {string} props.input - The input text.
 * @param {string} props.postUrl - The post URL.
 * @param {number} props.refreshPeriod - The refresh period.
 * @param {React.ComponentType<any> | undefined} props.wrapper - The wrapper component meta tags are rendered in.
 * @returns {React.ReactElement} The FrameMetadata component.
 */
export function FrameMetadata({
  buttons,
  image,
  input,
  postUrl,
  post_url,
  refreshPeriod,
  refresh_period,
  wrapper: Wrapper = Fragment,
}: FrameMetadataReact) {
  const button1 = buttons && buttons[0];
  const button2 = buttons && buttons[1];
  const button3 = buttons && buttons[2];
  const button4 = buttons && buttons[3];
  const postUrlToUse = postUrl || post_url;
  const refreshPeriodToUse = refreshPeriod || refresh_period;

  // Important: To ensure smooth functionality when used
  // with Helmet as a wrapper component, it is crucial to flatten the Buttons loop.
  return (
    <Wrapper>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content={image} />
      <meta property="og:image" content={image} />
      {!!input && <meta property="fc:frame:input:text" content={input.text} />}

      {!!button1 && <meta property="fc:frame:button:1" content={button1.label} />}
      {!!(button1 && !!button1.action) && (
        <meta property="fc:frame:button:1:action" content={button1.action} />
      )}
      {!!(button1 && (button1.action == 'link' || button1.action == 'mint')) && (
        <meta property="fc:frame:button:1:target" content={button1.target} />
      )}

      {!!button2 && <meta property="fc:frame:button:2" content={button2.label} />}
      {!!(button2 && !!button2.action) && (
        <meta property="fc:frame:button:2:action" content={button2.action} />
      )}
      {!!(button2 && (button2.action == 'link' || button2.action == 'mint')) && (
        <meta property="fc:frame:button:2:target" content={button2.target} />
      )}

      {!!button3 && <meta property="fc:frame:button:3" content={button3.label} />}
      {!!(button3 && !!button3.action) && (
        <meta property="fc:frame:button:3:action" content={button3.action} />
      )}
      {!!(button3 && (button3.action == 'link' || button3.action == 'mint')) && (
        <meta property="fc:frame:button:3:target" content={button3.target} />
      )}

      {!!button4 && <meta property="fc:frame:button:4" content={button4.label} />}
      {!!(button4 && !!button4.action) && (
        <meta property="fc:frame:button:4:action" content={button4.action} />
      )}
      {!!(button4 && (button4.action == 'link' || button4.action == 'mint')) && (
        <meta property="fc:frame:button:4:target" content={button4.target} />
      )}

      {!!postUrlToUse && <meta property="fc:frame:post_url" content={postUrlToUse} />}

      {!!refreshPeriodToUse && (
        <meta property="fc:frame:refresh_period" content={refreshPeriodToUse.toString()} />
      )}
    </Wrapper>
  );
}
