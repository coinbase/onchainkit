import type { FrameMetadataType } from '../core/types';

/**
 * FrameMetadata component
 *
 * @description
 * This component is used to add React Frame Metadata to the page.
 *
 * @example
 * ```tsx
 * <FrameMetadata
 *  image="https://example.com/image.png"
 *  post_url="https://example.com"
 *  buttons={[{ label: 'button1' }]}
 * />
 * ```
 *
 * @param {FrameMetadataType} props - The metadata for the frame.
 * @param {string} props.image - The image URL.
 * @param {string} props.input - The input text.
 * @param {string} props.post_url - The post URL.
 * @param {number} props.refresh_period - The refresh period.
 * @param {Array<{ label: string, action?: string }>} props.buttons - The buttons.
 * @returns {React.ReactElement} The FrameMetadata component.
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
