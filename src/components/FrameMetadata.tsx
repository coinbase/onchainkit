import type { FrameMetadata as FrameMetadataType } from '../core/types';

/**
 *
 */
export function FrameMetadata({
  buttons,
  image,
  input,
  post_url,
  refresh_period,
}: FrameMetadataType) {
  return (
    <>
      <meta property="fc:frame" content="vNext" />
      {!!image && <meta property="fc:frame:image" content={image} />}
      {!!input && <meta property="fc:frame:input:text" content={input.text} />}

      {buttons?.map((button, index) => {
        return (
          <>
            <meta property={`fc:frame:button:${index + 1}`} content={button.label} />
            {!!button.action && (
              <meta property={`fc:frame:button:${index + 1}:action`} content={button.action} />
            )}
          </>
        );
      })}

      {!!post_url && <meta property="fc:frame:post_url" content={post_url} />}

      {!!refresh_period && (
        <meta property="fc:frame:refresh_period" content={refresh_period.toString()} />
      )}
    </>
  );
}
