import { Fragment } from 'react';
import type { FrameMetadataReact } from '../types';

/**
 * This component is used to add React Frame Metadata to the page.
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
export function FrameMetadata({
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
  wrapper: Wrapper = Fragment,
}: FrameMetadataReact) {
  const button1 = buttons?.[0];
  const button2 = buttons?.[1];
  const button3 = buttons?.[2];
  const button4 = buttons?.[3];
  const postUrlToUse = postUrl || post_url;
  const refreshPeriodToUse = refreshPeriod || refresh_period;
  const imageSrc = typeof image === 'string' ? image : image.src;
  const aspectRatio = typeof image === 'string' ? undefined : image.aspectRatio;

  // Important: To ensure smooth functionality when used
  // with Helmet as a wrapper component, it is crucial to flatten the Buttons loop.
  return (
    <Wrapper>
      {!!ogDescription && (
        <meta property="og:description" content={ogDescription} />
      )}
      {!!ogTitle && <meta property="og:title" content={ogTitle} />}
      <meta property="fc:frame" content="vNext" />
      <meta property="og:image" content={imageSrc} />
      {!!imageSrc && <meta property="fc:frame:image" content={imageSrc} />}
      {!!aspectRatio && (
        <meta property="fc:frame:image:aspect_ratio" content={aspectRatio} />
      )}
      {!!input && <meta property="fc:frame:input:text" content={input.text} />}
      {!!state && (
        <meta
          property="fc:frame:state"
          content={encodeURIComponent(JSON.stringify(state))}
        />
      )}

      {!!button1 && (
        <meta property="fc:frame:button:1" content={button1.label} />
      )}
      {!!(button1 && !!button1.action) && (
        <meta property="fc:frame:button:1:action" content={button1.action} />
      )}
      {!!button1?.target && (
        <meta property="fc:frame:button:1:target" content={button1.target} />
      )}
      {!!(button1 && button1.action === 'tx' && button1.postUrl) && (
        <meta property="fc:frame:button:1:post_url" content={button1.postUrl} />
      )}

      {!!button2 && (
        <meta property="fc:frame:button:2" content={button2.label} />
      )}
      {!!(button2 && !!button2.action) && (
        <meta property="fc:frame:button:2:action" content={button2.action} />
      )}
      {!!button2?.target && (
        <meta property="fc:frame:button:2:target" content={button2.target} />
      )}
      {!!(button2 && button2.action === 'tx' && button2.postUrl) && (
        <meta property="fc:frame:button:2:post_url" content={button2.postUrl} />
      )}

      {!!button3 && (
        <meta property="fc:frame:button:3" content={button3.label} />
      )}
      {!!(button3 && !!button3.action) && (
        <meta property="fc:frame:button:3:action" content={button3.action} />
      )}
      {!!button3?.target && (
        <meta property="fc:frame:button:3:target" content={button3.target} />
      )}
      {!!(button3 && button3.action === 'tx' && button3.postUrl) && (
        <meta property="fc:frame:button:3:post_url" content={button3.postUrl} />
      )}

      {!!button4 && (
        <meta property="fc:frame:button:4" content={button4.label} />
      )}
      {!!(button4 && !!button4.action) && (
        <meta property="fc:frame:button:4:action" content={button4.action} />
      )}
      {!!button4?.target && (
        <meta property="fc:frame:button:4:target" content={button4.target} />
      )}
      {!!(button4 && button4.action === 'tx' && button4.postUrl) && (
        <meta property="fc:frame:button:4:post_url" content={button4.postUrl} />
      )}

      {!!postUrlToUse && (
        <meta property="fc:frame:post_url" content={postUrlToUse} />
      )}

      {!!refreshPeriodToUse && (
        <meta
          property="fc:frame:refresh_period"
          content={refreshPeriodToUse.toString()}
        />
      )}

      {!!isOpenFrame && <meta property="of:version" content="vNext" />}

      {!!isOpenFrame && accepts && accepts.xmtp && (
        <meta property={'of:accepts:xmtp'} content={accepts.xmtp} />
      )}

      {!!isOpenFrame && imageSrc && (
        <meta property="of:image" content={imageSrc} />
      )}
    </Wrapper>
  );
}
