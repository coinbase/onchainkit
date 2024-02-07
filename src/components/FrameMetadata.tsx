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
 *   post_url="https://zizzamia.xyz/api/frame"
 * />
 * ```
 *
 * @param {FrameMetadataReact} props - The metadata for the frame.
 * @param {Array<{ label: string, action?: string }>} props.buttons - The buttons.
 * @param {string} props.image - The image URL.
 * @param {string} props.input - The input text.
 * @param {string} props.post_url - The post URL.
 * @param {number} props.refresh_period - The refresh period.
 * @param {React.ComponentType<any> | undefined} props.wrapper - The wrapper component meta tags are rendered in.
 * @returns {React.ReactElement} The FrameMetadata component.
 */
export function FrameMetadata({
  buttons,
  image,
  input,
  post_url,
  refresh_period,
  wrapper: Wrapper = Fragment,
}: FrameMetadataReact) {
  return (
    <Wrapper>
      <meta name="fc:frame" content="vNext" />
      {!!image && <meta name="fc:frame:image" content={image} />}
      {!!input && <meta name="fc:frame:input:text" content={input.text} />}

      {buttons?.map((button, index) => {
        return (
          <>
            <meta name={`fc:frame:button:${index + 1}`} content={button.label} />
            {!!button.action && (
              <meta name={`fc:frame:button:${index + 1}:action`} content={button.action} />
            )}
            {(button.action == 'link' || button.action == 'mint') && !!button.target && (
              <meta name={`fc:frame:button:${index + 1}:target`} content={button.target} />
            )}
          </>
        );
      })}

      {!!post_url && <meta name="fc:frame:post_url" content={post_url} />}

      {!!refresh_period && (
        <meta name="fc:frame:refresh_period" content={refresh_period.toString()} />
      )}
    </Wrapper>
  );
}
