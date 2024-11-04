import type { FrameMetadataType } from '../types';
type FrameMetadataHtmlResponse = FrameMetadataType & {
    ogDescription?: string;
    ogTitle?: string;
};
/**
 * Returns an HTML string containing metadata for a new valid frame.
 */
declare function getFrameHtmlResponse({ accepts, buttons, image, input, isOpenFrame, ogDescription, ogTitle, postUrl, post_url, refreshPeriod, refresh_period, state, }: FrameMetadataHtmlResponse): string;
export { getFrameHtmlResponse };
//# sourceMappingURL=getFrameHtmlResponse.d.ts.map